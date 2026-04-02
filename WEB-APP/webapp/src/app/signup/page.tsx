"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    leetcodeUsername: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(formData.leetcodeUsername.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.leetcodeUsername]);

  useEffect(() => {
    if (!debouncedUsername) {
      setUsernameStatus("idle");
      return;
    }
    const checkUsername = async () => {
      try {
        setUsernameStatus("checking");
        const res = await axios.get("/api/check-username-unique", {
          params: { leetcodeUsername: debouncedUsername },
        });
        setUsernameStatus(res.data.success ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    };
    checkUsername();
  }, [debouncedUsername]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.email) errors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid";
    if (formData.password.length < 6) errors.password = "Min 6 chars";
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "No match";
    if (!formData.leetcodeUsername) errors.leetcodeUsername = "Required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);
  setError("");

  try {
    // 1. Signup API call
    const response = await axios.post("/api/auth/signup", formData);

    if (response.data.success) {
      // 2. Fire n8n webhook in background (non-blocking)
      axios
        .post("http://localhost:5678/webhook/register-user", {
          email: formData.email,
          leetcodeUsername: formData.leetcodeUsername,
        })
        .catch((err) => {
          console.log("⚠️ Webhook failed:", err);
        });

      // 3. Redirect immediately
      router.push("/login?registered=true");
    }
  } catch (err: any) {
    setError(err.response?.data?.message || "Signup failed");
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
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em]">The Intelligent Pipeline</p>
        </div>

        <div className="bg-zinc-900/40 border border-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] hover:border-indigo-500/30 transition-all duration-500">
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-[10px] font-black uppercase text-center animate-bounce">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5">
              
              <div className="group transition-all">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1 mb-1 block group-hover:text-indigo-400 transition-colors">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:scale-[1.01] outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Enter your name"
                />
              </div>

              <div className="group transition-all">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1 mb-1 block group-hover:text-indigo-400">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:border-indigo-500/50 focus:scale-[1.01] outline-none transition-all placeholder:text-zinc-700`}
                  placeholder="name@example.com"
                />
                <p className="mt-2 ml-1 text-[9px] font-bold text-indigo-400/80  tracking-wider animate-pulse">
                   Automated insights will be sent here.
                </p>
              </div>

              <div className="group transition-all">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1 mb-1 block group-hover:text-indigo-400">
                  LeetCode ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="leetcodeUsername"
                    value={formData.leetcodeUsername}
                    onChange={handleChange}
                    className={`w-full bg-black/50 border ${
                      usernameStatus === "available" ? 'border-green-500/40' : 
                      usernameStatus === "taken" ? 'border-red-500/40' : 'border-white/10'
                    } rounded-xl px-4 py-3 text-sm focus:border-indigo-500/50 focus:scale-[1.01] outline-none transition-all placeholder:text-zinc-700`}
                    placeholder="leetcode_username"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {usernameStatus === "checking" && <div className="h-3 w-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
                    {usernameStatus === "available" && <span className="text-green-400 text-xs font-bold animate-pulse">✓</span>}
                    {usernameStatus === "taken" && <span className="text-red-400 text-xs font-bold">✗</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group transition-all">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1 mb-1 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                      placeholder="••••••"
                    />
                  </div>
                </div>
                <div className="group transition-all">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1 mb-1 block">Confirm</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-700"
                      placeholder="••••••"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 disabled:opacity-50 mt-4"
            >
              {loading ? "Initializing..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-tight">
              Already optimized?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline transition ml-1 underline-offset-4">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}