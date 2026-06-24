"use client";
import { useContext } from "react";
import Link from "next/link";
import { ShopContext } from "../../context/ShopContext";


export default function Cart() {
  const { products, cartItems, currency, delivery_fee, removeFromCart, updateCartItem, getCartTotal, navigate } = useContext(ShopContext)!;

  const cartEntries = Object.entries(cartItems).flatMap(([itemId, quantities]) =>
    Object.entries(quantities).map(([qty, count]) => {
      const product = products.find((p: any) => p._id === itemId);
      return product ? { product, qty, count, itemId } : null;
    }).filter(Boolean)
  ) as { product: any; qty: string; count: number; itemId: string }[];

  const subtotal = getCartTotal();
  const total = subtotal + (cartEntries.length > 0 ? delivery_fee : 0);

  if (cartEntries.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
        <Link href="/collection" className="btn-primary inline-block">
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title">Shopping Cart</h1>
        <p className="text-sm text-gray-500 mt-1">{cartEntries.length} item{cartEntries.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartEntries.map(({ product, qty, count, itemId }, i) => (
            <div key={`${itemId}-${qty}`} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 items-start shadow-sm animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Image */}
              <Link href={`/product/${itemId}`} className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img
                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${itemId}`}>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate hover:text-green-600 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">Unit: <span className="font-medium text-gray-700">{qty}</span></p>
                <p className="text-base font-bold text-green-600 mt-1">{currency}{product.price * count}</p>

                <div className="flex items-center gap-3 mt-3">
                  {/* Quantity control */}
                  <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl border border-gray-200 p-0.5">
                    <button
                      className="qty-btn w-7 h-7 text-base"
                      onClick={() => updateCartItem(itemId, qty, count - 1)}
                    >−</button>
                    <span className="w-7 text-center font-semibold text-gray-800 text-sm">{count}</span>
                    <button
                      className="qty-btn w-7 h-7 text-base"
                      onClick={() => updateCartItem(itemId, qty, count + 1)}
                    >+</button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(itemId, qty)}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>

              {/* Price (desktop) */}
              <div className="hidden sm:block text-right flex-shrink-0">
                <p className="text-sm text-gray-500">{currency}{product.price} × {count}</p>
                <p className="text-lg font-bold text-gray-900">{currency}{product.price * count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
            <h3 className="font-bold text-gray-900 text-lg mb-5">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartEntries.length} items)</span>
                <span className="font-medium text-gray-900">{currency}{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span className="font-medium text-gray-900">{currency}{delivery_fee}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-green-600 text-xl">{currency}{total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate.push("/place-order")}
              className="btn-primary w-full mt-6 text-center"
            >
              Proceed to Checkout →
            </button>

            <Link href="/collection" className="block text-center text-sm text-gray-500 hover:text-green-600 transition-colors mt-4">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}