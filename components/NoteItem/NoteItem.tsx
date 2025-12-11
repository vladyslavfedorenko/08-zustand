import Link from "next/link";
import css from "./NoteItem.module.css";
import { Note } from "@/types/note";

export default function NoteItem({ note }: { note: Note }) {
  return (
    <li className={css.item}>
      <Link href={`/notes/${note.id}`} className={css.link}>
        <h3 className={css.title}>{note.title}</h3>
        <p className={css.excerpt}>{note.content.substring(0, 50)}...</p>
      </Link>
    </li>
  );
}
