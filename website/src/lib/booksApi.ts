import type { Book, BooksCatalog } from './types'

function normalizeBook(raw: Book): Book {
  return {
    ...raw,
    subcategory: raw.subcategory ?? null,
    uploaded_by: raw.uploaded_by ?? null,
    uploaded_by_name: raw.uploaded_by_name ?? null,
    createdAt: raw.createdAt ?? null,
  }
}

export async function loadCatalog(): Promise<BooksCatalog> {
  const res = await fetch('/data/books.json')
  if (!res.ok) {
    throw new Error(`Failed to load catalog (${res.status})`)
  }
  const data = (await res.json()) as BooksCatalog
  return {
    ...data,
    books: (data.books ?? []).map(normalizeBook),
  }
}
