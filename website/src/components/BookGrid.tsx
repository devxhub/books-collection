import type { Book } from '../lib/types'
import { BookCard } from './BookCard'

type BookGridProps = {
  books: Book[]
  onPreview: (book: Book) => void
}

export function BookGrid({ books, onPreview }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="animate-fade-in rounded-xl border border-dashed border-ink-border bg-ink-elevated/20 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-paper">No books match</p>
        <p className="mt-2 text-sm text-paper-muted">
          Try another search term or clear the category filter.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book, index) => (
        <BookCard
          key={book.id}
          book={book}
          onPreview={onPreview}
          index={index}
        />
      ))}
    </div>
  )
}
