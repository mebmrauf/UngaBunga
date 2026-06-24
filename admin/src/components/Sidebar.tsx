"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useContext(ShopContext)!;

  const links = [
    { href: "/", label: "Admin Dashboard", icon: "📊" },
    { href: "/shopkeepers", label: "Shopkeeper Moderation", icon: "🏬" },
    { href: "/recipes", label: "Recipe Moderation", icon: "🍳" },
    { href: "/orders", label: "All Orders", icon: "📦" },
    { href: "/users", label: "Manage Users", icon: "👥" },
  ];

  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-5 hidden md:block">
      <div className="space-y-2">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-green-50 text-green-700 border border-green-100 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
