"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const features = [
    {
      title: "Automated reporting",
      desc: "Consistency tracking paired with beautifully structured performance reports sent to your email weekly.",
      icon: "📩"
    },
    {
      title: "leX: AI Interview Agent",
      desc: "Simulates real technical interviews based on your LeetCode history with adaptive questions and real-time feedback.",
      icon: "🤖"
  },
      {
      title: "leX: Ai Revision Agent",
      desc: "Analyzes your solved problems and pinpoints weak patterns, then generates a focused revision plan to strengthen your DSA logic.",
      icon: "🎯"
  },
  
   
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data?.success) router.push("/dashboard");
    } catch (e) { /* Stay */ } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020203]">
      <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-100 selection:bg-indigo-500/30 font-sans tracking-tight overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full opacity-60" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-[100] border border-white/10 bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl">
        <div className="px-6 h-12 flex items-center justify-between">
          <span className="font-black text-xs tracking-[0.2em] uppercase text-white">LeetOtracker</span>
          <div className="flex gap-4">
            <button onClick={() => router.push("/login")} className="text-[10px] font-bold uppercase text-zinc-400 hover:text-white transition">Sign In</button>
            <button onClick={() => router.push("/signup")} className="text-[10px] font-bold uppercase bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all">Get Started</button>
          </div>
        </div>
      </nav>

      
      <section className="relative pt-40 pb-16 px-6 z-10 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto perspective-1000">
          <div className="inline-block px-3 py-1 mb-6 rounded-md border border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
            AI-Powered DSA coach for LeetCode enthusiasts
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
            We automate <br />
            <span className="bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">your Grind</span>
          </h1>
          
          <p className="text-sm md:text-lg text-zinc-500 max-w-xl mx-auto mb-10 font-medium leading-tight">
            Your daily LeetCode activity converted into a surgical weekly revision plan. Sent straight to your inbox.
          </p>

          <button onClick={() => router.push("/signup")} className="bg-white text-black px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all active:scale-95">
            Start Free Now
          </button>
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div 
              key={f.title} 
              className="group relative p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-white/5 hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
              <h3 className="text-base font-bold text-white mb-3 tracking-wide uppercase">{f.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-semibold">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

     
      <section className="px-6 py-16 z-10 relative">
        <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-indigo-600 p-1 bg-gradient-to-br from-indigo-400 to-indigo-800 shadow-[0_40px_80px_-20px_rgba(79,70,229,0.5)]">
          <div className="bg-[#050505] rounded-[2.3rem] p-12 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 relative z-10">
              LEVEL UP YOUR <br /> INBOX.
            </h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto font-bold uppercase tracking-wider relative z-10 leading-snug">
              Weak areas. Next steps. Revision schedules. <br /> All Automated.
            </p>
            <button onClick={() => router.push("/signup")} className="relative z-10 bg-indigo-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl">
              Join LeetOtracker
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-white/5 bg-black/20">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.8em]">© 2026 LEETOTRACKER</p>
      </footer>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}