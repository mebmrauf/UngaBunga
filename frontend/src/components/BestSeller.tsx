"use client";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

export default function BestSeller() {
  const { products } = useContext(ShopContext)!;
  const [bestSellers, setBestSellers] = useState<any[]>([]);

  useEffect(() => {
    const filtered = products.filter((p: any) => p.bestseller);
    setBestSellers(filtered.slice(0, 8));
  }, [products]);

  if (!bestSellers.length) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-green-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-subtitle">🔥 Popular</p>
            <h2 className="section-title">Best Sellers</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {bestSellers.map((item: any, i: number) => (
            <div key={item._id || i} className="animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <span className="badge badge-yellow">🔥 Best Seller</span>
                </div>
                <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}