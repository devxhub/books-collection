import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { AddBookGuide } from '../components/AddBookGuide'
import { BookGrid } from '../components/BookGrid'
import { CategoryFilter } from '../components/CategoryFilter'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { PdfPreviewModal } from '../components/PdfPreviewModal'
import { loadCatalog } from '../lib/booksApi'
import { filterBooks, subcategoriesFor } from '../lib/search'
import type { Book, BooksCatalog } from '../lib/types'

export function HomePage() {
  const [catalog, setCatalog] = useState<BooksCatalog | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [category, setCategory] = useState<string | null>(null)
  const [subcategory, setSubcategory] = useState<string | null>(null)
  const [previewBook, setPreviewBook] = useState<Book | null>(null)
  const [addBookOpen, setAddBookOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const subcategories = useMemo(
    () => (catalog ? subcategoriesFor(catalog.books, category) : []),
    [catalog, category],
  )

  const filtered = useMemo(() => {
    if (!catalog) return []
    return filterBooks(catalog.books, {
      query: deferredQuery,
      category,
      subcategory,
    })
  }, [catalog, deferredQuery, category, subcategory])

  function handleSelectCategory(next: string | null) {
    setCategory(next)
    setSubcategory(null)
  }

  function scrollToCatalog() {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-mesh flex min-h-screen flex-col">
      <Header
        onAddBook={() => setAddBookOpen(true)}
        onBrowse={scrollToCatalog}
      />
      <Hero
        total={catalog?.total ?? 0}
        categories={catalog?.categories.length ?? 0}
        searchValue={query}
        onSearchChange={setQuery}
        onSearchSubmit={scrollToCatalog}
      />

      <main
        id="catalog"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16"
      >
        {loadError && (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {loadError}
          </p>
        )}

        {!catalog && !loadError && (
          <p className="text-paper-muted">Loading catalog…</p>
        )}

        {catalog && (
          <div className="space-y-8">
            <CategoryFilter
              categories={catalog.categories}
              selected={category}
              subcategories={subcategories}
              selectedSubcategory={subcategory}
              onSelectCategory={handleSelectCategory}
              onSelectSubcategory={setSubcategory}
              resultCount={filtered.length}
            />
            <BookGrid books={filtered} onPreview={setPreviewBook} />
          </div>
        )}
      </main>

      <Footer />

      <PdfPreviewModal
        book={previewBook}
        onClose={() => setPreviewBook(null)}
      />
      <AddBookGuide
        open={addBookOpen}
        onClose={() => setAddBookOpen(false)}
      />
    </div>
  )
}
