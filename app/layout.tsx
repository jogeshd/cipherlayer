import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import { Search, ShoppingBag, Shield } from "lucide-react";
import AIAssistant from "@/components/ai/AIAssistant";
import OverlayFlow from "@/components/app/OverlayFlow";

export const metadata: Metadata = {
  title: "CipherLayer | Privacy Pro",
  description: "The silicon standard in digital encryption wrapper.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="antialiased min-h-screen bg-black text-white selection:bg-primary selection:text-white">
        
        {/* Authentic Apple Pro Local Nav */}
        <nav className="apple-nav">
          <div className="w-full max-w-[980px] flex justify-between items-center px-6">
            <Link href="/" className="hover-reveal flex items-center gap-2">
              <Shield size={16} />
              <span className="font-bold tracking-tighter text-[17px]">CIPHERLAYER</span>
            </Link>

            <div className="flex items-center gap-6 md:gap-10 text-[12px] font-medium text-white/80 tracking-tight">
              <Link href="/encrypt" className="hover:text-white transition-colors">Encrypt</Link>
              <Link href="/decrypt" className="hover:text-white transition-colors">Decrypt</Link>
              <Link href="/vault" className="hover:text-white transition-colors">Vault</Link>
              <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
            </div>
          </div>
        </nav>

        <main className="w-full">
          {children}
        </main>

        <AIAssistant />
        <OverlayFlow />

        {/* Apple Style Footer */}
        <footer className="bg-[#161617] py-20 px-6 border-t border-white/5">
          <div className="max-w-[980px] mx-auto space-y-12">
            <div className="text-[12px] text-apple-grey leading-relaxed font-medium space-y-4">
              <p>
                1. PolyShield™ encryption engine requires an active subscription for advanced AI decoy generation and unlimited character support.
              </p>
              <p>
                Privacy is a fundamental human right. CipherLayer implements zero-trust protocols at every layer to ensure absolute data sovereignty. 
                Copyright © 2026 CipherLayer. All rights reserved.
              </p>
            </div>
            <div className="h-[0.5px] bg-white/10" />
            <div className="flex flex-wrap gap-8 text-[12px] text-apple-grey font-semibold">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
              <span className="hover:text-white cursor-pointer transition-colors">Sales Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Legal</span>
              <span className="hover:text-white cursor-pointer transition-colors">Site Map</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
