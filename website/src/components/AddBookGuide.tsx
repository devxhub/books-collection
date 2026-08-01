const REPO_URL = 'https://github.com/devxhub/awesome-book-collection'
const NEW_PR_URL = `${REPO_URL}/compare`
const BOOKS_JSON_URL = `${REPO_URL}/blob/main/website/public/data/books.json`

const EXAMPLE_ENTRY = `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Designing Data-Intensive Applications",
  "author": "Martin Kleppmann",
  "category": "Software Architecture",
  "subcategory": null,
  "path": "Software Architecture/Designing Data-Intensive Applications - Martin Kleppmann.pdf",
  "url": "https://raw.githubusercontent.com/devxhub/awesome-book-collection/main/Software%20Architecture/Designing%20Data-Intensive%20Applications%20-%20Martin%20Kleppmann.pdf",
  "githubUrl": "https://github.com/devxhub/awesome-book-collection/blob/main/Software%20Architecture/Designing%20Data-Intensive%20Applications%20-%20Martin%20Kleppmann.pdf",
  "uploaded_by": "you@example.com",
  "uploaded_by_name": "Your Name",
  "createdAt": "2026-08-01T12:00:00.000Z"
}`

type AddBookGuideProps = {
  open: boolean
  onClose: () => void
}

export function AddBookGuide({ open, onClose }: AddBookGuideProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 animate-fade-in sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-book-title"
      onClick={onClose}
    >
      <div
        className="max-h-[100dvh] w-full max-w-lg overflow-y-auto border border-ink-border bg-ink-elevated animate-scale-in sm:max-h-[90vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-border px-5 py-4">
          <div>
            <h2 id="add-book-title" className="text-lg font-bold text-paper">
              Add a book
            </h2>
            <p className="mt-1 text-sm text-paper-muted">
              Contribute via GitHub — add the PDF and update the catalog JSON.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-paper-muted hover:bg-ink-soft hover:text-paper"
          >
            Close
          </button>
        </div>

        <ol className="space-y-4 px-5 py-5 text-sm leading-relaxed text-paper-muted">
          <li>
            <span className="font-semibold text-brand-gold">1.</span> Fork{' '}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-lime underline-offset-2 hover:underline"
            >
              awesome-book-collection
            </a>{' '}
            (or clone if you have write access).
          </li>
          <li>
            <span className="font-semibold text-brand-gold">2.</span> Add your
            PDF under the matching category folder at the repo root (e.g.{' '}
            <code className="text-paper">programming/Your Book - Author.pdf</code>
            ).
          </li>
          <li>
            <span className="font-semibold text-brand-gold">3.</span> Regenerate
            the catalog:
            <pre className="mt-2 overflow-x-auto rounded-lg border border-ink-border bg-ink px-3 py-2.5 text-xs text-paper">
              {`cd website
npm run generate:books`}
            </pre>
            <p className="mt-2">
              Or append an entry by hand to{' '}
              <a
                href={BOOKS_JSON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-lime underline-offset-2 hover:underline"
              >
                website/public/data/books.json
              </a>
              .
            </p>
          </li>
          <li>
            <span className="font-semibold text-brand-gold">4.</span> Set{' '}
            <code className="text-paper">uploaded_by</code> (email),{' '}
            <code className="text-paper">uploaded_by_name</code>, and{' '}
            <code className="text-paper">createdAt</code> so the card{' '}
            <span className="text-paper">i</span> button shows who added it.
            Use a UUID for <code className="text-paper">id</code>.
          </li>
          <li>
            <span className="font-semibold text-brand-gold">5.</span> Open a pull
            request with the PDF + updated{' '}
            <code className="text-paper">books.json</code>.
          </li>
        </ol>

        <div className="border-t border-ink-border px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper-muted">
            Book entry format
          </p>
          <pre className="mt-2 max-h-56 overflow-auto rounded-lg border border-ink-border bg-ink px-3 py-2.5 text-[11px] leading-relaxed text-paper">
            {EXAMPLE_ENTRY}
          </pre>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-ink-border px-5 py-4">
          <a
            href={NEW_PR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-brand-purple-deep"
          >
            Open GitHub
          </a>
          <a
            href={BOOKS_JSON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-ink-border px-4 py-2.5 text-sm font-medium text-paper-muted no-underline hover:text-paper"
          >
            View books.json
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-paper-muted hover:text-paper"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
