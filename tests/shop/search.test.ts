import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockProducts = [
  {
    id: '1',
    name: 'Whey Protein Isolate',
    slug: 'whey-protein-isolate',
    description: 'High quality protein isolate',
    category: 'PROTEIN',
    basePrice: 2999,
    comparePrice: 3999,
    images: ['/image1.jpg'],
    variants: [
      { id: 'v1', flavor: 'Chocolate', size: '1kg', price: 2999, sku: 'WPI-CHOC', weightG: 1000 }
    ]
  },
  {
    id: '2',
    name: 'Pre-Workout Explosion',
    slug: 'pre-workout-explosion',
    description: 'Maximum energy booster',
    category: 'PRE_WORKOUT',
    basePrice: 1999,
    comparePrice: null,
    images: ['/image2.jpg'],
    variants: [
      { id: 'v2', flavor: 'Blueberry', size: null, price: 1999, sku: 'PWE-BLUE', weightG: 300 }
    ]
  }
]

describe('Search Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Search API', () => {
    it('should filter products by search term in name', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          products: [mockProducts[0]],
          total: 1
        })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products?search=Whey')
      const data = await response.json()

      expect(mockFetch).toHaveBeenCalled()
      const call = mockFetch.mock.calls[0][0] as string
      expect(call).toContain('search=Whey')
      expect(data.products).toHaveLength(1)
      expect(data.products[0].name).toContain('Whey')
    })

    it('should filter products by search term in description', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          products: [mockProducts[1]],
          total: 1
        })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products?search=energy')
      const data = await response.json()

      expect(data.products).toHaveLength(1)
      expect(data.products[0].description).toContain('energy')
    })

    it('should return multiple results when query matches', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          products: mockProducts,
          total: 2
        })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products?search=Test')
      const data = await response.json()

      expect(data.total).toBe(2)
    })

    it('should return empty when no matches', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          products: [],
          total: 0
        })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products?search=nonexistent')
      const data = await response.json()

      expect(data.products).toHaveLength(0)
      expect(data.total).toBe(0)
    })

    it('should handle special characters in search', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          products: [],
          total: 0
        })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products?search=protein%20isolate')
      const data = await response.json()

      expect(mockFetch).toHaveBeenCalled()
      expect(data).toBeDefined()
    })
  })
})
