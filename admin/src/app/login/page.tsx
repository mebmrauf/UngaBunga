"use client";

import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { ShopContext } from "../../context/ShopContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { settoken, navigate, token } = useContext(ShopContext)!;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) navigate.replace("/");
  }, [token, navigate]);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/user/admin", { email, password });
      if (response.data.success) {
        settoken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("Welcome Admin! 👋");
        navigate.push("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="glass overflow-hidden">
          <div className="bg-orange-600 px-8 py-10 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">
              🛡️
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-orange-100 text-sm mt-1">Sign in to manage Khabari</p>
          </div>
          <form onSubmit={onSubmitHandler} className="px-8 py-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="input-field"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="input-field"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          Protected System. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
