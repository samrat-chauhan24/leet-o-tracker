"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
        fetchStats();
      } else {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/leetcode/stats");
      if (response.data.success) setStats(response.data.data);
    } catch (error) {
      console.error("Fetch error");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await axios.post("/api/leetcode/sync");
      if (response.data.success) await fetchStats();
    } catch (error) {
      alert("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020203]">
      <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
    </div>
  );

  const safeStats = {
    easy: stats?.easy ?? 0,
    medium: stats?.medium ?? 0,
    hard: stats?.hard ?? 0,
    total: stats?.totalSolved ?? 0,
    streak: stats?.streak ?? 0,
    rank: stats?.ranking ?? "0"
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((safeStats.total / 500) * 100, 100); 
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-100 font-sans selection:bg-indigo-500/30 pb-10 overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <nav className="sticky top-0 z-[100] border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.8)]" />
            <span className="font-black text-[10px] tracking-[0.3em] uppercase">LeetOtracker</span>
          </div>
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{user?.name}</span>
             <button 
                onClick={() => { setLoggingOut(true); axios.post("/api/auth/logout").then(() => window.location.href = "/"); }}
                className="text-[9px] font-black text-red-500 hover:text-red-400 transition-all uppercase tracking-widest"
             >
                {loggingOut ? "TERMINATING..." : "LOGOUT"}
             </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-10">
        
        <div className="mb-12">
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mb-2">
              DEVELOPER<br /><span className="text-zinc-600">Panel</span>
            </h1>
            <div className="flex justify-between items-center">
                <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-widest">Hello, {user?.name}Your weekly AI report awaits in your inbox.</p>
                <button 
                    onClick={handleSync}
                    disabled={syncing}
                    className="group flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
                >
                    <svg className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {syncing ? "SYNCING..." : "SYNC LEETCODE"}
                </button>
            </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    <span>CURRENT STREAK</span>
                    <span>🔥</span>
                </div>
                <div className="text-5xl font-black text-[#FF8C00]">{safeStats.streak}</div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    <span>GLOBAL RANK</span>
                    <span>🏆</span>
                </div>
                <div className="text-4xl font-black text-[#5568FF]">#{safeStats.rank}</div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    <span>TOTAL SOLVED</span>
                    <span>🎯</span>
                </div>
                <div className="text-5xl font-black text-[#00F5A0]">{safeStats.total}</div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* LEFT: RING & BREAKDOWN */}
          <div className="md:col-span-3 p-10 rounded-[2.5rem] bg-zinc-900/20 border border-white/5 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-10">LOGIC BREAKDOWN</h3>
            <div className="flex flex-col md:flex-row items-center gap-12 w-full">
                <div className="relative flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                        <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-800" />
                        <circle cx="96" cy="96" r={radius} stroke="url(#gradient)" strokeWidth="12" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s ease-out' }} strokeLinecap="round" />
                        <defs><linearGradient id="gradient"><stop offset="0%" stopColor="#00F5A0" /><stop offset="100%" stopColor="#00D9F5" /></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-white">{safeStats.total}</span>
                        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">TOTAL</span>
                    </div>
                </div>

                <div className="flex-1 w-full space-y-6">
                    {[
                        { l: "EASY", v: safeStats.easy, c: "bg-emerald-500", p: (safeStats.easy/safeStats.total)*100 },
                        { l: "MEDIUM", v: safeStats.medium, c: "bg-yellow-500", p: (safeStats.medium/safeStats.total)*100 },
                        { l: "HARD", v: safeStats.hard, c: "bg-red-500", p: (safeStats.hard/safeStats.total)*100 },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                                <span className="text-zinc-500">{item.l}</span>
                                <span className="text-white">{item.v}</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className={`h-full ${item.c} rounded-full transition-all duration-700`} style={{ width: `${item.p || 0}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* RIGHT: PROBLEM LIST */}
          <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-zinc-900/20 border border-white/5 backdrop-blur-md relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-8">RECENT ACTIVITY</h3>
            <div className="space-y-4">
              {stats?.recentProblems?.slice(0, 5).map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold tracking-tight text-zinc-200">{p.title}</span>
                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                      {new Date(p.solvedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_10px] ${
                    p.difficulty === 'Easy' ? 'bg-emerald-500 shadow-emerald-500/50' :
                    p.difficulty === 'Medium' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-red-500 shadow-red-500/50'
                  }`} />
                </div>
              )) || <div className="text-center py-20 text-[10px] text-zinc-700 uppercase tracking-widest font-black italic">No records found</div>}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}