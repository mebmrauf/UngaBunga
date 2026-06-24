"use client";
import { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { io, Socket } from "socket.io-client";

type CartItems = Record<string, Record<string, number>>;

type ShopContextType = {
  products: any[];
  categories: any[];
  recipes: any[];
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
  setToken: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  logout: () => void;
  socket: Socket | null;
  userId: string | null;
};

export const ShopContext = createContext<ShopContextType | null>(null);

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const currency = "৳";
  const delivery_fee = 50;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [token, setToken] = useState("");
  const [role, setRole] = useState("user");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (savedToken) setToken(savedToken);
    if (savedRole) setRole(savedRole);
  }, []);

  useEffect(() => {
    if (token) {
      const newSocket = io(backendUrl);
      setSocket(newSocket);

      axios.get(`${backendUrl}/api/user/profile`, { headers: { token } })
        .then((res) => {
          if (res.data.success && res.data.user) {
            setUserId(res.data.user._id);
            newSocket.emit('join', res.data.user._id);
          }
        })
        .catch((err) => console.error("Failed to fetch profile for socket", err));

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) socket.disconnect();
      setSocket(null);
      setUserId(null);
    }
  }, [token, backendUrl]);

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

  const { data: recipesData, isError: isRecipesError, error: recipesError } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/api/recipe/feed`);
      if (response.data.success) return response.data.recipes;
      throw new Error(response.data.message || "Failed to fetch recipes");
    },
    staleTime: 1000 * 60 * 5,
  });

  const products = productsData || [];
  const categories = categoriesData || [];
  const recipes = recipesData || [];
  const isLoading = isProductsLoading || isCategoriesLoading;

  useEffect(() => {
    if (isProductsError && productsError) toast.error((productsError as Error).message);
    if (isCategoriesError && categoriesError) toast.error((categoriesError as Error).message);
    if (isRecipesError && recipesError) toast.error((recipesError as Error).message);
  }, [isProductsError, productsError, isCategoriesError, categoriesError, isRecipesError, recipesError]);

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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("user");
    navigate.push("/login");
  };

  const value: ShopContextType = {
    products, categories, recipes, isLoading, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, addToCart, removeFromCart, updateCartItem, clearCart,
    getCartCount, getCartTotal,
    navigate, backendUrl, token, setToken, role, setRole, logout,
    socket, userId
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;