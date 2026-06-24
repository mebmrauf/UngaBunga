"use client";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

export default function RelatedProducts({ category }: { category: string }) {
  const { products } = useContext(ShopContext)!;
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    if (products.length && category) {
      const filtered = products.filter((p: any) => p.category === category).slice(0, 5);
      setRelated(filtered);
    }
  }, [products, category]);

  if (!related.length) return null;

  return (
    <section className="mt-16 py-10 border-t border-gray-100">
      <h2 className="section-title mb-6">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {related.map((item: any, i: number) => (
          <div key={item._id || i} className="animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
            <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
          </div>
        ))}
      </div>
    </section>
  );
}