"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Recipes() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/admin/recipes`, { headers: { token } });
        if (res.data.success) {
          setRecipes(res.data.recipes);
        }
      } catch (err) {
        toast.error("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [token, backendUrl]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await axios.put(`${backendUrl}/api/admin/recipe/status`, { recipeId: id, status: newStatus }, { headers: { token } });
      if (res.data.success) {
        toast.success(`Recipe ${newStatus}!`);
        setRecipes(recipes.map(r => r._id === id ? { ...r, status: newStatus } : r));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading recipes...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Recipe Moderation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{recipe.title}</h2>
                <p className="text-sm text-gray-500">By {recipe.author?.name || 'Unknown'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${recipe.status === 'Approved' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {recipe.status}
              </span>
            </div>
            
            {recipe.status === 'Pending' && (
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => updateStatus(recipe._id, 'Approved')}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-700 transition"
                >
                  Approve
                </button>
                <button 
                  onClick={() => updateStatus(recipe._id, 'Rejected')}
                  className="flex-1 bg-red-100 text-red-700 py-2 rounded-xl font-bold hover:bg-red-200 transition"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
