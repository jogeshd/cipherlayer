"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Lock, Copy, Check, ShieldCheck, Zap } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-black pt-150 pb-200 px-6 overflow-x-hidden">
      <div className="max-w-[980px] mx-auto space-y-150">
        
        {/* Header Reveal */}
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <h1 className="apple-h1">Encrypt.</h1>
            <p className="apple-body text-2xl font-medium tracking-tight">Step 01: Protocol Initialization.</p>
          </motion.div>
        </header>

        {/* Pro Form Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div className="space-y-4">
               <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-apple-grey ml-1">Secure Destination</label>
               <select 
                 className="apple-input-pro appearance-none bg-[#1D1D1F] border border-white/5 rounded-apple px-6 py-4 w-full"
                 onChange={(e) => setSelectedContact(contacts.find(c => c.id === e.target.value) || null)}
                 value={selectedContact?.id || ""}
               >
                 <option value="" disabled>Select secure source...</option>
                 {contacts.map(c => (
                   <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </select>
            </div>

            <div className="space-y-4">
               <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-apple-grey ml-1">Plaintext Message</label>
               <textarea
                 className="apple-input-pro min-h-[400px] resize-none text-[21px] leading-[1.45] bg-[#1D1D1F] border border-white/5 rounded-apple px-8 py-8"
                 placeholder="Type your message here..."
                 value={plaintext}
                 onChange={(e) => setPlaintext(e.target.value)}
               />
            </div>

            <div className="flex flex-col gap-6">
              <button 
                onClick={handleEncrypt}
                disabled={!plaintext || !selectedContact || isEncrypting}
                className="apple-button-blue w-full py-5 text-xl font-bold rounded-apple disabled:opacity-20"
              >
                {isEncrypting ? "Running PolyShield..." : "Seal Payload"}
              </button>
              <DecoyGenerator />
            </div>
          </div>

          {/* Side Preview (Apple Style) */}
          <div className="relative lg:sticky lg:top-40">
            <AnimatePresence mode="wait">
              {ciphertext ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="apple-bento-card bg-white/[0.03] space-y-8"
                >
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Generated Cipher</h3>
                  <div className="break-all font-mono text-[13px] leading-relaxed text-apple-grey overflow-y-auto max-h-[300px]">
                    {ciphertext}
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(ciphertext)}
                    className="apple-button-blue w-full justify-center gap-2"
                  >
                    <Copy size={18} /> Copy Cipher
                  </button>
                </motion.div>
              ) : (
                <div className="h-[600px] rounded-apple-pro border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-4">
                  <Lock size={60} className="text-white/5" />
                  <p className="apple-body">Encryption results will appear here after sealing.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </div>
  );
}
