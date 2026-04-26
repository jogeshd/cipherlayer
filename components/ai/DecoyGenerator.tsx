"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DecoyGenerator() {
  const [decoy, setDecoy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateDecoy = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Generate a short, casual, realistic text message about everyday life that someone might genuinely send to a friend. Max 2 sentences. No suspicion.",
          systemInstruction: "You are a decoy generator for a privacy app. Your goal is to produce mundane, non-suspicious text messages."
        })
      });
      const data = await res.json();
      setDecoy(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(decoy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass p-6 space-y-4 border-secondary/20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-secondary font-mono text-xs uppercase tracking-widest">
          <Sparkles size={14} /> AI Decoy Generator
        </div>
        <button 
          onClick={generateDecoy} 
          disabled={isLoading}
          className="text-muted hover:text-secondary transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {decoy ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-sm italic text-muted leading-relaxed">&quot;{decoy.trim()}&quot;</p>
            <button 
              onClick={handleCopy}
              className="w-full py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary text-[10px] font-mono uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied Decoy" : "Copy Decoy"}
            </button>
          </motion.div>
        ) : (
          <p className="text-[10px] text-muted font-mono text-center py-4">
            Click refresh to generate a mundane decoy message.
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}
