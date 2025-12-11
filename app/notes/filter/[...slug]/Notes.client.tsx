"use client";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {
    data: response,
    isSuccess,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["notes", search, page, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search: search || undefined,
        tag: tag || undefined,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const totalPages = response?.totalPages ?? 0;

  useEffect(() => {
    if (response?.notes?.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [response?.notes]);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  return (
    <>
      <section className={css.app}>
        <Toaster />

        <div className={css.toolbar}>
          <SearchBox
            search={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {totalPages > 0 && (
            <Pagination
              totalPages={totalPages}
              page={page}
              onPageChange={setPage}
            />
          )}

          {/* Кнопка — теперь ссылка */}
          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </div>

        {(isLoading || isFetching) && <p>Loading...</p>}
        {isError && <p>Error loading notes</p>}

        {isSuccess && <NoteList notes={response.notes} />}
      </section>
    </>
  );
}
