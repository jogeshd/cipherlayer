import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Lock, Shield, Settings, Vault, Key } from "lucide-react";
import AIAssistant from "@/components/ai/AIAssistant";

export const metadata: Metadata = {
  title: "CipherLayer | Zero Trust Encryption",
  description: "Your words. Their encryption. Zero trust.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#050810",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <div className="data-dots" />
        
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              <Lock size={18} className="text-black" />
            </div>
            <span className="font-mono font-bold tracking-tighter text-xl hidden sm:inline">
              CIPHER<span className="text-primary">LAYER</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm font-mono uppercase tracking-widest text-muted">
            <Link href="/encrypt" className="hover:text-primary transition-colors flex items-center gap-2">
              <Shield size={16} /> <span className="hidden md:inline">Encrypt</span>
            </Link>
            <Link href="/decrypt" className="hover:text-primary transition-colors flex items-center gap-2">
              <Key size={16} /> <span className="hidden md:inline">Decrypt</span>
            </Link>
            <Link href="/vault" className="hover:text-primary transition-colors flex items-center gap-2">
              <Vault size={16} /> <span className="hidden md:inline">Vault</span>
            </Link>
            <Link href="/settings" className="hover:text-primary transition-colors">
              <Settings size={20} />
            </Link>
          </div>
        </nav>

        <main className="flex-1 container mx-auto px-6 max-w-5xl">
          {children}
        </main>

        <AIAssistant />

        <footer className="py-12 border-t border-white/5 text-center text-muted text-xs font-mono tracking-widest">
          &copy; 2026 CIPHERLAYER // SECURE TERMINAL // ZERO TRUST ESTABLISHED
        </footer>
      </body>
    </html>
  );
}
