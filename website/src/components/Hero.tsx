type HeroProps = {
  total: number
  categories: number
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
}

export function Hero({
  total,
  categories,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: HeroProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-ink-border"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex min-h-[min(68vh,600px)] max-w-6xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-20">
        <div className="animate-fade-up max-w-3xl">
          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-balance text-paper sm:text-5xl md:text-[3.5rem] md:leading-[1.1]">
            Awesome Book Collection
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg leading-relaxed text-pretty text-paper-muted sm:text-xl">
            A big collection of PDF books. <br />Search, preview, and download
            them for free.
          </p>
        </div>

        <div
          className="animate-fade-up mt-8 w-full max-w-2xl sm:mt-10"
          style={{ animationDelay: '120ms' }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSearchSubmit()
            }}
            className="flex h-12 items-stretch overflow-hidden rounded-xl border border-ink-border bg-ink-elevated transition focus-within:border-brand-purple/60"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search books
            </label>
            <span
              className="flex w-11 shrink-0 items-center justify-center text-brand-gold"
              aria-hidden
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" />
              </svg>
            </span>
            <input
              id="hero-search"
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, author, or category…"
              className="min-w-0 flex-1 bg-transparent pr-2 text-base text-paper outline-none placeholder:text-paper-muted/70"
              autoComplete="off"
            />
            <button
              type="submit"
              className="shrink-0 bg-brand-purple px-5 font-ui text-sm font-semibold tracking-normal text-white transition hover:bg-brand-purple-deep"
            >
              Search
            </button>
          </form>
          <p className="mt-3 text-sm text-paper-muted">
            <span className="font-semibold text-brand-lime">{total}</span> books
            across{' '}
            <span className="font-semibold text-brand-gold">{categories}</span>{' '}
            categories
          </p>
        </div>
      </div>
    </section>
  )
}
