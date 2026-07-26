import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export const NoteClient = axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
    headers: {
        Authorization: `Bearer ${TOKEN}`,
    },
});

interface FetchNotesParams {
    search?: string;
    tag?: NoteTag;
    page?: number;
    perPage?: number;
    sortBy?: 'created' | 'updated';
}

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export interface CreateNoteParams {
    title: string;
    content: string;
    tag: NoteTag;
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
    const response = await NoteClient.get<FetchNotesResponse>('/notes', { params });
    return response.data;
}

export async function createNote(params: CreateNoteParams): Promise<Note> {
    const response = await NoteClient.post<Note>('/notes', params);
    return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
    const response = await NoteClient.delete<Note>(`/notes/${id}`);
    return response.data;
}