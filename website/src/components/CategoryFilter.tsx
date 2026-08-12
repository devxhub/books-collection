type CategoryFilterProps = {
  categories: string[]
  selected: string | null
  subcategories: string[]
  selectedSubcategory: string | null
  onSelectCategory: (category: string | null) => void
  onSelectSubcategory: (subcategory: string | null) => void
  resultCount: number
}

export function CategoryFilter({
  categories,
  selected,
  subcategories,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
  resultCount,
}: CategoryFilterProps) {
  const hasSubs = subcategories.length > 0

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-paper sm:text-2xl">
            Catalog
          </h2>
          <p className="mt-1 text-sm text-paper-muted">
            {resultCount} book{resultCount === 1 ? '' : 's'} shown
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-3">
          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="font-ui text-xs font-semibold uppercase tracking-wider text-paper-muted">
              Category
            </span>
            <select
              value={selected ?? ''}
              onChange={(e) =>
                onSelectCategory(e.target.value ? e.target.value : null)
              }
              className="ui-select"
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          {hasSubs && (
            <label className="animate-fade-in flex min-w-0 flex-col gap-1.5">
              <span className="font-ui text-xs font-semibold uppercase tracking-wider text-paper-muted">
                Subcategory
              </span>
              <select
                value={selectedSubcategory ?? ''}
                onChange={(e) =>
                  onSelectSubcategory(e.target.value ? e.target.value : null)
                }
                className="ui-select"
                aria-label="Filter by subcategory"
              >
                <option value="">All subcategories</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="flex h-10 items-center">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              aria-label="Clear filters"
              className={[
                'group relative inline-flex h-10 w-10 items-center justify-center rounded-lg transition',
                selected
                  ? 'text-paper-muted hover:bg-ink-soft hover:text-brand-gold'
                  : 'invisible pointer-events-none',
              ].join(' ')}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-ink-border bg-ink-soft px-2 py-1 text-xs font-medium text-paper opacity-0 transition group-hover:opacity-100">
                Clear filters
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
