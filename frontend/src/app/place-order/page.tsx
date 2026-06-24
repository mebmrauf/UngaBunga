"use client";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";


export default function PlaceOrder() {
  const { products, cartItems, currency, delivery_fee, getCartTotal, clearCart, navigate, token } = useContext(ShopContext)!;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate.push("/login");
  }, [token]);

  const cartEntries = Object.entries(cartItems).flatMap(([itemId, quantities]) =>
    Object.entries(quantities).map(([qty, count]) => {
      const product = products.find((p: any) => p._id === itemId);
      return product ? { product, qty, count, itemId } : null;
    }).filter(Boolean)
  ) as { product: any; qty: string; count: number; itemId: string }[];

  const subtotal = getCartTotal();
  const total = subtotal + delivery_fee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartEntries.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setLoading(true);
    try {
      const orderItems = cartEntries.map(({ product, qty, count }) => ({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        count,
        image: product.image?.[0] || "",
      }));

      const response = await axiosInstance.post("/api/order/place", {
        address: form,
        items: orderItems,
        amount: total,
        paymentMethod,
      });

      if (response.data.success) {
        clearCart();
        toast.success("Order placed successfully! 🎉");
        navigate.push("/orders");
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cartEntries.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">No items to checkout</h2>
        <button onClick={() => navigate.push("/collection")} className="btn-primary">
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="text-xl">📍</span> Delivery Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "firstName", label: "First Name", required: true },
                  { name: "lastName", label: "Last Name", required: true },
                  { name: "email", label: "Email", required: true, type: "email" },
                  { name: "phone", label: "Phone Number", required: true, type: "tel" },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
                    <input
                      name={field.name}
                      type={field.type || "text"}
                      required={field.required}
                      value={(form as any)[field.name]}
                      onChange={handleChange}
                      className="input-field"
                      placeholder={field.label}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Street Address</label>
                  <input
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
                  <input name="city" required value={form.city} onChange={handleChange} className="input-field" placeholder="City" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">ZIP Code</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} className="input-field" placeholder="ZIP Code" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="text-xl">💳</span> Payment Method
              </h3>
              <div className="space-y-3">
                {[
                  { value: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when your order arrives" },
                ].map(method => (
                  <label key={method.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${paymentMethod === method.value ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"}`}>
                    <input
                      type="radio"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="accent-green-600"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 text-lg mb-5">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {cartEntries.map(({ product, qty, count, itemId }) => (
                  <div key={`${itemId}-${qty}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{qty} × {count}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 flex-shrink-0">{currency}{product.price * count}</p>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{currency}{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-medium">{currency}{delivery_fee}</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-green-600 text-lg">{currency}{total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Placing order...
                  </span>
                ) : "Place Order 🎉"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}