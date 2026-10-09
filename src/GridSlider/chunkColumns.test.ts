import { describe, expect, it } from 'vitest'
import { chunkColumns, clampRows } from './chunkColumns'

const items = Array.from({ length: 12 }, (_, i) => i)

describe('chunkColumns', () => {
  it.each([
    [1, [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11]]],
    [2, [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11]]],
    [3, [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]]],
    [4, [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]]],
  ])('fills columns top to bottom with %i row(s)', (rows, expected) => {
    expect(chunkColumns(items, rows)).toEqual(expected)
  })

  it('pads the last column with null', () => {
    expect(chunkColumns(items.slice(0, 7), 3)).toEqual([
      [0, 1, 2],
      [3, 4, 5],
      [6, null, null],
    ])
  })

  it('returns no columns for no items', () => {
    expect(chunkColumns([], 2)).toEqual([])
  })
})

describe('clampRows', () => {
  it('keeps rows between 1 and 4', () => {
    expect(clampRows(0)).toBe(1)
    expect(clampRows(9)).toBe(4)
    expect(clampRows(2.7)).toBe(2)
    expect(clampRows(Number.NaN)).toBe(1)
  })
})
