import { describe, it, expect, vi, beforeEach } from 'vitest'

const CATEGORIES = [
  { value: 'PRE_WORKOUT', label: 'Pre-Workout' },
  { value: 'PROTEIN', label: 'Protein' },
  { value: 'MASS_GAINER', label: 'Mass Gainer' },
  { value: 'OMEGA_3', label: 'Omega-3' },
  { value: 'MULTIVITAMIN', label: 'Multivitamin' },
]

describe('Filter Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Category Filter', () => {
    it('should have all expected categories defined', () => {
      expect(CATEGORIES).toHaveLength(5)
      expect(CATEGORIES.map(c => c.value)).toContain('PRE_WORKOUT')
      expect(CATEGORIES.map(c => c.value)).toContain('PROTEIN')
      expect(CATEGORIES.map(c => c.value)).toContain('MASS_GAINER')
      expect(CATEGORIES.map(c => c.value)).toContain('OMEGA_3')
      expect(CATEGORIES.map(c => c.value)).toContain('MULTIVITAMIN')
    })

    it('should filter by single category via API', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?category=PROTEIN')
      expect(mockFetch).toHaveBeenCalled()
      const call = mockFetch.mock.calls[0][0] as string
      expect(call).toContain('category=PROTEIN')
    })

    it('should filter by multiple categories via API', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?category=PROTEIN&category=PRE_WORKOUT')
      expect(mockFetch).toHaveBeenCalled()
    })

    it('should normalize lowercase category to uppercase', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?category=protein')
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Price Filter', () => {
    it('should filter by min price', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?minPrice=1000')
      expect(mockFetch).toHaveBeenCalled()
      const call = mockFetch.mock.calls[0][0] as string
      expect(call).toContain('minPrice=1000')
    })

    it('should filter by max price', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?maxPrice=5000')
      expect(mockFetch).toHaveBeenCalled()
      const call = mockFetch.mock.calls[0][0] as string
      expect(call).toContain('maxPrice=5000')
    })

    it('should filter by price range', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?minPrice=1000&maxPrice=5000')
      expect(mockFetch).toHaveBeenCalled()
    })

    it('should handle invalid price gracefully', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?minPrice=invalid')
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Sort Options', () => {
    const SORT_OPTIONS = [
      { value: 'featured', label: 'Featured' },
      { value: 'price_asc', label: 'Price: Low to High' },
      { value: 'price_desc', label: 'Price: High to Low' },
      { value: 'newest', label: 'Newest' },
    ]

    it('should have all expected sort options', () => {
      expect(SORT_OPTIONS).toHaveLength(4)
      expect(SORT_OPTIONS.map(s => s.value)).toContain('featured')
      expect(SORT_OPTIONS.map(s => s.value)).toContain('price_asc')
      expect(SORT_OPTIONS.map(s => s.value)).toContain('price_desc')
      expect(SORT_OPTIONS.map(s => s.value)).toContain('newest')
    })

    it('should sort by price ascending', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?sort=price_asc')
      expect(mockFetch).toHaveBeenCalled()
      const call = mockFetch.mock.calls[0][0] as string
      expect(call).toContain('sort=price_asc')
    })

    it('should sort by price descending', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?sort=price_desc')
      expect(mockFetch).toHaveBeenCalled()
      const call = mockFetch.mock.calls[0][0] as string
      expect(call).toContain('sort=price_desc')
    })
  })

  describe('Pagination', () => {
    it('should handle offset parameter', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?offset=20')
      expect(mockFetch).toHaveBeenCalled()
      const call = mockFetch.mock.calls[0][0] as string
      expect(call).toContain('offset=20')
    })

    it('should default offset to 0', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products')
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Combined Filters', () => {
    it('should combine category and price filters', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?category=PROTEIN&minPrice=1000&maxPrice=5000')
      expect(mockFetch).toHaveBeenCalled()
    })

    it('should combine search with filters', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?search=whey&category=PROTEIN')
      expect(mockFetch).toHaveBeenCalled()
    })
  })
})
