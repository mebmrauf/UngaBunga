"use client";
import { useContext } from "react";
import Link from "next/link";
import { ShopContext } from "../../context/ShopContext";

export default function Recipes() {
  const { recipes, isLoading: loading } = useContext(ShopContext)!;

  if (loading) return <div className="text-center p-10 font-medium text-gray-500">Loading your feed...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Recipes</h1>
        <Link href="/recipe/upload" className="bg-orange-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-orange-700 transition shadow-sm">
          + Share Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No recipes found yet. Be the first to share one!</p>
          <Link href="/recipe/upload" className="text-orange-600 font-semibold hover:underline">Upload a recipe</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {recipes.map((recipe: any) => (
            <div key={recipe._id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
              {recipe.images && recipe.images.length > 0 ? (
                <img src={recipe.images[0]} alt={recipe.title} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-48 bg-amber-50 flex items-center justify-center text-4xl">🍳</div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">{recipe.title}</h2>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 flex items-center gap-1">
                    ⏱️ {recipe.prepTime || 20}m
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4 font-medium">By {recipe.author?.name || "Community Chef"}</p>
                <p className="text-gray-700 mb-6 leading-relaxed">{recipe.description}</p>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition font-medium text-sm">
                      ❤️ <span>{recipe.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition font-medium text-sm">
                      🔖 Save
                    </button>
                  </div>
                  <button className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-100 transition">
                    + Add to Planner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
