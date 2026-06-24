"use client";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ShopContext } from "../../context/ShopContext";
import axiosInstance from "../../utils/axiosInstance";

const MapComponent = dynamic(() => import("../../components/MapComponent"), { ssr: false });


const STATUS_COLORS: Record<string, string> = {
  pending: "badge-yellow",
  processing: "badge-yellow",
  shipped: "badge-green",
  delivered: "badge-green",
  cancelled: "badge-red",
};

export default function Orders() {
  const { token, navigate, currency, socket } = useContext(ShopContext)!;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // orderId -> { lat, lng }
  const [driverLocations, setDriverLocations] = useState<Record<string, { lat: number, lng: number }>>({});
  // orderId -> boolean
  const [trackingOpen, setTrackingOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!token) { navigate.push("/login"); return; }
    axiosInstance.get("/api/order/user")
      .then(res => {
        if (res.data.success) setOrders(res.data.orders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (socket) {
      const handleLocationUpdate = (data: { orderId: string, lat: number, lng: number }) => {
        setDriverLocations(prev => ({
          ...prev,
          [data.orderId]: { lat: data.lat, lng: data.lng }
        }));
      };
      
      socket.on("locationUpdate", handleLocationUpdate);
      return () => {
        socket.off("locationUpdate", handleLocationUpdate);
      };
    }
  }, [socket]);

  const toggleTracking = (orderId: string) => {
    setTrackingOpen(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

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
                  {order.status === "Out for Delivery" && (
                    <button 
                      onClick={() => toggleTracking(order._id)}
                      className="ml-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                    >
                      {trackingOpen[order._id] ? "Hide Map" : "Live Track 📡"}
                    </button>
                  )}
                </div>
              </div>

              {/* Live Map */}
              {trackingOpen[order._id] && order.status === "Out for Delivery" && (
                <div className="px-5 py-4 bg-purple-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                    Live Driver Tracking
                  </h3>
                  {driverLocations[order._id] ? (
                    <MapComponent lat={driverLocations[order._id].lat} lng={driverLocations[order._id].lng} />
                  ) : (
                    <div className="w-full h-32 bg-white rounded-2xl flex items-center justify-center border border-purple-100">
                      <p className="text-sm text-purple-600 font-medium animate-pulse">Waiting for driver location signal...</p>
                    </div>
                  )}
                </div>
              )}

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
                  <span>{order.payment ? <span className="text-orange-600 font-semibold">Paid</span> : <span className="text-amber-600 font-semibold">Pending</span>}</span>
                </div>
                <p className="font-bold text-gray-900">
                  Total: <span className="text-orange-600">{currency}{order.amount}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}