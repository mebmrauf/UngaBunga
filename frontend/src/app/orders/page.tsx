"use client";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import axiosInstance from "../../utils/axiosInstance";


const STATUS_COLORS: Record<string, string> = {
  pending: "badge-yellow",
  processing: "badge-yellow",
  shipped: "badge-green",
  delivered: "badge-green",
  cancelled: "badge-red",
};

export default function Orders() {
  const { token, navigate, currency } = useContext(ShopContext)!;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate.push("/login"); return; }
    axiosInstance.get("/api/order/user")
      .then(res => {
        if (res.data.success) setOrders(res.data.orders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-8">When you place an order, it will appear here.</p>
          <button onClick={() => navigate.push("/collection")} className="btn-primary">
            Start Shopping →
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order: any, i: number) => (
            <div key={order._id || i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
              {/* Order header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 bg-gray-50">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</p>
                  <p className="text-sm font-mono font-bold text-gray-800 mt-0.5">#{order._id?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p>
                  <span className={`badge ${STATUS_COLORS[order.status?.toLowerCase()] || "badge-yellow"}`}>
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {(order.items || []).map((item: any, j: number) => (
                  <div key={j} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image || "/placeholder.jpg"} alt={item.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/56"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.quantity} × {item.count}</p>
                    </div>
                    <p className="font-bold text-gray-900 flex-shrink-0">{currency}{item.price * item.count}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Payment: <span className="font-semibold text-gray-700 capitalize">{order.paymentMethod || "COD"}</span></span>
                  <span>·</span>
                  <span>{order.payment ? <span className="text-green-600 font-semibold">Paid</span> : <span className="text-amber-600 font-semibold">Pending</span>}</span>
                </div>
                <p className="font-bold text-gray-900">
                  Total: <span className="text-green-600">{currency}{order.amount}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}