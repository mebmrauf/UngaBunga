"use client";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShopContext } from "../../context/ShopContext";

export default function GroceryList() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);

  const { token, backendUrl } = useContext(ShopContext)!;

  useEffect(() => {
    if (!token) return;
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/cart/my-cart`, { headers: { token } });
        if (res.data.success && res.data.cart) {
          setCartId(res.data.cart._id);
          // Add checked: false to items locally if not present in schema
          const fetchedItems = res.data.cart.items.map((i: any) => ({ ...i, checked: false }));
          setItems(fetchedItems);
        }
      } catch (err) {
        console.error("Failed to fetch cart", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token, backendUrl]);

  const toggleCheck = (index: number) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.filter(i => !i.checked).reduce((acc, curr) => acc + curr.priceEstimate, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/order/place`, {
        cartId,
        address: "123 Default St, Dhaka" // Using default since we didn't build address form yet
      }, { headers: { token } });

      if (res.data.success) {
        toast.success("Order Placed Successfully via COD!");
        router.push("/orders");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to place order");
    }
  };

  if (loading) return <div className="text-center p-10 font-medium text-gray-500">Loading Grocery List...</div>;
  if (items.length === 0) return <div className="text-center p-10 font-medium text-gray-500">Your cart is empty. Go generate a grocery list from your planner!</div>;

  const total = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Grocery List</h1>
        <p className="text-gray-500 font-medium">Generated from your weekly meal plan.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-700">Items to buy</span>
          <span className="text-sm font-medium text-slate-500">Uncheck items you already have at home</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {items.map((item, idx) => (
            <div key={item.id} className={`px-6 py-4 flex items-center justify-between transition ${item.checked ? 'opacity-50 bg-slate-50' : 'hover:bg-green-50'}`}>
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  checked={!item.checked} 
                  onChange={() => toggleCheck(idx)}
                  className="w-6 h-6 rounded-md text-green-600 focus:ring-green-500 cursor-pointer accent-green-600"
                />
                <div>
                  <h3 className={`font-bold text-lg ${item.checked ? 'text-slate-500 line-through' : 'text-gray-900'}`}>{item.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{item.totalQuantity} {item.unit}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${item.checked ? 'text-slate-400' : 'text-green-600'}`}>৳{item.priceEstimate}</p>
                <p className="text-xs text-gray-400">Est. price</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 rounded-3xl p-6 border border-green-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Total Estimate: <span className="text-2xl text-green-600">৳{total}</span></h3>
          <p className="text-sm text-green-700 font-medium">+ Delivery & Service Fees will apply</p>
        </div>
        <button 
          onClick={handlePlaceOrder}
          disabled={total === 0}
          className="w-full md:w-auto bg-green-600 text-white px-8 py-3.5 rounded-full font-bold text-lg shadow-md hover:bg-green-700 transition disabled:opacity-50"
        >
          Checkout Items
        </button>
      </div>
    </div>
  );
}