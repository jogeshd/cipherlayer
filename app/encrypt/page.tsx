"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Copy, Check, ShieldCheck, ChevronDown, User } from "lucide-react";
import { encryptMessage } from "@/lib/crypto/poly-shield";
import { getContacts, Contact } from "@/lib/store/db";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DecoyGenerator from "@/components/ai/DecoyGenerator";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function EncryptPage() {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getContacts().then(setContacts);
  }, []);

  const handleEncrypt = async () => {
    if (!plaintext || !selectedContact) return;
    
    setIsEncrypting(true);
    // Artificial delay for effect
    await new Promise(r => setTimeout(r, 1200));
    
    try {
      const result = await encryptMessage(plaintext, selectedContact.sharedSecret);
      setCiphertext(result);
    } catch (error) {
      console.error("Encryption failed", error);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ciphertext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charLimit = 500; // Free tier limit
  const isOverLimit = plaintext.length > charLimit;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 glass-cyan flex items-center justify-center">
          <Lock size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-mono uppercase tracking-widest">Encrypt Message</h1>
          <p className="text-xs text-muted font-mono">STEP 01 // DATA SEALING INITIATED</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Recipient Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest ml-1">Recipient</label>
          <div className="relative">
            <select 
              className="cyber-input appearance-none cursor-pointer"
              onChange={(e) => setSelectedContact(contacts.find(c => c.id === e.target.value) || null)}
              value={selectedContact?.id || ""}
            >
              <option value="" disabled>Select recipient from vault...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
          </div>
          {contacts.length === 0 && (
            <p className="text-[10px] text-danger font-mono mt-1">No contacts found. Go to Vault to add one.</p>
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest ml-1">Plaintext Message</label>
            <span className={cn("text-[10px] font-mono", isOverLimit ? "text-danger" : "text-muted")}>
              {plaintext.length} / {charLimit}
            </span>
          </div>
          <textarea
            className="cyber-input min-h-[200px] resize-none font-sans text-lg"
            placeholder="Type your secret message here..."
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
          />
        </div>

        {/* Algorithm Badge */}
        <div className="flex items-center gap-3 py-2">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,240,255,1)]"
          />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">
            Algorithm: Auto-Selected (Hidden)
          </span>
        </div>

        <button 
          onClick={handleEncrypt}
          disabled={!plaintext || !selectedContact || isEncrypting || isOverLimit}
          className={cn(
            "w-full py-4 font-mono uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3",
            (!plaintext || !selectedContact || isOverLimit) 
              ? "bg-white/5 text-muted cursor-not-allowed" 
              : "bg-primary text-black hover:bg-primary/80 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          )}
        >
          {isEncrypting ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
            />
          ) : (
            <>
              <ShieldCheck size={20} />
              Encrypt & Generate
            </>
          )}
        </button>

        <DecoyGenerator />

        {/* Output Area */}
        <AnimatePresence>
          {ciphertext && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pt-4"
            >
              <div className="p-6 glass-cyan bg-primary/5 break-all font-mono text-sm relative group">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
                  <div className="w-full h-[1px] bg-primary animate-scan-line" />
                </div>
                <Typewriter text={ciphertext} />
              </div>
              
              <button 
                onClick={handleCopy}
                className="w-full py-3 glass flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? "Copied to clipboard!" : "Copy Ciphertext"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Typewriter({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i += 5; // Reveal faster for long cipher text
      if (i > text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}
