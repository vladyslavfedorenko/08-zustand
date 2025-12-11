import type { Metadata } from "next";
import css from "./page.module.css";

// 📌 SEO + Open Graph (требование задания)
export const metadata: Metadata = {
  title: "404 — Page Not Found | NoteHub",
  description: "The page you are trying to access does not exist on NoteHub.",

  openGraph: {
    title: "404 — Page Not Found | NoteHub",
    description: "The page you attempted to reach does not exist.",
    url: "https://your-vercel-domain.vercel.app/404", // заменишь после деплоя
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFound() {
  return (
    <div className="container">
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
