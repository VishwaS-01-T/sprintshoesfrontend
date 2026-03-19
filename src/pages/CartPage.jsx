import React, { useState } from 'react';
import { Link, useRouter } from '../hooks/useRouter.jsx';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import LoginModal from '../components/LoginModal';
import {
  Trash2,
  Plus,
  Minus,
  Heart,
  ShoppingBag,
  ChevronRight,
  Clock,
  Tag,
  Truck,
  ArrowLeft,
} from 'lucide-react';

/**
 * CartPage — Full cart / bag page
 * Styled after Nike's cart layout (image 3):
 *  - Left side: item list with image, name, meta, size, qty controls
 *  - Right side: Order summary with subtotal, shipping, total, promo, proceed
 */
const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const incrementQuantity = useCartStore((s) => s.incrementQuantity);
  const decrementQuantity = useCartStore((s) => s.decrementQuantity);
  const getCartSummary = useCartStore((s) => s.getCartSummary);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { navigate } = useRouter();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { subtotal, shipping, total, itemCount } = getCartSummary();

  const handleProceed = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      navigate('/checkout/address');
    }
  };

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-neutral-300" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your Bag is Empty</h1>
        <p className="text-neutral-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your bag yet. Explore our collection and find something you love.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white font-bold rounded-full hover:bg-neutral-800 transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Bag</h1>
            <p className="text-sm text-neutral-500 mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* ─── Left: Cart Items ─── */}
          <div className="lg:col-span-2 space-y-0">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white p-5 sm:p-6 ${index === 0 ? 'rounded-t-2xl' : ''} ${index === items.length - 1 ? 'rounded-b-2xl' : ''} ${index !== items.length - 1 ? 'border-b border-neutral-100' : ''}`}
              >
                <div className="flex gap-4 sm:gap-6">
                  {/* Product Image */}
                  <Link
                    href={`/product/${item.productId}`}
                    className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-neutral-100 overflow-hidden group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-bold text-neutral-900 hover:text-amber-600 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-neutral-500 mt-0.5">{item.brand}</p>
                      </div>
                      <p className="font-bold text-neutral-900 whitespace-nowrap">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="mt-2 space-y-1">
                      {item.color && (
                        <p className="text-sm text-neutral-500 capitalize">{item.color}</p>
                      )}
                      <p className="text-sm text-neutral-500">14 Day Return</p>
                      <p className="text-sm text-neutral-600 underline underline-offset-2">
                        Size {item.size}
                      </p>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-3 mt-4">
                      {/* Quantity Controls */}
                      <div className="inline-flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          {item.quantity <= 1 ? (
                            <Trash2 className="w-4 h-4" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </button>
                        <span className="px-4 py-1.5 text-sm font-bold text-neutral-900 min-w-[36px] text-center border-x border-neutral-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Wishlist */}
                      <button
                        className="p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:text-rose-500 hover:border-rose-200 transition-colors"
                        aria-label="Move to wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Low stock warning */}
                    {item.quantity >= 3 && (
                      <div className="flex items-center gap-1.5 mt-3 text-amber-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Only a few left</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Right: Order Summary ─── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Summary</h2>

              <div className="space-y-4">
                {/* Bag Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Bag Total</span>
                  <span className="text-sm font-medium text-neutral-900">
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Sub Total</span>
                  <span className="text-sm font-medium text-neutral-900">
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Shipping Charges</span>
                  <span className={`text-sm font-medium ${shipping === 0 ? 'text-green-600' : 'text-neutral-900'}`}>
                    {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">You Pay</span>
                    <span className="font-bold text-lg text-neutral-900">
                      ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <button className="flex items-center justify-between w-full mt-6 py-4 px-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-neutral-900">Have a promo code?</p>
                    <p className="text-xs text-neutral-500">Apply now to get instant savings</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
              </button>

              {/* Checkout Button */}
              <button
                onClick={handleProceed}
                className="w-full mt-6 py-4 bg-neutral-900 text-white font-bold text-base rounded-full hover:bg-neutral-800 transition-colors shadow-lg hover:shadow-xl"
              >
                Proceed to Buy
              </button>

              {/* Shipping Info */}
              <div className="flex items-center gap-2 mt-4 justify-center">
                <Truck className="w-4 h-4 text-green-500" />
                <span className="text-xs text-neutral-500">
                  {shipping === 0
                    ? 'You qualify for free shipping!'
                    : `Add ₹${(5000 - subtotal).toLocaleString('en-IN')} more for free shipping`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Login required modal */}
    <LoginModal
      isOpen={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      onLoginSuccess={() => {
        window.dispatchEvent(new Event('login-success'));
        navigate('/checkout/address');
      }}
    />
  </>
  );
};

export default CartPage;
