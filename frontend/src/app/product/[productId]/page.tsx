"use client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShopContext } from "../../../context/ShopContext";
import RelatedProducts from "../../../components/RelatedProducts";


export default function Product() {
  const { productId } = useParams<{ productId: string }>();
  const { products, currency, addToCart } = useContext(ShopContext)!;
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedQty, setSelectedQty] = useState("");
  const [count, setCount] = useState(1);

  useEffect(() => {
    const found = products.find((p: any) => p._id === productId);
    if (found) {
      setProduct(found);
      setSelectedImage(found.image?.[0] || "");
      setSelectedQty("");
    }
  }, [productId, products]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="space-y-4 pt-4">
            <div className="skeleton h-8 w-3/4 rounded-xl" />
            <div className="skeleton h-6 w-1/4 rounded-xl" />
            <div className="skeleton h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const images: string[] = product.image || [];
  const quantities: string[] = product.quantity || [];

  const handleAddToCart = () => {
    if (!selectedQty) { return; }
    for (let i = 0; i < count; i++) addToCart(product._id, selectedQty);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 animate-fade-in">
        {/* Image Gallery */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-col gap-3 w-20">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === img ? "border-green-500 shadow-md" : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {/* Main image */}
          <div className="flex-1 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          {product.bestseller && (
            <span className="badge badge-yellow w-fit">🔥 Best Seller</span>
          )}

          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <p className="mt-3 text-4xl font-extrabold text-green-600">
              {currency}{product.price}
            </p>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

          {/* Quantity selector */}
          {quantities.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3">Select Quantity / Unit</p>
              <div className="flex flex-wrap gap-2">
                {quantities.map((qty: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedQty(qty)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                      selectedQty === qty
                        ? "border-green-600 bg-green-600 text-white shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50"
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
              {!selectedQty && (
                <p className="text-xs text-red-500 mt-2">Please select a size/quantity</p>
              )}
            </div>
          )}

          {/* Count & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
              <button className="qty-btn" onClick={() => setCount(Math.max(1, count - 1))}>−</button>
              <span className="w-8 text-center font-semibold text-gray-800 text-sm">{count}</span>
              <button className="qty-btn" onClick={() => setCount(count + 1)}>+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={quantities.length > 0 && !selectedQty}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            {[
              { icon: "✅", text: "100% Authentic" },
              { icon: "🚚", text: "Fast Delivery" },
              { icon: "↩️", text: "Easy Returns" },
            ].map(badge => (
              <div key={badge.text} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RelatedProducts category={product.category} />
    </div>
  );
}