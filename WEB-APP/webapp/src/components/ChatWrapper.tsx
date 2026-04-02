"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation"; // Add this
import LeetXChat from "./LeetXChat";

export default function ChatWrapper() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname(); // Track URL changes

  const checkUser = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  // Re-run whenever the path changes
  useEffect(() => {
    checkUser();
  }, [pathname]); 

  return <LeetXChat user={user} />;
}