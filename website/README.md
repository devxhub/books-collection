# Awesome Book Collection — Website

Public catalog for the [Devxhub Awesome Book Collection](https://github.com/devxhub/awesome-book-collection). Search, filter, preview, and download. Catalog metadata is static JSON (`public/data/books.json`); PDFs stay on GitHub.

## Setup

```bash
cd website
npm install
npm run generate:books   # refresh books.json from repo PDFs
npm run dev
```

## Book JSON format

Root file: `public/data/books.json`

```json
{
  "generatedAt": "2026-08-01T12:00:00.000Z",
  "total": 1,
  "categories": ["Software Architecture"],
  "books": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Designing Data-Intensive Applications",
      "author": "Martin Kleppmann",
      "category": "Software Architecture",
      "subcategory": null,
      "path": "Software Architecture/Designing Data-Intensive Applications - Martin Kleppmann.pdf",
      "url": "https://raw.githubusercontent.com/devxhub/awesome-book-collection/main/…",
      "githubUrl": "https://github.com/devxhub/awesome-book-collection/blob/main/…",
      "uploaded_by": "you@example.com",
      "uploaded_by_name": "Your Name",
      "createdAt": "2026-08-01T12:00:00.000Z"
    }
  ]
}
```

| Field | Required | Notes |
|-------|----------|--------|
| `id` | yes | UUID |
| `title`, `author`, `category` | yes | |
| `subcategory` | no | `null` or string |
| `path`, `url`, `githubUrl` | yes | PDF location |
| `uploaded_by` | no | Contributor **email** (card info button) |
| `uploaded_by_name` | no | Contributor name |
| `createdAt` | no | ISO-8601; when it was added |

When `uploaded_by` / `uploaded_by_name` / `createdAt` are set, the catalog card shows the top-right **i** button with that info.

## Add a book

1. Add the PDF under the right category folder in the repo root.
2. From `website/`, run `npm run generate:books` (or edit `public/data/books.json` by hand).
3. Set `uploaded_by`, `uploaded_by_name`, and `createdAt` on your entry (keep a UUID `id`).
4. Open a pull request with the PDF + updated JSON.

The in-app **Add book** button shows these same steps and the JSON example.

## Vercel

1. Root Directory: `website`
2. Build: `npm run build` → `dist`
3. No env vars required

## Docker

```bash
cd website
docker compose --profile tools run --rm generate-books
docker compose up --build
```

App: [http://localhost:3000](http://localhost:3000)
