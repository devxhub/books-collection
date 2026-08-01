export type Book = {
  id: string
  title: string
  author: string
  category: string
  subcategory: string | null
  path: string
  url: string
  githubUrl: string
  /** Contributor email — shown on the card info button */
  uploaded_by?: string | null
  /** Contributor display name */
  uploaded_by_name?: string | null
  /** ISO-8601 when the book was added */
  createdAt?: string | null
}

export type BooksCatalog = {
  generatedAt: string
  total: number
  categories: string[]
  books: Book[]
}
