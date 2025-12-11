"use server";

import { createNote } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createNoteAction(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;

  await createNote({ title, content, tag });

  // Обновить список заметок после создания
  revalidatePath("/notes");
}
