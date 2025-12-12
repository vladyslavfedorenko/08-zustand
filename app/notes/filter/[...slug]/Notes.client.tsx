"use client";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-hot-toast";
import Link from "next/link";

import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);

  // 🔥 Разделяем ввод и значение для запроса
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: response,
    isSuccess,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["notes", searchQuery, page, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search: searchQuery || undefined,
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

  // 🔥 Дебаунсим только значение для запроса
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 300);

  return (
    <>
      <section className={css.app}>
        <div className={css.toolbar}>
          <SearchBox
            search={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              handleSearch(e.target.value);
            }}
          />

          {/* 🔥 Пагинация только если данные есть */}
          {isSuccess && response.notes.length > 0 && totalPages > 0 && (
            <Pagination
              totalPages={totalPages}
              page={page}
              onPageChange={setPage}
            />
          )}

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
