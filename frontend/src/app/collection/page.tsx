"use client";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShopContext } from "../../context/ShopContext";
import ProductItem from "../../components/ProductItem";


const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "A–Z", value: "name_asc" },
];

export default function Collection() {
  const { products, categories, search, showSearch } = useContext(ShopContext)!;
  const searchParams = useSearchParams();

  const [showFilter, setShowFilter] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [filtered, setFiltered] = useState<any[]>([]);

  // Pre-select category from URL ?category=...
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategories([cat]);
  }, [searchParams]);

  const toggleCategory = (value: string) => {
    setSelectedCategories(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
    setSelectedSubCategories([]);
  };

  const toggleSubCategory = (value: string) => {
    setSelectedSubCategories(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const availableSubCategories = (
    selectedCategories.length > 0
      ? (categories || []).filter((c: any) => selectedCategories.includes(c.value))
      : (categories || [])
  )
    .flatMap((c: any) => c.subCategories || [])
    .filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.value === v.value) === i);

  useEffect(() => {
    let list = [...products];
    if (showSearch && search) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedCategories.length > 0) {
      list = list.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedSubCategories.length > 0) {
      list = list.filter(p => selectedSubCategories.includes(p.subCategory));
    }
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(list);
  }, [selectedCategories, selectedSubCategories, search, showSearch, products, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="section-subtitle">Browse</p>
        <h1 className="section-title">All Products</h1>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* Mobile toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="lg:hidden flex items-center gap-2 w-full py-2.5 px-4 mb-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>

          <div className={`${showFilter ? "block" : "hidden"} lg:block space-y-5`}>
            {/* Clear */}
            {(selectedCategories.length > 0 || selectedSubCategories.length > 0) && (
              <button
                onClick={() => { setSelectedCategories([]); setSelectedSubCategories([]); }}
                className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
              >
                ✕ Clear all filters
              </button>
            )}

            {/* Category filter */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-sm text-gray-800 mb-4">Category</h3>
              <div className="space-y-2.5">
                {(categories || []).map((cat: any, i: number) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.value)}
                      onChange={() => toggleCategory(cat.value)}
                      className="w-4 h-4 rounded accent-orange-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sub-category filter */}
            {availableSubCategories.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-gray-800 mb-4">Type</h3>
                <div className="space-y-2.5">
                  {availableSubCategories.map((sub: any, i: number) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedSubCategories.includes(sub.value)}
                        onChange={() => toggleSubCategory(sub.value)}
                        className="w-4 h-4 rounded accent-orange-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{sub.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Sort + count bar */}
          <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> results
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">No products found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((item: any, i: number) => (
                <div key={item._id || i} className="animate-fade-in" style={{ animationDelay: `${(i % 12) * 0.03}s` }}>
                  <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}