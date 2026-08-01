export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0D0B19]">
      <div className="mx-auto flex h-auto min-h-14 max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-4 text-center text-sm leading-6 text-white/55 sm:px-6">
        <span>© 2026, Devxhub Limited, All Rights Reserved.</span>
        <span className="hidden text-white/25 sm:inline" aria-hidden>
          |
        </span>
        <a
          href="https://devxhub.com/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/55 no-underline transition hover:text-white"
        >
          Privacy Policy
        </a>
        <span className="hidden text-white/25 sm:inline" aria-hidden>
          |
        </span>
        <a
          href="https://devxhub.com/terms-of-use"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/55 no-underline transition hover:text-white"
        >
          Terms of Use
        </a>
      </div>
    </footer>
  )
}
