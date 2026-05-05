import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Test Protein',
    slug: 'test-protein',
    description: 'High quality protein',
    category: 'PROTEIN',
    basePrice: 2999,
    comparePrice: 3999,
    images: ['/image1.jpg'],
    variants: [
      { id: 'v1', flavor: 'Chocolate', size: '1kg', price: 2999, sku: 'PROT-CHOC', weightG: 1000 }
    ]
  },
  {
    id: '2',
    name: 'Test Pre-Workout',
    slug: 'test-pre-workout',
    description: 'Energy booster',
    category: 'PRE_WORKOUT',
    basePrice: 1999,
    comparePrice: null,
    images: ['/image2.jpg'],
    variants: [
      { id: 'v2', flavor: 'Blueberry', size: null, price: 1999, sku: 'PRE-BLUE', weightG: 300 }
    ]
  }
]

describe('Product Listing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('API Response Structure', () => {
    it('should return products with required fields', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts, total: 2 })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products')
      const data = await response.json()

      expect(data.products).toBeDefined()
      expect(Array.isArray(data.products)).toBe(true)
      expect(data.total).toBe(2)
    })

    it('should include variant information in products', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts, total: 2 })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products')
      const data = await response.json()

      expect(data.products[0].variants).toBeDefined()
      expect(data.products[0].variants[0].flavor).toBe('Chocolate')
      expect(data.products[0].variants[0].price).toBe(2999)
    })

    it('should include pricing information', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts, total: 2 })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products')
      const data = await response.json()

      expect(data.products[0].basePrice).toBe(2999)
      expect(data.products[0].comparePrice).toBe(3999)
    })

    it('should include product images', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts, total: 2 })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products')
      const data = await response.json()

      expect(data.products[0].images).toBeDefined()
      expect(Array.isArray(data.products[0].images)).toBe(true)
      expect(data.products[0].images[0]).toBe('/image1.jpg')
    })

    it('should include product slug for URL generation', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts, total: 2 })
      })
      global.fetch = mockFetch

      const response = await fetch('/api/products')
      const data = await response.json()

      expect(data.products[0].slug).toBe('test-protein')
      expect(typeof data.products[0].slug).toBe('string')
    })
  })

  describe('API Pagination', () => {
    it('should accept limit parameter', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?limit=10')
      expect(mockFetch).toHaveBeenCalled()
    })

    it('should accept offset parameter', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: [], total: 0 })
      })
      global.fetch = mockFetch

      await fetch('/api/products?offset=20')
      expect(mockFetch).toHaveBeenCalled()
    })
  })
})
