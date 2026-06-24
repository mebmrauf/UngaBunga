"use client";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Shopkeepers() {
  const [shopkeepers, setShopkeepers] = useState([
    { id: 1, name: "Rahim Store", address: "Dhaka", verified: false, status: "Active", rating: 4.5 },
    { id: 2, name: "Fresh Mart", address: "Chittagong", verified: true, status: "Active", rating: 4.8 },
    { id: 3, name: "Daily Needs", address: "Sylhet", verified: true, status: "Suspended", rating: 2.1 },
  ]);

  const toggleVerification = (id: number) => {
    toast.success("Verification status updated!");
    setShopkeepers(shopkeepers.map(s => s.id === id ? { ...s, verified: !s.verified } : s));
  };

  const banShopkeeper = (id: number) => {
    toast.error("Shopkeeper Suspended!");
    setShopkeepers(shopkeepers.map(s => s.id === id ? { ...s, status: "Suspended" } : s));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopkeeper Moderation</h1>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
              <th className="p-4">Store Name</th>
              <th className="p-4">Address</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Status</th>
              <th className="p-4">Verification</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shopkeepers.map((shop) => (
              <tr key={shop.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-gray-800">{shop.name}</td>
                <td className="p-4 text-gray-600">{shop.address}</td>
                <td className="p-4">⭐ {shop.rating}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${shop.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {shop.status}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleVerification(shop.id)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${shop.verified ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {shop.verified ? "Verified ✓" : "Verify"}
                  </button>
                </td>
                <td className="p-4">
                  {shop.status === 'Active' && (
                    <button 
                      onClick={() => banShopkeeper(shop.id)}
                      className="text-red-600 font-bold hover:underline text-sm"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
