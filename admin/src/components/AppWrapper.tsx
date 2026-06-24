"use client";

import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { token } = useContext(ShopContext)!;
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token && pathname !== "/login") {
      router.replace("/login");
    }
  }, [mounted, token, pathname, router]);

  if (!mounted) return null;

  if (!token || pathname === "/login") {
    return <main className="w-full min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full relative">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
