"use client";

import Link from "next/link";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

export default function Navbar() {
  const { logout } = useContext(ShopContext)!;

  return (
    <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
          U
        </div>
        <span className="font-extrabold tracking-tight text-xl text-gray-900">
          Khabari <span className="text-orange-600 font-medium">Admin</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/add" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors">
          <span>➕</span> Add Product
        </Link>
        
        <div className="h-6 w-px bg-gray-200 hidden sm:block mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">Admin User</p>
            <p className="text-xs text-gray-500 font-medium">Manager</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl cursor-pointer hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 transition-all">
            👨‍💼
          </div>
        </div>
      </div>
    </nav>
  );
}
