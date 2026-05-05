import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCartStore, CartItem } from '@/store/cart-store'

describe('Cart Add Flow', () => {
  beforeEach(() => {
    // Reset store state
    useCartStore.setState({
      items: [],
      isOpen: false,
      email: null,
      name: null,
      abandonedAt: null,
      orderId: null,
    })
  })

  describe('addItem', () => {
    it('should add a new item to cart', () => {
      const store = useCartStore.getState()

      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 1,
        image: '/image.jpg',
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].name).toBe('Test Protein')
      expect(state.items[0].flavor).toBe('Chocolate')
      expect(state.items[0].price).toBe(2999)
      expect(state.items[0].quantity).toBe(1)
    })

    it('should generate unique id for cart item', () => {
      const store = useCartStore.getState()

      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Product',
        flavor: 'Vanilla',
        price: 1999,
        quantity: 1,
      })

      const state = useCartStore.getState()
      expect(state.items[0].id).toBeDefined()
      expect(typeof state.items[0].id).toBe('string')
      expect(state.items[0].id.length).toBeGreaterThan(0)
    })

    it('should increase quantity for existing variant', () => {
      const store = useCartStore.getState()

      // Add first item
      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 1,
      })

      // Add same variant again
      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 2,
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(3) // 1 + 2
    })

    it('should cap quantity at 10', () => {
      const store = useCartStore.getState()

      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 10,
      })

      // Try to add more
      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 5,
      })

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(10)
    })

    it('should add different variants as separate items', () => {
      const store = useCartStore.getState()

      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 1,
      })

      store.addItem({
        productVariantId: 'variant-2',
        name: 'Test Protein',
        flavor: 'Vanilla',
        price: 2999,
        quantity: 1,
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(2)
    })
  })

  describe('openCart', () => {
    it('should set isOpen to true', () => {
      const store = useCartStore.getState()
      expect(store.isOpen).toBe(false)

      store.openCart()

      const state = useCartStore.getState()
      expect(state.isOpen).toBe(true)
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const store = useCartStore.getState()

      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 1,
      })

      const itemId = useCartStore.getState().items[0].id
      store.removeItem(itemId)

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const store = useCartStore.getState()

      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 1,
      })

      const itemId = useCartStore.getState().items[0].id
      store.updateQuantity(itemId, 5)

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(5)
    })

    it('should remove item when quantity is 0', () => {
      const store = useCartStore.getState()

      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 1,
      })

      const itemId = useCartStore.getState().items[0].id
      store.updateQuantity(itemId, 0)

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
    })

    it('should cap quantity at 10', () => {
      const store = useCartStore.getState()

      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 1,
      })

      const itemId = useCartStore.getState().items[0].id
      store.updateQuantity(itemId, 15)

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(10)
    })
  })

  describe('clearCart', () => {
    it('should clear all items', () => {
      const store = useCartStore.getState()

      store.addItem({
        productVariantId: 'variant-1',
        name: 'Test Protein',
        flavor: 'Chocolate',
        price: 2999,
        quantity: 1,
      })

      store.addItem({
        productVariantId: 'variant-2',
        name: 'Test Pre-Workout',
        flavor: 'Blueberry',
        price: 1999,
        quantity: 2,
      })

      store.clearCart()

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
      expect(state.email).toBeNull()
      expect(state.name).toBeNull()
    })
  })
})
