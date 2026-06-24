"use client";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

export default function Planner() {
  const { backendUrl, token, navigate } = useContext(ShopContext)!;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [planId, setPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchPlan = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/planner/my-plan`, { headers: { token } });
        if (res.data.success && res.data.plan) {
          setSchedule(res.data.plan.schedule || []);
          setPlanId(res.data.plan._id);
        }
      } catch (err) {
        console.error("Failed to fetch plan", err);
      } finally {
        setFetching(false);
      }
    };
    fetchPlan();
  }, [token, backendUrl]);

  const handleGenerateAI = async () => {
    if (!token) {
      toast.error("Please log in first");
      return navigate.push("/login");
    }
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/ai/suggest-plan`, {
        days: 7,
        mealsPerDay: 3
      }, { headers: { token } });
      
      if (response.data.success) {
        toast.success("AI generated a meal plan!");
        const aiPlan = response.data.plan;
        
        // Save to DB
        const saveRes = await axios.post(`${backendUrl}/api/planner/create`, {
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          schedule: aiPlan
        }, { headers: { token } });

        if (saveRes.data.success) {
          setPlanId(saveRes.data.plan._id);
        }

        // refresh
        setSchedule(aiPlan);
      } else {
        toast.error("AI generation failed");
      }
    } catch (err) {
      toast.error("Failed to call AI");
    } finally {
      setLoading(false);
    }
  };

  const generateGroceryList = async () => {
    if (!token) {
      toast.error("Please log in first");
      return navigate.push("/login");
    }
    if (!planId) {
      toast.error("No active meal plan found to generate groceries from.");
      return;
    }
    
    toast.info("Generating grocery list...");
    try {
      const res = await axios.post(`${backendUrl}/api/cart/generate`, { mealPlanId: planId }, { headers: { token } });
      if (res.data.success) {
        toast.success("Cart generated!");
        navigate.push("/cart");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to generate cart");
    }
  };

  if (fetching) return <div className="p-10 text-center">Loading Planner...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Meal Planner</h1>
          <p className="text-gray-500 font-medium">Plan your week or let AI do it for you.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateAI}
            disabled={loading}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? "Thinking..." : "✨ Auto-Fill with AI"}
          </button>
          <button 
            onClick={generateGroceryList}
            className="bg-green-600 text-white hover:bg-green-700 px-5 py-2.5 rounded-full font-bold shadow-md transition"
          >
            🛒 Generate Grocery List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 py-3 text-center border-b border-slate-200">
              <h3 className="font-bold text-slate-700">{day}</h3>
            </div>
            <div className="p-3 space-y-3">
              {mealTypes.map((meal) => {
                // VERY BASIC match for demo purposes
                // Realistically, the AI outputs exact dates, so we'd map dates to days of week.
                const slotted = schedule.find((s: any) => s.mealType === meal);
                return (
                  <div key={meal} className={`rounded-xl p-3 border transition flex flex-col justify-center items-center h-24 ${slotted ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-dashed border-slate-300 hover:border-green-400 hover:bg-green-50 cursor-pointer group'}`}>
                    <span className={`text-xs font-bold mb-1 uppercase tracking-wider ${slotted ? 'text-green-700' : 'text-slate-400 group-hover:text-green-500'}`}>{meal}</span>
                    {slotted ? (
                      <span className="text-sm font-bold text-green-900 text-center line-clamp-2">Recipe Loaded</span>
                    ) : (
                      <span className="text-sm font-medium text-slate-500 group-hover:text-green-600">+ Add</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
