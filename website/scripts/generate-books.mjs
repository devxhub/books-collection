#!/usr/bin/env node
/**
 * Scans the monorepo root for PDFs and writes public/data/books.json.
 * Usage (from website/): node scripts/generate-books.mjs
 * Or: BOOKS_ROOT=.. node scripts/generate-books.mjs
 *
 * Preserves id / uploaded_by / uploaded_by_name / createdAt for existing paths.
 */
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEBSITE_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(
  process.env.BOOKS_ROOT || path.join(WEBSITE_ROOT, '..'),
)
const OUT_FILE = path.join(WEBSITE_ROOT, 'public', 'data', 'books.json')

const OWNER = 'devxhub'
const REPO = 'awesome-book-collection'
const BRANCH = 'main'

const SKIP_DIRS = new Set([
  '.git',
  'frontend',
  'website',
  'node_modules',
  'dist',
  '.vercel',
])

function walk(dir, relativeParts = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.') continue
    if (SKIP_DIRS.has(entry.name)) continue

    const abs = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(abs, [...relativeParts, entry.name]))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
      files.push({ abs, relativeParts, filename: entry.name })
    }
  }

  return files
}

function parseFilename(filename) {
  const base = filename.replace(/\.pdf$/i, '')
  const dashIdx = base.lastIndexOf(' - ')

  if (dashIdx > 0) {
    const left = base.slice(0, dashIdx).trim()
    const right = base.slice(dashIdx + 3).trim()
    const rightLooksLikeAuthor =
      right.length < 90 &&
      !/^\d{4}/.test(right) &&
      !/\(\s*20\d{2}/.test(right) &&
      !/_/.test(right.slice(0, 20))

    if (rightLooksLikeAuthor) {
      return {
        title: left.replace(/_/g, ' ').trim(),
        author: right.replace(/_/g, ' ').trim(),
      }
    }

    return {
      title: right.replace(/_/g, ' ').trim(),
      author: left.replace(/_/g, ' ').trim(),
    }
  }

  return {
    title: base.replace(/_/g, ' ').trim(),
    author: '',
  }
}

function encodePathSegments(relativePath) {
  return relativePath
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')
}

function isUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
}

function loadExistingByPath() {
  const map = new Map()
  if (!fs.existsSync(OUT_FILE)) return map
  try {
    const prev = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'))
    for (const book of prev.books ?? []) {
      if (book?.path) map.set(book.path, book)
    }
  } catch {
    // ignore corrupt previous catalog
  }
  return map
}

const existingByPath = loadExistingByPath()
const pdfs = walk(REPO_ROOT)
const categorySet = new Set()
const books = []

for (const file of pdfs) {
  const category = file.relativeParts[0] || 'Uncategorized'
  const subcategory =
    file.relativeParts.length > 1
      ? file.relativeParts.slice(1).join(' / ')
      : null

  categorySet.add(category)

  const relPath = [...file.relativeParts, file.filename].join('/')
  const encoded = encodePathSegments(relPath)
  const { title, author } = parseFilename(file.filename)
  const prev = existingByPath.get(relPath)

  const entry = {
    id: prev && isUuid(prev.id) ? prev.id : randomUUID(),
    title,
    author,
    category,
    subcategory,
    path: relPath,
    url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encoded}`,
    githubUrl: `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${encoded}`,
  }

  const uploaded_by = prev?.uploaded_by ?? null
  const uploaded_by_name = prev?.uploaded_by_name ?? null
  const createdAt = prev?.createdAt ?? null

  if (uploaded_by) entry.uploaded_by = uploaded_by
  if (uploaded_by_name) entry.uploaded_by_name = uploaded_by_name
  if (createdAt) entry.createdAt = createdAt

  books.push(entry)
}

books.sort((a, b) => {
  const c = a.category.localeCompare(b.category)
  if (c !== 0) return c
  return a.title.localeCompare(b.title)
})

const payload = {
  generatedAt: new Date().toISOString(),
  total: books.length,
  categories: [...categorySet].sort((a, b) => a.localeCompare(b)),
  books,
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n')

console.log(`Wrote ${books.length} books → ${path.relative(WEBSITE_ROOT, OUT_FILE)}`)
console.log(`Categories: ${payload.categories.length}`)
