"use client";
import Link from "next/link";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

export default function ProductItem({ id, image, name, price }) {
  const { currency, addToCart } = useContext(ShopContext)!;
  const imgSrc = Array.isArray(image) ? image[0] : image;

  return (
    <div className="card group cursor-pointer">
      <Link href={`/product/${id}`} className="block">
        <div className="product-image-wrapper aspect-square">
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors duration-200 leading-tight">
            {name}
          </h3>
          <p className="mt-1 text-base font-bold text-orange-600">
            {currency}{price}
          </p>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button
          onClick={() => addToCart(id, "1")}
          className="w-full py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-200"
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
}