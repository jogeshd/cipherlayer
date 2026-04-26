import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import { Shield, Key, Vault, Settings, Menu } from "lucide-react";
import AIAssistant from "@/components/ai/AIAssistant";

export const metadata: Metadata = {
  title: "CipherLayer | Privacy Reimagined",
  description: "The silicon-standard in digital encryption wrapper.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-black text-white">
        {/* Apple Style Nav */}
        <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-black/60 border-b border-white/5 h-12 flex items-center justify-center px-6">
          <div className="w-full max-w-5xl flex justify-between items-center">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <span className="font-bold tracking-tighter text-sm">CIPHERLAYER</span>
            </Link>

            <div className="flex items-center gap-8 text-[12px] font-medium text-white/60 tracking-tight">
              <Link href="/encrypt" className="hover:text-white transition-colors">Encrypt</Link>
              <Link href="/decrypt" className="hover:text-white transition-colors">Decrypt</Link>
              <Link href="/vault" className="hover:text-white transition-colors">Vault</Link>
              <Link href="/settings" className="hover:text-white transition-colors">
                <Settings size={14} />
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full overflow-x-hidden">
          {children}
        </main>

        <AIAssistant />

        <footer className="py-20 bg-black border-t border-white/5 text-center px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-[12px] text-apple-grey leading-relaxed max-w-2xl mx-auto">
              CipherLayer uses advanced 256-bit encryption. Zero-trust principles apply to all data transmissions.
              No private keys are stored on our servers. Privacy is a fundamental human right.
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-center gap-8 text-[12px] text-apple-grey">
              <span>Copyright © 2026 CipherLayer. All rights reserved.</span>
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Use</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
