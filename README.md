# Embla Grid Slider

A React slider component with a **grid layout and column-first ordering**, built on [Embla Carousel](https://www.embla-carousel.com/) (`embla-carousel-react`, MIT).

**Live demo:** https://burcuxx.github.io/embla-grid-slider/

Items fill column by column: the first column fills top to bottom, then the next one starts. With `rows = 3`:

```
1  4  7  10
2  5  8  11
3  6  9  12
```

## Run it

```bash
npm install
npm run dev      # demo page
npm test         # ordering tests
npm run build    # type check + production build
```

## Usage

```tsx
import { GridSlider } from './GridSlider'

<GridSlider
  items={products}
  rows={2}               // 1–4
  columnsPerView={3}     // columns visible at once
  gap={12}               // px
  getKey={(p) => p.id}
  renderItem={(p) => <ProductCard product={p} />}
/>
```

| Prop | Default | Description |
| --- | --- | --- |
| `items` | — | Items to show |
| `renderItem` | — | `(item, index) => ReactNode` |
| `getKey` | index | React key for each item |
| `rows` | `2` | Rows per column (1–4). Out-of-range values are clamped, with a warning in development |
| `columnsPerView` | `3` | Number of visible columns |
| `gap` | `12` | Space between columns and rows (px) |
| `options` | — | Embla options (`loop`, `dragFree`, `slidesToScroll`, etc.) |
| `showDots` / `showArrows` | `true` | Page dots and previous/next arrows |
| `ariaLabel` | `"Slider"` | Label for screen readers |
| `onSelect` | — | Called when the selected page changes |

## How it works

`chunkColumns` splits the items into columns of `rows` items and pads the last column with empty cells. Each column is passed to Embla as one slide, so dragging and snapping work per column. The layout inside a column uses CSS grid, which keeps every row the same height.
