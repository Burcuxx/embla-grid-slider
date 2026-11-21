import { useCallback, useEffect, useMemo, useState, type CSSProperties, type Key, type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import { MAX_ROWS, MIN_ROWS, chunkColumns, clampRows } from './chunkColumns'
import './GridSlider.css'

export type GridSliderProps<T> = {
  items: readonly T[]
  renderItem: (item: T, index: number) => ReactNode
  getKey?: (item: T, index: number) => Key
  /** Rows per column, 1–4. Items fill each column top to bottom. */
  rows?: number
  /** How many columns are visible at once. */
  columnsPerView?: number
  /** Space between columns and rows, in px. */
  gap?: number
  /** Passed through to Embla. */
  options?: EmblaOptionsType
  showDots?: boolean
  showArrows?: boolean
  ariaLabel?: string
  onSelect?: (snapIndex: number) => void
}

/**
 * Grid slider built on Embla Carousel. Items fill each column top to bottom
 * (1–4 rows), and each column is one Embla slide, so dragging and snapping
 * move whole columns.
 */
export function GridSlider<T>({
  items,
  renderItem,
  getKey,
  rows = 2,
  columnsPerView = 3,
  gap = 12,
  options,
  showDots = true,
  showArrows = true,
  ariaLabel = 'Slider',
  onSelect,
}: GridSliderProps<T>) {
  if (import.meta.env.DEV && (rows < MIN_ROWS || rows > MAX_ROWS || !Number.isInteger(rows))) {
    console.warn(`GridSlider: rows must be an integer between ${MIN_ROWS} and ${MAX_ROWS}, got ${rows}.`)
  }
  const rowCount = clampRows(rows)
  const visibleColumns = Math.max(1, Math.floor(columnsPerView))
  const columns = useMemo(() => chunkColumns(items, rowCount), [items, rowCount])

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', ...options })
  const [snaps, setSnaps] = useState<number[]>([])
  const [selected, setSelected] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const sync = useCallback(
    (api: EmblaCarouselType) => {
      setSnaps(api.scrollSnapList())
      setSelected(api.selectedScrollSnap())
      setCanPrev(api.canScrollPrev())
      setCanNext(api.canScrollNext())
    },
    [],
  )

  useEffect(() => {
    if (!emblaApi) return
    const handleSelect = (api: EmblaCarouselType) => {
      sync(api)
      onSelect?.(api.selectedScrollSnap())
    }
    sync(emblaApi)
    emblaApi.on('reInit', sync).on('select', handleSelect)
    return () => {
      emblaApi.off('reInit', sync).off('select', handleSelect)
    }
  }, [emblaApi, sync, onSelect])

  // Column count or width changes alter the snap points.
  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, columns.length, visibleColumns, gap, rowCount])

  const style = {
    '--grid-slider-columns': visibleColumns,
    '--grid-slider-rows': rowCount,
    '--grid-slider-gap': `${gap}px`,
  } as CSSProperties

  return (
    <section className="grid-slider" style={style} aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="grid-slider__viewport" ref={emblaRef}>
        <div className="grid-slider__container">
          {columns.map((column, columnIndex) => (
            <div
              className="grid-slider__column"
              key={columnIndex}
              role="group"
              aria-roledescription="slide"
              aria-label={`${columnIndex + 1} / ${columns.length}`}
            >
              {column.map((item, rowIndex) => {
                const index = columnIndex * rowCount + rowIndex
                if (item === null) {
                  return <div className="grid-slider__cell grid-slider__cell--empty" key={`empty-${rowIndex}`} aria-hidden />
                }
                return (
                  <div className="grid-slider__cell" key={getKey ? getKey(item, index) : index}>
                    {renderItem(item, index)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {(showArrows || showDots) && snaps.length > 1 && (
        <div className="grid-slider__controls">
          {showArrows && (
            <button
              type="button"
              className="grid-slider__arrow"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous"
            >
              ‹
            </button>
          )}
          {showDots && (
            <div className="grid-slider__dots">
              {snaps.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={`grid-slider__dot${i === selected ? ' grid-slider__dot--active' : ''}`}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Page ${i + 1} of ${snaps.length}`}
                  aria-current={i === selected ? 'true' : undefined}
                />
              ))}
            </div>
          )}
          {showArrows && (
            <button
              type="button"
              className="grid-slider__arrow"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  )
}
