"use client";

import { useRouter } from "next/navigation";
import css from "./NoteForm.module.css";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNoteAction } from "@/lib/actions/createNoteAction";

export default function NoteForm() {
  const router = useRouter();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  async function handleSubmit(formData: FormData) {
    await createNoteAction(formData); // серверная функция
    clearDraft();
    router.back();
  }

  return (
    <form className={css.form} action={handleSubmit}>
      <fieldset className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={draft.title}
          className={css.input}
          onChange={(e) => setDraft({ title: e.target.value })}
          required
        />
      </fieldset>

      <fieldset className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          defaultValue={draft.content}
          className={css.textarea}
          onChange={(e) => setDraft({ content: e.target.value })}
        />
      </fieldset>

      <fieldset className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          defaultValue={draft.tag}
          className={css.select}
          onChange={(e) => setDraft({ tag: e.target.value })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </fieldset>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
