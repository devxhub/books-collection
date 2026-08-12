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
          <a
            href="https://github.com/devxhub/awesome-book-collection"
            target="_blank"
            rel="noopener noreferrer"
            className="ui-nav rainbow-border h-10 gap-1.5 rounded-full bg-brand-purple px-4 text-[15px] text-white hover:bg-brand-purple-deep sm:px-5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
            </svg>
            Visit GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
