"use client";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Link from "next/link";

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton aspect-square" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
      </div>
    </div>
  );
}

export default function RecentStock() {
  const { products, isLoading } = useContext(ShopContext)!;
  const [latest, setLatest] = useState<any[]>([]);

  useEffect(() => {
    setLatest(products.slice(0, 10));
  }, [products]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-subtitle">Fresh From Farm</p>
            <h2 className="section-title">New Arrivials at Khabari</h2>
          </div>
          <Link href="/collection" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors hidden sm:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array(10).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : latest.map((item: any, i: number) => (
                <div key={item._id || i} className="animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                  <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}