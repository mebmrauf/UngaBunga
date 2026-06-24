"use client";
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ShopContext } from "../../../context/ShopContext";

export default function RecipeUpload() {
  const router = useRouter();
  const { backendUrl, token } = useContext(ShopContext)!;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
  const [steps, setSteps] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const handleAddStep = () => setSteps([...steps, ""]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        prepTime: Number(prepTime),
        ingredients: ingredients.map(i => ({ ...i, quantity: Number(i.quantity) })),
        steps
      };

      const res = await axios.post(`${backendUrl}/api/recipe/upload`, payload, {
        headers: { token }
      });

      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to upload recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-orange-600 px-8 py-10 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Share Your Recipe</h1>
          <p className="text-orange-100 font-medium">Earn points and help the community plan their meals!</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Recipe Title</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition bg-slate-50" placeholder="e.g. Classic Chicken Curry" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Prep Time (mins)</label>
              <input required value={prepTime} onChange={e => setPrepTime(e.target.value)} type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition bg-slate-50" placeholder="20" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition bg-slate-50 resize-none" placeholder="A short description of the dish..." />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">Ingredients</label>
              <button type="button" onClick={handleAddIngredient} className="text-orange-600 text-sm font-bold hover:underline">+ Add Item</button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2">
                  <input required value={ing.name} onChange={e => { const newIng = [...ingredients]; newIng[idx].name = e.target.value; setIngredients(newIng); }} type="text" placeholder="Ingredient name" className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50" />
                  <input required value={ing.quantity} onChange={e => { const newIng = [...ingredients]; newIng[idx].quantity = e.target.value; setIngredients(newIng); }} type="number" placeholder="Qty" className="w-20 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50" />
                  <input required value={ing.unit} onChange={e => { const newIng = [...ingredients]; newIng[idx].unit = e.target.value; setIngredients(newIng); }} type="text" placeholder="Unit (kg, pcs)" className="w-24 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">Steps</label>
              <button type="button" onClick={handleAddStep} className="text-orange-600 text-sm font-bold hover:underline">+ Add Step</button>
            </div>
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold flex-shrink-0 mt-1">{idx + 1}</span>
                  <textarea required value={step} onChange={e => { const newSteps = [...steps]; newSteps[idx] = e.target.value; setSteps(newSteps); }} rows={2} placeholder="Describe this step..." className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50 resize-none" />
                </div>
              ))}
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition shadow-md">
            {loading ? "Uploading..." : "Submit Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}
