import { useMemo, useState } from 'react'
import { GridSlider } from './GridSlider'

const HUES = [250, 200, 160, 30, 340, 280]

export function App() {
  const [rows, setRows] = useState(2)
  const [columnsPerView, setColumnsPerView] = useState(3)
  const [count, setCount] = useState(14)
  const items = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count])

  return (
    <main className="demo">
      <h1>Embla Grid Slider</h1>
      <p className="demo__hint">
        Öğeler sütun sütun dizilir: önce ilk sütun yukarıdan aşağıya dolar, sonra bir sonrakine geçilir.
      </p>

      <div className="demo__controls">
        <label>
          Satır
          <select value={rows} onChange={(e) => setRows(Number(e.target.value))}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Görünen sütun
          <select value={columnsPerView} onChange={(e) => setColumnsPerView(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Öğe sayısı
          <input
            type="number"
            min={0}
            max={60}
            value={count}
            onChange={(e) => setCount(Math.max(0, Math.min(60, Number(e.target.value) || 0)))}
          />
        </label>
      </div>

      <GridSlider
        items={items}
        rows={rows}
        columnsPerView={columnsPerView}
        ariaLabel="Örnek kartlar"
        renderItem={(n) => (
          <div className="demo__card" style={{ background: `hsl(${HUES[(n - 1) % HUES.length]} 70% 92%)` }}>
            {n}
          </div>
        )}
      />
    </main>
  )
}
