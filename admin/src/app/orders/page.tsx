"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";

export default function Orders() {
  const queryClient = useQueryClient();
  const { currency } = useContext(ShopContext)!;

  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const response = await axiosInstance.post("/api/order/list");
      if (response.data.success) {
        return response.data.orders;
      }
      throw new Error(response.data.message);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await axiosInstance.post("/api/order/status", { orderId, status });
      if (!response.data.success) throw new Error(response.data.message);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const statusHandler = (event: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
    statusMutation.mutate({ orderId, status: event.target.value });
  };

  if (isLoading) return <p className="p-8 text-gray-500 font-medium">Loading Orders...</p>;
  if (isError) return <p className="p-8 text-red-500 font-medium">Error: {error.message}</p>;

  return (
    <div className="animate-fade-in w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Manage Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order: any, index: number) => (
          <div key={index} className="glass p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Order ID: <span className="font-mono text-gray-500">{order._id.slice(-8).toUpperCase()}</span>
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-800">{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                  <p className="text-gray-500 font-medium pt-1">Items: {order.items.length}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
              <p className="font-bold text-2xl text-gray-800">{currency}{order.amount}</p>
              <div className="flex items-center gap-3 w-full">
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  disabled={statusMutation.isPending}
                  className="p-2 font-semibold bg-slate-50 border border-slate-200 rounded-lg outline-none w-full md:w-auto text-sm disabled:opacity-50"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="glass p-12 text-center text-gray-500 flex flex-col items-center">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-lg font-medium text-gray-600">No orders found.</p>
            <p className="text-sm mt-1">Wait for customers to place some orders!</p>
          </div>
        )}
      </div>
    </div>
  );
}
