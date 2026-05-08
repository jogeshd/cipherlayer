"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, Settings, Maximize2, Minimize2, Copy, Send } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * OverlayFlow Component
 * This is the core "Overflow" interface designed to float over messaging apps.
 */
export default function OverlayFlow() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");

  const handleAction = () => {
    // Integration with your existing crypto logic
    // For demo purposes, we'll just mock the result
    if (mode === "encrypt") {
      setResult(`[CIPHER]::${inputText}::[END]`);
    } else {
      setResult(inputText.replace("[CIPHER]::", "").replace("::[END]", ""));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    // You could trigger a notification here
  };

  return (
    <div className="fixed bottom-10 right-10 z-[9999] pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end gap-4">
        
        {/* Floating Result Badge */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-primary/20 backdrop-blur-xl border border-primary/30 px-6 py-3 rounded-2xl flex items-center gap-4 text-xs font-bold tracking-widest text-primary shadow-[0_0_30px_rgba(0,113,227,0.3)]"
            >
              <SparkleIcon />
              RESULT SECURED
              <button onClick={copyToClipboard} className="hover:text-white transition-colors">
                <Copy size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Overlay Window */}
        <motion.div
          animate={{
            width: isExpanded ? 400 : 64,
            height: isExpanded ? 320 : 64,
            borderRadius: isExpanded ? 32 : 32,
          }}
          className="bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden relative group"
        >
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full h-full flex items-center justify-center text-primary hover:text-white transition-colors"
            >
              <Shield size={28} className="filter drop-shadow-[0_0_10px_#0071E3]" />
            </button>
          ) : (
            <div className="p-8 h-full flex flex-col space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-apple-grey">Elite Node Active</span>
                </div>
                <button onClick={() => setIsExpanded(false)} className="text-apple-grey hover:text-white transition-colors">
                  <Minimize2 size={18} />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-white/5 rounded-2xl p-1 p-2">
                <button
                  onClick={() => setMode("encrypt")}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    mode === "encrypt" ? "bg-primary text-white shadow-lg" : "text-apple-grey"
                  }`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setMode("decrypt")}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    mode === "decrypt" ? "bg-primary text-white shadow-lg" : "text-apple-grey"
                  }`}
                >
                  Decrypt
                </button>
              </div>

              {/* Input Area */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === "encrypt" ? "Type to shield..." : "Paste cipher text..."}
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-apple-grey/50"
              />

              {/* Action Button */}
              <button
                onClick={handleAction}
                className="bg-primary hover:bg-primary-hover py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {mode === "encrypt" ? <Lock size={16} /> : <Unlock size={16} />}
                Execute Protocol
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2L14.4,9.6L22,12L14.4,14.4L12,22L9.6,14.4L2,12L9.6,9.6L12,2Z" />
    </svg>
  );
}
