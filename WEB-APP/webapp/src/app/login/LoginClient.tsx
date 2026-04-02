"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Account created successfully! Please login.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-100 flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
     
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none animate-pulse" />

      <div className="max-w-md w-full z-10 transition-all duration-700">
        
        
        <div className="text-center mb-8 transform hover:scale-110 transition-transform duration-500 cursor-default">
          <h1 className="text-3xl font-black tracking-tighter  mb-2 text-white">LeetOtracker</h1>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em]">Access Your Pipeline</p>
        </div>

        <div className="bg-zinc-900/40 border border-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] hover:border-indigo-500/30 transition-all duration-500">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-[10px] font-black uppercase text-center">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-[10px] font-black uppercase text-center animate-bounce">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Email Address */}
              <div className="group transition-all">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1 mb-1 block group-hover:text-indigo-400 transition-colors">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:scale-[1.01] outline-none transition-all placeholder:text-zinc-700"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="group transition-all">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1 mb-1 block group-hover:text-indigo-400 transition-colors">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:scale-[1.01] outline-none transition-all placeholder:text-zinc-700 pr-11"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* REACTIVE LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Authorizing..." : "Initiate Session"}
            </button>
          </form>

          {/* LIGHTER FOOTER TEXT */}
          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-tight">
              New to the system?{" "}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 hover:underline transition ml-1 underline-offset-4">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}