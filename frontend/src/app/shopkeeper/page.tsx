"use client";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

export default function VendorDashboard() {
  const { backendUrl, token, role } = useContext(ShopContext)!;
  const [inventory, setInventory] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", unit: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchStore = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/shopkeeper/store`, { headers: { token } });
        if (res.data.success && res.data.store) {
          setInventory(res.data.store.inventory || []);
        } else {
          // If no store exists, maybe create one?
          await axios.post(`${backendUrl}/api/shopkeeper/setup`, { storeName: "My Store", address: "123 Market St" }, { headers: { token } });
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          await axios.post(`${backendUrl}/api/shopkeeper/setup`, { storeName: "My Store", address: "123 Market St" }, { headers: { token } });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [token, backendUrl]);

  const syncInventory = async (newInventory: any[]) => {
    try {
      await axios.put(`${backendUrl}/api/shopkeeper/inventory`, { inventory: newInventory }, { headers: { token } });
    } catch (err) {
      toast.error("Failed to sync inventory");
    }
  };

  const handleAddItem = (e: any) => {
    e.preventDefault();
    const newInv = [...inventory, { id: Date.now().toString(), name: newItem.name, price: Number(newItem.price), unit: newItem.unit, inStock: true }];
    setInventory(newInv);
    syncInventory(newInv);
    setNewItem({ name: "", price: "", unit: "" });
    toast.success("Item added to inventory");
  };

  const toggleStock = (id: string) => {
    const newInv = inventory.map(item => item.id === id ? { ...item, inStock: !item.inStock } : item);
    setInventory(newInv);
    syncInventory(newInv);
    toast.info("Stock status updated");
  };

  if (role !== "shopkeeper") {
    return <div className="p-10 text-center">You don't have access to this page.</div>;
  }
  
  if (loading) return <div className="p-10 text-center">Loading Store...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Store (Vendor View)</h1>
      <p className="text-gray-500 mb-8">Manage your inventory and set your pricing.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Add Product</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <input required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} type="text" placeholder="Ingredient Name (e.g. Eggs)" className="w-full px-4 py-2 border rounded-xl" />
              <input required value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} type="number" placeholder="Price (BDT)" className="w-full px-4 py-2 border rounded-xl" />
              <input required value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} type="text" placeholder="Unit (e.g. dozen, kg)" className="w-full px-4 py-2 border rounded-xl" />
              <button type="submit" className="w-full bg-orange-600 text-white font-bold py-2 rounded-xl hover:bg-orange-700">Add to Store</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4">Item Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Unit</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold">{item.name}</td>
                    <td className="p-4">৳{item.price}</td>
                    <td className="p-4">{item.unit}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.inStock ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleStock(item.id)} className="text-blue-600 font-bold text-sm hover:underline">
                        Toggle Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
