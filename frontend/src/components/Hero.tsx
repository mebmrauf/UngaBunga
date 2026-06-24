"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-200 rounded-full opacity-30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="animate-fade-in">
            <span className="section-subtitle">🛒 Fresh & Delivered Fast</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
              Your Daily{" "}
              <span className="relative">
                <span className="text-green-600">Groceries</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 0 100 6 Q150 12 200 6" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              {" "}Delivered Fresh
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              Shop from hundreds of fresh produce, daily essentials, and specialty items. 
              We deliver the freshest groceries straight to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/collection" className="btn-primary text-center">
                Shop Now →
              </Link>
              <Link href="/about" className="btn-outline text-center">
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { value: "500+", label: "Products" },
                { value: "10K+", label: "Happy Customers" },
                { value: "2hrs", label: "Avg Delivery" },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
                alt="Fresh groceries"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">🚚</div>
              <div>
                <p className="font-bold text-sm text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-500">On orders above ৳500</p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">⭐</div>
              <div>
                <p className="font-bold text-sm text-gray-900">4.9 Rating</p>
                <p className="text-xs text-gray-500">From 2,400 reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}