"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";

export default function LeetXChat({ user }: { user: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !user) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role === "bot" ? "assistant" : "user",
        content: msg.content,
      }));

      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        { query: currentInput, history: history },
        {
          headers: {
            "x-user-id": user.leetcodeUsername,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.response) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: response.data.response },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "**Logic Core Offline.** Ensure your FastAPI server is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
          
          <div className="w-full h-20 border-b border-white/5 flex items-center justify-between px-8 md:px-20 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_#22d3ee]" />
              <span className="font-black text-sm tracking-[0.3em] text-white">leX</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all"
            >
              <span className="hidden md:block text-red-600 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors">
                Close Session
              </span>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col items-center">
            <div 
              ref={scrollRef}
              className="w-full max-w-4xl flex-1 overflow-y-auto px-6 py-12 space-y-10 scrollbar-hide"
            >
              {!user ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="text-6xl mb-4">🔐</div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Authentication Required</h2>
                  <p className="text-zinc-500 max-w-sm">Log in to sync your LeetCode problems with our mentor brain.</p>
                  <button onClick={() => router.push("/login")} className="bg-white text-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all">Authorize Now</button>
                </div>
              ) : (
                <>
                  {messages.length === 0 && (
                    <div className="text-center py-20 animate-in zoom-in-95 duration-700">
                      <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(79,70,229,0.3)]">🤖</div>
                      <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                        Hello, {user.leetcodeUsername}!
                      </h1>
                      <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-lg mx-auto">
                        Do you want a perfect revision plan or a mock interview to level up today?
                      </p>
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} w-full`}>
                      <div className={`max-w-[85%] md:max-w-[75%] p-8 rounded-[2.5rem] text-[16px] leading-relaxed transition-all ${
                          m.role === "user" 
                            ? "bg-zinc-900 text-white rounded-tr-none border border-white/10" 
                            : "bg-indigo-600/10 text-zinc-100 rounded-tl-none border border-indigo-500/20 shadow-2xl shadow-indigo-500/5"
                        }`}
                      >
                        <div className="prose prose-invert prose-p:leading-relaxed prose-strong:text-cyan-400 prose-code:text-indigo-300 max-w-none">
                          <Markdown>{m.content}</Markdown>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-2 items-center text-zinc-600">
                      <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="w-full max-w-4xl p-6 md:pb-12 shrink-0">
              <div className="relative bg-zinc-900 border border-white/10 rounded-[3rem] p-2 flex items-center shadow-2xl focus-within:border-indigo-500 transition-all">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask leX about a revision plan or interview..."
                  className="flex-1 bg-transparent border-none px-8 py-5 text-lg text-white placeholder:text-zinc-700 focus:outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-cyan-400 transition-all disabled:opacity-20 active:scale-90 mr-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
              <p className="text-center text-[10px] text-zinc-700 mt-4 uppercase tracking-[0.3em]">Precision Engineering for good Placement Goals</p>
            </div>
          </div>
        </div>
      )}

    
      <div className="fixed bottom-10 right-10 z-[1000]">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center px-8 py-5 bg-[#0a0a0c] rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/5 to-transparent shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-500 scale-125 hover:shadow-[0_0_60px_rgba(34,211,238,0.5)]"
        >
          <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl">🤖</span>
            
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-400 rounded-full border-2 border-[#0a0a0c] shadow-[0_0_10px_#22d3ee] animate-pulse" />
          </div>
          <div className="flex flex-col items-start pr-4 ml-5 text-left">
            <span className="text-[12px] font-bold text-zinc-400 leading-none mb-1 tracking-tighter uppercase">Chat with</span>
            <span className="text-xl font-black text-cyan-400 tracking-tight leading-none ">LeX</span>
          </div>
        </button>
      </div>
    </>
  );
}