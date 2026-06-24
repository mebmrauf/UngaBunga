"use client";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShopContext } from "../context/ShopContext";

export default function SearchBar() {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)!;
  const pathname = usePathname();
  const [isCollection, setIsCollection] = useState(false);

  useEffect(() => {
    setIsCollection(pathname?.includes("collection"));
    if (!pathname?.includes("collection")) setShowSearch(false);
  }, [pathname]);

  if (!showSearch || !isCollection) return null;

  return (
    <div className="bg-white border-b border-gray-100 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <button
            onClick={() => { setShowSearch(false); setSearch(""); }}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}