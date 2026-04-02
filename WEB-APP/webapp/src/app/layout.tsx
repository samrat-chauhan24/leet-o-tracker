import type { Metadata } from "next";
import "./globals.css";
import ChatWrapper from "../components/ChatWrapper"

export const metadata: Metadata = {
  title: "LeetOTracker",
  description: "Track your LeetCode journey with AI-powered insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {/* The Chatbot logic is now global */}
        <ChatWrapper /> 
      </body>
    </html>
  );
}