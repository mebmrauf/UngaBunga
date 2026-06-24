"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const currency = "৳";

export const ShopContext = createContext<any>(null);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, settoken] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("token");
      if (stored) {
        settoken(stored);
      }
    }
  }, []);

  const logout = () => {
    settoken("");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const value = {
    token,
    settoken,
    currency,
    logout,
    navigate: router,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
