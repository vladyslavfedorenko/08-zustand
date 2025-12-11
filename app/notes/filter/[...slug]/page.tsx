import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";

interface PropsFilter {
  params: Promise<{ slug: string[] }>;
}

// --- SEO ---
export async function generateMetadata({
  params,
}: PropsFilter): Promise<Metadata> {
  const { slug } = await params; // <-- обязательно await

  const tag = slug[0] === "all" ? "All notes" : slug[0];
  const title = `Notes filtered by: ${tag}`;
  const description = `View notes filtered by category: ${tag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://your-vercel-domain.vercel.app/notes/filter/${slug.join(
        "/"
      )}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function Notes({ params }: PropsFilter) {
  const { slug } = await params; // <-- обязательно await
  const tag = slug[0] === "all" ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag],
    queryFn: () => fetchNotes({ search: "", page: 1, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
