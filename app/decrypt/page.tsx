"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Unlock, Trash2, Copy, Check, ChevronDown, Clock } from "lucide-react";
import { decryptMessage } from "@/lib/crypto/poly-shield";
import { getContacts, Contact } from "@/lib/store/db";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DecryptPage() {
  const [ciphertext, setCiphertext] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedSender, setSelectedSender] = useState<Contact | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showPlaintext, setShowPlaintext] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getContacts().then(setContacts);
  }, []);

  const handleDecrypt = async () => {
    if (!ciphertext || !selectedSender) return;
    
    setIsDecrypting(true);
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      const result = await decryptMessage(ciphertext, selectedSender.sharedSecret);
      setPlaintext(result);
      setShowPlaintext(true);
      startTimer();
    } catch (error) {
      alert("Decryption failed. Invalid ciphertext or wrong sender selected.");
      console.error("Decryption failed", error);
    } finally {
      setIsDecrypting(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(15 * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleWipe();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleWipe = () => {
    setPlaintext("");
    setCiphertext("");
    setShowPlaintext(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(plaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 glass-cyan border-secondary/30 flex items-center justify-center">
          <Key size={24} className="text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl font-mono uppercase tracking-widest">Decrypt Message</h1>
          <p className="text-xs text-muted font-mono">STEP 02 // BREACHING DATA SHIELD</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Sender Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest ml-1">Sender</label>
          <div className="relative">
            <select 
              className="cyber-input appearance-none cursor-pointer"
              onChange={(e) => setSelectedSender(contacts.find(c => c.id === e.target.value) || null)}
              value={selectedSender?.id || ""}
            >
              <option value="" disabled>Select sender from vault...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
          </div>
        </div>

        {/* Ciphertext Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest ml-1">Paste Ciphertext</label>
          <textarea
            className="cyber-input min-h-[150px] resize-none font-mono text-xs break-all"
            placeholder="Paste the Base91 cipher text here..."
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
          />
        </div>

        <button 
          onClick={handleDecrypt}
          disabled={!ciphertext || !selectedSender || isDecrypting}
          className={cn(
            "w-full py-4 font-mono uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3",
            (!ciphertext || !selectedSender) 
              ? "bg-white/5 text-muted cursor-not-allowed" 
              : "bg-secondary text-white hover:bg-secondary/80 shadow-[0_0_20px_rgba(123,47,255,0.2)]"
          )}
        >
          {isDecrypting ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Unlock size={20} />
              Decrypt Now
            </>
          )}
        </button>

        {/* Decrypted Plaintext Result */}
        <AnimatePresence>
          {showPlaintext && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 pt-8"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-2 text-danger">
                    <Clock size={12} />
                    Auto-wiping in {formatTime(timeLeft)}
                  </div>
                  <span className="text-muted">Data integrity: 100%</span>
                </div>
                
                {/* Timer Progress Bar */}
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="h-full bg-danger"
                  />
                </div>
              </div>

              <div className="p-8 glass-cyan border-primary/20 relative overflow-hidden">
                {/* Scanline Animation */}
                <motion.div 
                  initial={{ top: "-100%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-[100px] bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none z-10"
                />
                
                <div className="relative z-0 min-h-[100px] whitespace-pre-wrap font-sans text-xl leading-relaxed text-foreground">
                  {plaintext}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleCopy}
                  className="py-4 glass flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy Plaintext"}
                </button>
                <button 
                  onClick={handleWipe}
                  className="py-4 glass border-danger/30 text-danger flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest hover:bg-danger/10 transition-all"
                >
                  <Trash2 size={16} />
                  Delete Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
