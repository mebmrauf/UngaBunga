"use client";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Link from "next/link";


export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { token, setToken, setRole, navigate } = useContext(ShopContext)!;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (token) navigate.push("/");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/api/user/register" : "/api/user/login";
      const payload = mode === "signup" ? { name, email, password } : { email, password };
      const res = await axiosInstance.post(endpoint, payload);
      if (res.data.success) {
        setToken(res.data.token);
        setRole(res.data.role || "user");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role || "user");
        toast.success(mode === "signup" ? "Account created! Welcome 🎉" : "Welcome back! 👋");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-600 to-amber-500 px-8 pt-10 pb-8 text-white text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              {mode === "login" ? "👋" : "🌿"}
            </div>
            <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back!" : "Create account"}</h1>
            <p className="text-orange-100 text-sm mt-1">
              {mode === "login" ? "Sign in to your Khabari account" : "Join Khabari today"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex border-b border-gray-100">
            {(["login", "signup"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-2">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-orange-600 hover:underline">Terms</Link>
          {" & "}
          <Link href="#" className="text-orange-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}