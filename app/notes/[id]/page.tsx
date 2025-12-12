import { fetchNoteById } from "@/lib/api";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

type NotePageProps = {
  params: { id: string };
};

// 📌 SEO — generateMetadata
export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = params;

  const note = await fetchNoteById(id);

  const shortDescription =
    note.content.length > 120
      ? note.content.slice(0, 120) + "..."
      : note.content;

  return {
    title: note.title,
    description: shortDescription,
    openGraph: {
      title: note.title,
      description: shortDescription,
      url: `https://your-vercel-domain.vercel.app/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        },
      ],
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
