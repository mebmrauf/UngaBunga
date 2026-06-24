"use client";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

export default function DeliveryDashboard() {
  const { backendUrl, token, role } = useContext(ShopContext)!;
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/order/delivery-list`, { headers: { token } });
        if (res.data.success) {
          setTasks(res.data.orders);
        }
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token, backendUrl]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await axios.put(`${backendUrl}/api/order/delivery-status`, { orderId: id, status: newStatus }, { headers: { token } });
      if (res.data.success) {
        setTasks(tasks.map(t => t._id === id ? { ...t, overallStatus: newStatus } : t));
        toast.success(`Task marked as ${newStatus}`);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const { socket } = useContext(ShopContext)!;
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);

  const startTracking = (task: any) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setTrackingOrder(task._id);
    toast.info("Started broadcasting location!");

    navigator.geolocation.watchPosition((position) => {
      if (socket) {
        socket.emit("driverLocationUpdate", {
          orderId: task._id,
          userId: task.user._id,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }
    }, (error) => {
      console.error(error);
      toast.error("Failed to get location");
    }, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000
    });
  };

  if (role !== "delivery") {
    return <div className="p-10 text-center">You don't have access to this page.</div>;
  }

  if (loading) return <div className="p-10 text-center">Loading Tasks...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Delivery Tasks</h1>
      
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-lg text-gray-900">{task._id}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${task.overallStatus === 'Delivered' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                  {task.overallStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">📍 Deliver to: <span className="text-gray-900">{task.user?.name} ({task.address})</span></p>
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {task.overallStatus === 'Order Placed' && (
                <button onClick={() => updateStatus(task._id, 'Out for Delivery')} className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700">
                  Start Delivery
                </button>
              )}
              {task.overallStatus === 'Out for Delivery' && (
                <>
                  <button onClick={() => startTracking(task)} className={`w-full px-4 py-2 rounded-xl font-bold ${trackingOrder === task._id ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
                    {trackingOrder === task._id ? '📡 Broadcasting...' : '📍 Broadcast Location'}
                  </button>
                  <button onClick={() => updateStatus(task._id, 'Delivered')} className="w-full bg-orange-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-700">
                    Mark Delivered
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-gray-500">No delivery tasks available.</p>}
      </div>
    </div>
  );
}
