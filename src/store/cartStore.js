import { create } from 'zustand';

/**
 * Cart Store using Zustand
 * Manages local cart state + syncs with backend when user is authenticated
 */
const useCartStore = create((set, get) => ({
  // Cart items array
  items: [],
  // Loading state
  loading: false,
  // Notification state for "Added to Cart" popup
  notification: null,

  // Get total item count
  get itemCount() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Get cart summary
  getCartSummary: () => {
    const { items } = get();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 5000 ? 0 : 199;
    const total = subtotal + shipping;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, shipping, total, itemCount };
  },

  // Add item to cart
  addItem: (product, selectedSize, selectedColor, quantity = 1) => {
    const { items } = get();

    // Check if same product + size + color already exists
    const existingIndex = items.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    let updatedItems;
    if (existingIndex >= 0) {
      updatedItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem = {
        id: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.thumbnail || product.images?.[0],
        size: selectedSize,
        color: selectedColor,
        quantity,
        inStock: product.inStock,
      };
      updatedItems = [...items, newItem];
    }

    set({
      items: updatedItems,
      notification: {
        product,
        size: selectedSize,
        color: selectedColor,
        quantity,
      },
    });

    // Auto-dismiss notification after 4 seconds
    setTimeout(() => {
      const current = get().notification;
      if (current && current.product.id === product.id) {
        set({ notification: null });
      }
    }, 4000);
  },

  // Remove item from cart
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  // Update item quantity
  updateQuantity: (itemId, quantity) => {
    if (quantity < 1) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  // Increment quantity
  incrementQuantity: (itemId) => {
    const item = get().items.find((i) => i.id === itemId);
    if (item) {
      get().updateQuantity(itemId, item.quantity + 1);
    }
  },

  // Decrement quantity
  decrementQuantity: (itemId) => {
    const item = get().items.find((i) => i.id === itemId);
    if (item) {
      get().updateQuantity(itemId, item.quantity - 1);
    }
  },

  // Clear entire cart
  clearCart: () => {
    set({ items: [] });
  },

  // Dismiss notification
  dismissNotification: () => {
    set({ notification: null });
  },
}));

export default useCartStore;
