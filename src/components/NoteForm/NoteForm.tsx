import css from "./NoteForm.module.css"
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {type CreateNoteParams, createNote } from "../../services/noteService"

const NoteSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Minimum 3 characters required')
        .max(50, 'Maximum 50 characters allowed')
        .required('Title is required'),
    content: Yup.string()
        .max(500, 'Maximum 500 characters allowed'),
    tag: Yup.string()
        .oneOf(
            ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
            'Invalid tag selected'
        )
        .required('Tag is required'),
});

const initialValue = {
    title: '',
    content: '',
    tag: 'Todo',
};


interface NoteFormProps {
    onClose: () => void;
}


export default function NoteForm({ onClose }: NoteFormProps) {
    const queryClient = useQueryClient();

    const createNoteMutation = useMutation({
        mutationFn: (newNote: CreateNoteParams) => createNote(newNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onClose(); 
        },
    });


    return (
        <Formik
            initialValues={initialValue}
            validationSchema={NoteSchema}
            onSubmit={(values, actions) => {
    
                createNoteMutation.mutate(values as CreateNoteParams);
                actions.resetForm();
            }}
        >
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" type="text" name="title" className={css.input} />
                    <ErrorMessage component="span" name="title" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field
                        as="textarea"
                        id="content"
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage component="span" name="content" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage component="span" name="tag" className={css.error} />
                </div>

                <div className={css.actions}>
                    <button type="button" onClick={onClose} className={css.cancelButton}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={false}
                    >
                        Create note
                    </button>
                </div>
            </Form>
        </Formik>
    )
}