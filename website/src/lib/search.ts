import type { Book } from './types'

export type FilterState = {
  query: string
  category: string | null
  subcategory: string | null
}

export function filterBooks(books: Book[], filters: FilterState): Book[] {
  const q = filters.query.trim().toLowerCase()

  return books.filter((book) => {
    if (filters.category && book.category !== filters.category) return false
    if (filters.subcategory && book.subcategory !== filters.subcategory) {
      return false
    }
    if (!q) return true

    const haystack = [
      book.title,
      book.author,
      book.category,
      book.subcategory ?? '',
      book.path,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(q)
  })
}

export function subcategoriesFor(
  books: Book[],
  category: string | null,
): string[] {
  if (!category) return []
  const set = new Set<string>()
  for (const book of books) {
    if (book.category === category && book.subcategory) {
      set.add(book.subcategory)
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}
