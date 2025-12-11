import axios from "axios";
import type { Note } from "@/types/note";

interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export async function fetchNotes(params: FetchNotesParams) {
  const response = await api.get<FetchNotesResponse>("/notes", { params });
  return response.data;
}

export async function fetchNoteById(id: string) {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(data: {
  title: string;
  content: string;
  tag?: string;
}) {
  const response = await api.post<Note>("/notes", data);
  return response.data;
}

export async function deleteNote(id: string) {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}
