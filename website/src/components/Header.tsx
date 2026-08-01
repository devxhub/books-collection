import { ThemeToggle } from './ThemeToggle'

type HeaderProps = {
  onAddBook: () => void
  onBrowse: () => void
}

export function Header({ onAddBook, onBrowse }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0D0B19]">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <a
          href="https://devxhub.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center no-underline"
          aria-label="Devxhub"
        >
          <img
            src="/devxhub-icon.svg"
            alt="Devxhub"
            width={123}
            height={24}
            className="h-6 w-auto sm:h-7"
          />
        </a>

        <nav className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onBrowse}
            className="ui-nav h-10 px-1 text-[15px] text-white hover:text-white/80"
          >
            Catalog
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={onAddBook}
            className="ui-nav h-10 rounded-full bg-white px-5 text-[15px] text-[#0D0B19] hover:bg-white/90"
          >
            Add book
          </button>
        </nav>
      </div>
    </header>
  )
}
