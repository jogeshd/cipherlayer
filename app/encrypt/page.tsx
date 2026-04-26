"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Copy, Check, ShieldCheck, ChevronDown } from "lucide-react";
import { encryptMessage } from "@/lib/crypto/poly-shield";
import { getContacts, Contact } from "@/lib/store/db";
import DecoyGenerator from "@/components/ai/DecoyGenerator";

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
    await new Promise(r => setTimeout(r, 1000));
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

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-20">
      <header className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold tracking-tight"
        >
          Seal your data.
        </motion.h1>
        <p className="text-apple-grey text-xl font-medium">Step 01: Data Encryption Protocol</p>
      </header>

      <div className="space-y-12">
        {/* Recipient */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-apple-grey ml-1">Recipient</label>
          <div className="relative">
            <select 
              className="apple-input appearance-none cursor-pointer"
              onChange={(e) => setSelectedContact(contacts.find(c => c.id === e.target.value) || null)}
              value={selectedContact?.id || ""}
            >
              <option value="" disabled>Choose a secure contact...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-apple-grey pointer-events-none" size={20} />
          </div>
        </div>

        {/* Plaintext */}
        <div className="space-y-4">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-semibold text-apple-grey">Plaintext Message</label>
            <span className="text-[12px] font-medium text-apple-grey">{plaintext.length} / 500</span>
          </div>
          <textarea
            className="apple-input min-h-[250px] resize-none text-xl leading-relaxed"
            placeholder="Type your message..."
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center gap-8">
          <button 
            onClick={handleEncrypt}
            disabled={!plaintext || !selectedContact || isEncrypting}
            className={`w-full py-5 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 ${(!plaintext || !selectedContact) ? 'bg-white/5 text-white/20' : 'bg-white text-black hover:bg-white/90'}`}
          >
            {isEncrypting ? "Encrypting..." : "Generate Cipher"}
          </button>

          <DecoyGenerator />
        </div>

        {/* Result */}
        <AnimatePresence>
          {ciphertext && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-10"
            >
              <div className="apple-card bg-white/5 border border-white/5 overflow-hidden group">
                <div className="break-all font-mono text-sm text-primary leading-relaxed opacity-80">
                  {ciphertext}
                </div>
              </div>
              
              <button 
                onClick={handleCopy}
                className="w-full py-4 border border-white/10 rounded-full flex items-center justify-center gap-2 font-semibold hover:bg-white/5 transition-all"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                {copied ? "Copied" : "Copy Cipher"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
