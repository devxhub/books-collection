import { useEffect, useId, useRef, useState } from 'react'
import type { Book } from '../lib/types'

type BookCardProps = {
  book: Book
  onPreview: (book: Book) => void
  index: number
}

function formatAddedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function BookCard({ book, onPreview, index }: BookCardProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)

  const contributor = book.uploaded_by_name?.trim() || null
  const email = book.uploaded_by?.trim() || null
  const createdAt = book.createdAt?.trim() || null
  const hasMeta = Boolean(contributor || email || createdAt)

  useEffect(() => {
    if (!open) return

    function onPointerDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <article
      className="group relative animate-fade-up flex h-full flex-col rounded-xl border border-ink-border bg-ink-elevated/40 p-5 transition hover:border-brand-purple/40 hover:bg-ink-elevated"
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-xs font-semibold uppercase tracking-wider text-brand-gold">
            <span className="line-clamp-1">
              {book.category}
              {book.subcategory ? ` · ${book.subcategory}` : ''}
            </span>
          </p>

          {hasMeta ? (
            <div ref={wrapRef} className="relative shrink-0">
              <button
                type="button"
                aria-label="Who added this book"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((v) => !v)}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  open
                    ? 'border-brand-gold/50 bg-brand-gold/15 text-brand-gold'
                    : 'border-ink-border bg-ink-elevated text-paper-muted hover:border-brand-gold/40 hover:text-brand-gold'
                }`}
              >
                i
              </button>

              {open ? (
                <div
                  id={panelId}
                  role="dialog"
                  aria-label="Contribution details"
                  className="absolute right-0 top-[calc(100%+8px)] z-20 w-56 rounded-xl border border-ink-border bg-[#16141f] p-3.5 shadow-xl animate-fade-in"
                >
                  {createdAt ? (
                    <>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper-muted">
                        Added
                      </p>
                      <p className="mt-1 text-sm text-paper">
                        {formatAddedAt(createdAt)}
                      </p>
                    </>
                  ) : null}

                  {contributor || email ? (
                    <div
                      className={
                        createdAt
                          ? 'mt-3 border-t border-ink-border/80 pt-3'
                          : undefined
                      }
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper-muted">
                        Added by
                      </p>
                      {contributor ? (
                        <p className="mt-1 truncate text-sm font-medium text-paper">
                          {contributor}
                        </p>
                      ) : null}
                      {email ? (
                        <a
                          href={`mailto:${email}`}
                          className="mt-0.5 block truncate text-xs text-paper-muted no-underline transition hover:text-brand-gold"
                        >
                          {email}
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <span
              className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-lime opacity-70 transition group-hover:opacity-100"
              aria-hidden
            />
          )}
        </div>

        <h3 className="mt-2 line-clamp-3 font-sans text-lg font-semibold leading-snug text-paper">
          {book.title}
        </h3>

        <p className="mt-2 line-clamp-1 min-h-5 font-serif text-sm text-paper-muted">
          {book.author || 'Unknown author'}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onPreview(book)}
          className="ui-btn ui-btn-primary w-full"
        >
          Preview
        </button>
        <a
          href={book.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="ui-btn ui-btn-secondary w-full no-underline"
        >
          Download
        </a>
        <a
          href={book.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-btn ui-btn-ghost w-full no-underline"
        >
          GitHub
        </a>
      </div>
    </article>
  )
}
