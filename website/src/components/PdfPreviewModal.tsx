import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import type { Book } from '../lib/types'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

type PdfPreviewModalProps = {
  book: Book | null
  onClose: () => void
}

type FetchState =
  | { status: 'loading'; progress: number }
  | { status: 'ready'; data: Uint8Array }
  | { status: 'error'; message: string }

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2.5
const ZOOM_STEP = 0.15

export function PdfPreviewModal({ book, onClose }: PdfPreviewModalProps) {
  const [fetchState, setFetchState] = useState<FetchState>({
    status: 'loading',
    progress: 0,
  })
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [baseWidth, setBaseWidth] = useState(640)
  const [useNativeViewer, setUseNativeViewer] = useState(false)
  const [pageRendering, setPageRendering] = useState(true)

  const stageRef = useRef<HTMLDivElement>(null)
  const numPagesRef = useRef(0)
  numPagesRef.current = numPages

  const blobUrl = useMemo(() => {
    if (fetchState.status !== 'ready') return null
    // Fresh copy so pdf.js cannot detach the original buffer
    const copy = new Uint8Array(fetchState.data)
    return URL.createObjectURL(new Blob([copy], { type: 'application/pdf' }))
  }, [fetchState])

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl])

  const measure = useCallback(() => {
    const el = stageRef.current
    if (!el) return
    setBaseWidth(Math.max(280, el.clientWidth - 48))
  }, [])

  useLayoutEffect(() => {
    measure()
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure, fetchState.status, useNativeViewer])

  useEffect(() => {
    if (!book) return

    let cancelled = false
    setFetchState({ status: 'loading', progress: 0 })
    setNumPages(0)
    setPage(1)
    setZoom(1)
    setUseNativeViewer(false)
    setPageRendering(true)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    async function load(url: string) {
      try {
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? 'PDF not found on GitHub yet. Make sure the file is pushed to main.'
              : `Could not fetch PDF (HTTP ${res.status}).`,
          )
        }

        const total = Number(res.headers.get('content-length') || 0)
        const reader = res.body?.getReader()
        if (!reader) {
          const buf = new Uint8Array(await res.arrayBuffer())
          if (!cancelled) setFetchState({ status: 'ready', data: buf })
          return
        }

        const chunks: Uint8Array[] = []
        let received = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          if (value) {
            chunks.push(value)
            received += value.length
            if (!cancelled && total > 0) {
              setFetchState({
                status: 'loading',
                progress: Math.min(99, Math.round((received / total) * 100)),
              })
            }
          }
        }

        const merged = new Uint8Array(received)
        let offset = 0
        for (const chunk of chunks) {
          merged.set(chunk, offset)
          offset += chunk.length
        }

        const head = String.fromCharCode(...merged.slice(0, 5))
        if (!head.startsWith('%PDF')) {
          throw new Error('Downloaded file is not a valid PDF.')
        }

        if (!cancelled) setFetchState({ status: 'ready', data: merged })
      } catch (err) {
        if (cancelled) return
        setFetchState({
          status: 'error',
          message:
            err instanceof Error
              ? err.message
              : 'Failed to load PDF for preview.',
        })
      }
    }

    void load(book.url)

    return () => {
      cancelled = true
      document.body.style.overflow = prevOverflow
    }
  }, [book])

  useEffect(() => {
    if (!book || fetchState.status !== 'ready') return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (useNativeViewer) return
      if (e.target instanceof HTMLInputElement) return

      const max = numPagesRef.current
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        setPage((p) => Math.min(max || p, p + 1))
        setPageRendering(true)
        stageRef.current?.scrollTo({ top: 0 })
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setPage((p) => Math.max(1, p - 1))
        setPageRendering(true)
        stageRef.current?.scrollTo({ top: 0 })
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))
      }
      if (e.key === '-') {
        e.preventDefault()
        setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))
      }
      if (e.key === '0') {
        e.preventDefault()
        setZoom(1)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [book, fetchState.status, onClose, useNativeViewer])

  if (!book) return null

  const pageWidth = Math.round(baseWidth * zoom)
  const showToolbar = fetchState.status === 'ready' && !useNativeViewer

  function goPage(next: number) {
    if (!numPages) return
    setPage(Math.min(numPages, Math.max(1, next)))
    setPageRendering(true)
    stageRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 animate-fade-in sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onClick={onClose}
    >
      <div
        className="flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden border border-ink-border bg-[#1c1c1f] animate-scale-in sm:h-[94vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
              Preview
            </p>
            <h2
              id="preview-title"
              className="truncate text-base font-semibold text-paper sm:text-lg"
            >
              {book.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-paper-muted hover:bg-white/10 hover:text-paper"
          >
            Close
          </button>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-white/10 bg-black/30 px-3 py-2 sm:px-4">
          <a
            href={book.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-brand-purple px-3 py-1.5 text-sm font-semibold text-white no-underline hover:bg-brand-purple-deep"
          >
            Download
          </a>
          <a
            href={book.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm font-medium text-paper-muted no-underline hover:text-paper"
          >
            GitHub
          </a>
          {blobUrl && (
            <a
              href={blobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm font-medium text-brand-lime no-underline hover:underline"
            >
              Open in new tab
            </a>
          )}

          {showToolbar && (
            <>
              <div className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />
              <div className="flex items-center gap-1">
                <ToolBtn
                  label="Zoom out"
                  onClick={() =>
                    setZoom((z) =>
                      Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)),
                    )
                  }
                  disabled={zoom <= ZOOM_MIN}
                >
                  −
                </ToolBtn>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="min-w-14 rounded-md px-2 py-1 text-xs font-medium text-paper-muted hover:bg-white/10 hover:text-paper"
                  title="Reset zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <ToolBtn
                  label="Zoom in"
                  onClick={() =>
                    setZoom((z) =>
                      Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)),
                    )
                  }
                  disabled={zoom >= ZOOM_MAX}
                >
                  +
                </ToolBtn>
                <ToolBtn label="Fit width" onClick={() => setZoom(1)}>
                  Fit
                </ToolBtn>
              </div>

              {numPages > 0 && (
                <div className="ml-auto flex items-center gap-1.5">
                  <ToolBtn
                    label="Previous page"
                    onClick={() => goPage(page - 1)}
                    disabled={page <= 1}
                  >
                    ‹
                  </ToolBtn>
                  <label className="flex items-center gap-1.5 text-sm text-paper-muted">
                    <input
                      type="number"
                      min={1}
                      max={numPages}
                      value={page}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        if (Number.isFinite(v)) goPage(v)
                      }}
                      className="w-14 rounded-md border border-white/15 bg-black/40 px-2 py-1 text-center text-sm text-paper outline-none focus:border-brand-purple/60"
                    />
                    <span>/ {numPages}</span>
                  </label>
                  <ToolBtn
                    label="Next page"
                    onClick={() => goPage(page + 1)}
                    disabled={page >= numPages}
                  >
                    ›
                  </ToolBtn>
                </div>
              )}
            </>
          )}
        </div>

        <div
          ref={stageRef}
          className="relative min-h-0 flex-1 overflow-auto bg-[#525659]"
        >
          {fetchState.status === 'loading' && (
            <StatusPanel>
              <p className="text-sm text-white/80">Loading PDF…</p>
              <div className="mt-3 h-1.5 w-52 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-brand-purple transition-[width]"
                  style={{
                    width: `${Math.max(fetchState.progress, 8)}%`,
                  }}
                />
              </div>
              {fetchState.progress > 0 && (
                <p className="mt-2 text-xs text-white/50">
                  {fetchState.progress}%
                </p>
              )}
            </StatusPanel>
          )}

          {fetchState.status === 'error' && (
            <StatusPanel>
              <p className="max-w-md text-white">{fetchState.message}</p>
              <div className="mt-4 flex gap-2">
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-brand-purple px-3 py-2 text-sm font-semibold text-white no-underline"
                >
                  Open raw PDF
                </a>
                <a
                  href={book.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/20 px-3 py-2 text-sm text-white no-underline"
                >
                  GitHub
                </a>
              </div>
            </StatusPanel>
          )}

          {fetchState.status === 'ready' && blobUrl && useNativeViewer && (
            <iframe
              title={`${book.title} preview`}
              src={`${blobUrl}#view=FitH`}
              className="absolute inset-0 h-full w-full border-0 bg-white"
            />
          )}

          {fetchState.status === 'ready' && blobUrl && !useNativeViewer && (
            <div className="flex min-h-full justify-center px-3 py-6 sm:px-6">
              <div className="relative shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
                {pageRendering && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#525659]/50">
                    <p className="rounded-md bg-black/50 px-3 py-1.5 text-sm text-white/90">
                      Rendering page…
                    </p>
                  </div>
                )}
                <Document
                  file={blobUrl}
                  loading={null}
                  onLoadSuccess={({ numPages: n }) => {
                    setNumPages(n)
                    setPage(1)
                    setPageRendering(false)
                  }}
                  onLoadError={() => {
                    // Fall back to browser PDF viewer for unsupported PDFs
                    setUseNativeViewer(true)
                    setPageRendering(false)
                  }}
                  className="leading-none"
                >
                  <Page
                    key={`${page}-${pageWidth}`}
                    pageNumber={page}
                    width={pageWidth}
                    renderTextLayer
                    renderAnnotationLayer
                    className="bg-white"
                    loading={null}
                    onRenderSuccess={() => setPageRendering(false)}
                    onRenderError={() => setUseNativeViewer(true)}
                  />
                </Document>
              </div>
            </div>
          )}
        </div>

        <p className="shrink-0 border-t border-white/10 px-4 py-1.5 text-center text-[11px] text-white/40">
          {useNativeViewer
            ? 'Browser PDF viewer · Esc close'
            : '← → page · + − zoom · Esc close'}
        </p>
      </div>
    </div>
  )
}

function ToolBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 min-w-8 items-center justify-center rounded-md border border-white/15 bg-white/5 px-2 text-sm font-semibold text-paper transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  )
}

function StatusPanel({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      {children}
    </div>
  )
}
