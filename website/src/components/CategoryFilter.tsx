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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-paper sm:text-2xl">
            Catalog
          </h2>
          <p className="mt-1 text-sm text-paper-muted">
            {resultCount} book{resultCount === 1 ? '' : 's'} shown
          </p>
        </div>
        {selected ? (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="inline-flex h-9 items-center font-ui text-sm font-semibold tracking-normal text-brand-gold hover:underline"
          >
            Clear filters
          </button>
        ) : (
          <span className="h-9" aria-hidden />
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

        <label
          className={[
            'flex min-w-0 flex-col gap-1.5',
            hasSubs ? 'animate-fade-in' : 'invisible pointer-events-none',
          ].join(' ')}
          aria-hidden={!hasSubs}
        >
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
            tabIndex={hasSubs ? 0 : -1}
            disabled={!hasSubs}
          >
            <option value="">All subcategories</option>
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
