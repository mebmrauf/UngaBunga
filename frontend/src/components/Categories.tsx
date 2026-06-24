"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { ShopContext } from "../context/ShopContext";

const CATEGORY_EMOJIS: Record<string, string> = {
  fruits: "🥭",
  vegetables: "🥬",
  meat: "🥩",
  seafood: "🐟",
  fish: "🐠",
  dairy: "🥛",
  sweets: "🍮",
  spices: "🌶️",
  rice: "🍚",
  snacks: "🍿",
  bakery: "🍞",
  pantry: "🫙",
  default: "🧺",
};

export default function Categories() {
  const { categories } = useContext(ShopContext)!;
  const router = useRouter();

  const handleClick = (catValue: string) => {
    router.push(`/collection?category=${catValue}`);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-subtitle">Local Market</p>
            <h2 className="section-title">Shop by Bazaar Category</h2>
          </div>
          <a href="/collection" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors hidden sm:block">
            View all →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat: any, i: number) => {
            const key = cat.value?.toLowerCase() || "";
            const emoji = Object.keys(CATEGORY_EMOJIS).find(k => key.includes(k))
              ? CATEGORY_EMOJIS[Object.keys(CATEGORY_EMOJIS).find(k => key.includes(k))!]
              : CATEGORY_EMOJIS.default;

            return (
              <button
                key={i}
                onClick={() => handleClick(cat.value)}
                className="group flex flex-col items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:bg-orange-50 hover:shadow-md transition-all duration-250 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-2xl transition-all duration-200 group-hover:scale-110">
                  {emoji}
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-700 text-center leading-tight transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}