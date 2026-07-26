import { useState } from 'react'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query' 
import { useDebouncedCallback } from 'use-debounce'

import { fetchNotes, createNote, type CreateNoteParams, deleteNote } from '../../services/noteService' 
import NoteList from '../NoteList/NoteList'
import Pagination from '../Pagination/Pagination'
import SearchBox from '../SearchBox/SearchBox'
import Modal from '../Modal/Modal'
import NoteForm from '../NoteForm/NoteForm' 

import './App.css'
import css from './App.module.css'

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({
      page,
      perPage: 10,
      sortBy: 'created',
      search,
    }),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation({
    mutationFn: (newNote: CreateNoteParams ) => createNote(newNote), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] }); 
      setIsModalOpen(false); 
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const notesArray = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = useDebouncedCallback((search: string) => {
    setSearch(search);
    setPage(1);
  }, 1000);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch}/>
        {totalPages > 1 && (<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />)}
        <button type="button" onClick={() => setIsModalOpen(true)} className={css.button}>
            Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Oops! Something went wrong.</p>}

      {!isLoading && !isError && notesArray.length > 0 && (
        <NoteList notes={notesArray}
          onDelete={(id) => deleteNoteMutation.mutate(id)} />
      )}

      {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
              <NoteForm 
                  onClose={() => setIsModalOpen(false)} 
                  onSubmit={(values) => createNoteMutation.mutate(values as CreateNoteParams)} 
              />
          </Modal>
      )}
    </div>
  );
}

export default App