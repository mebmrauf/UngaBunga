"use client";
import { createContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ShopContextType = {
  recipes: any[];
  isLoading: boolean;
  currency: string;
  navigate: ReturnType<typeof useRouter>;
  backendUrl: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  logout: () => void;
};

export const ShopContext = createContext<ShopContextType | null>(null);

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const currency = "৳";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";
  const [token, setToken] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (savedToken) setToken(savedToken);
    if (savedRole) setRole(savedRole);
  }, []);

  const { data: recipesData, isLoading, isError, error } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/api/recipe/feed`);
      if (response.data.success) return response.data.recipes;
      throw new Error(response.data.message || "Failed to fetch recipes");
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const recipes = recipesData || [];

  useEffect(() => {
    if (isError && error) toast.error((error as Error).message);
  }, [isError, error]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("user");
    navigate.push("/login");
  };

  const value: ShopContextType = {
    recipes, isLoading, currency,
    navigate, backendUrl, token, setToken, role, setRole, logout
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;