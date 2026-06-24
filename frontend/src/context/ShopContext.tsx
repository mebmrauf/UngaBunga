"use client";
import { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

type CartItems = Record<string, Record<string, number>>;

type ShopContextType = {
  products: any[];
  categories: any[];
  isLoading: boolean;
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItems;
  addToCart: (itemId: string, quantity: string) => void;
  removeFromCart: (itemId: string, quantity: string) => void;
  updateCartItem: (itemId: string, quantity: string, count: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  navigate: ReturnType<typeof useRouter>;
  backendUrl: string;
  token: string;
  settoken: React.Dispatch<React.SetStateAction<string>>;
};

export const ShopContext = createContext<ShopContextType | null>(null);

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const currency = "৳";
  const delivery_fee = 50;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [token, settoken] = useState("");
  const navigate = useRouter();

  const { data: productsData, isLoading: isProductsLoading, isError: isProductsError, error: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/product/list");
      if (response.data.success) return response.data.products;
      throw new Error(response.data.message);
    },
    staleTime: 0,
    gcTime: 0,
  });

  const { data: categoriesData, isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/category/list");
      if (response.data.success) return response.data.categories;
      throw new Error(response.data.message);
    },
    staleTime: 0,
    gcTime: 0,
  });

  const products = productsData || [];
  const categories = categoriesData || [];
  const isLoading = isProductsLoading || isCategoriesLoading;

  useEffect(() => {
    if (isProductsError && productsError) toast.error((productsError as Error).message);
  }, [isProductsError, productsError]);

  useEffect(() => {
    if (isCategoriesError && categoriesError) toast.error((categoriesError as Error).message);
  }, [isCategoriesError, categoriesError]);

  const addToCart = useCallback((itemId: string, quantity: string) => {
    if (!quantity) {
      toast.error("Select a quantity first");
      return;
    }
    setCartItems(prev => {
      const copy = structuredClone(prev);
      if (!copy[itemId]) copy[itemId] = {};
      copy[itemId][quantity] = (copy[itemId][quantity] || 0) + 1;
      return copy;
    });
    toast.success("Added to cart!");
  }, []);

  const removeFromCart = useCallback((itemId: string, quantity: string) => {
    setCartItems(prev => {
      const copy = structuredClone(prev);
      if (copy[itemId]?.[quantity]) {
        delete copy[itemId][quantity];
        if (Object.keys(copy[itemId]).length === 0) delete copy[itemId];
      }
      return copy;
    });
  }, []);

  const updateCartItem = useCallback((itemId: string, quantity: string, count: number) => {
    setCartItems(prev => {
      const copy = structuredClone(prev);
      if (count <= 0) {
        if (copy[itemId]) {
          delete copy[itemId][quantity];
          if (Object.keys(copy[itemId]).length === 0) delete copy[itemId];
        }
      } else {
        if (!copy[itemId]) copy[itemId] = {};
        copy[itemId][quantity] = count;
      }
      return copy;
    });
  }, []);

  const clearCart = useCallback(() => setCartItems({}), []);

  const getCartCount = useCallback(() => {
    return Object.values(cartItems).reduce((total, quantities) =>
      total + Object.values(quantities).reduce((t, c) => t + c, 0), 0);
  }, [cartItems]);

  const getCartTotal = useCallback(() => {
    return Object.entries(cartItems).reduce((total, [itemId, quantities]) => {
      const product = products.find((p: any) => p._id === itemId);
      if (!product) return total;
      return total + Object.values(quantities).reduce((t, count) => t + product.price * count, 0);
    }, 0);
  }, [cartItems, products]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      settoken(localStorage.getItem("token") || "");
    }
  }, []);

  const value: ShopContextType = {
    products, categories, isLoading, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, addToCart, removeFromCart, updateCartItem, clearCart,
    getCartCount, getCartTotal,
    navigate, backendUrl, token, settoken,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;