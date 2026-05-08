"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Unlock, Copy, Check, Trash2, Clock, ShieldAlert, ClipboardPaste } from "lucide-react";
import { decryptMessage } from "@/lib/crypto/poly-shield";
import { getContacts, Contact } from "@/lib/store/db";

export default function DecryptPage() {
  const [ciphertext, setCiphertext] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    getContacts().then(setContacts);
  }, []);

  const handleSmartPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.length > 20) {
        setCiphertext(text);
      }
    } catch (err) {
      console.error("Clipboard access denied");
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !selectedContact) return;
    setIsDecrypting(true);
    await new Promise(r => setTimeout(r, 1500));
    try {
      const result = await decryptMessage(ciphertext, selectedContact.sharedSecret);
      setPlaintext(result);
    } catch (error) {
      alert("Decryption failed. Invalid handshake.");
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-40 pb-20 px-6 relative overflow-hidden">
      <div className="cipher-stream opacity-20" />
      
      <div className="max-w-[980px] mx-auto space-y-24 relative z-10">
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase">
            <Unlock size={14} /> Authorization Required
          </div>
          <h1 className="apple-h1 text-cyan-glow">Reveal.</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
               <label className="text-xs font-bold uppercase tracking-widest text-apple-grey ml-1">Secure Source</label>
               <select 
                 className="apple-input-pro bg-[#1D1D1F] border border-white/5"
                 onChange={(e) => setSelectedContact(contacts.find(c => c.id === e.target.value) || null)}
                 value={selectedContact?.id || ""}
               >
                 <option value="" disabled>Select sender...</option>
                 {contacts.map(c => (
                   <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </select>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center px-1">
                 <label className="text-xs font-bold uppercase tracking-widest text-apple-grey">Encrypted Cipher</label>
                 <button 
                  onClick={handleSmartPaste}
                  className="text-[10px] font-bold text-cyan-400 flex items-center gap-2 hover:opacity-70 transition-opacity"
                 >
                   <ClipboardPaste size={12} /> Smart-Paste
                 </button>
               </div>
               <textarea
                  className="apple-input-pro min-h-[300px] resize-none font-mono text-sm bg-[#1D1D1F] border border-white/5"
                  placeholder="Paste transport cipher or use Smart-Paste..."
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
               />
            </div>

            <button 
              onClick={handleDecrypt}
              disabled={!ciphertext || !selectedContact || isDecrypting}
              className="apple-button-blue w-full py-6 text-xl shadow-[0_0_30px_rgba(0,113,227,0.2)] disabled:opacity-20"
            >
              {isDecrypting ? "Scanning Cipher..." : "Decrypt Payload"}
            </button>
          </div>

          <div className="lg:col-span-5 relative">
            <AnimatePresence mode="wait">
              {plaintext ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="sticky top-40 space-y-8"
                >
                  <div className="apple-card-pro bg-gradient-to-br from-[#1D1D1F] to-black">
                     <div className="space-y-8">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Decrypted Message</h3>
                        </div>
                        <div className="text-2xl leading-relaxed font-medium">
                          {plaintext}
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => setPlaintext("")}
                    className="w-full py-4 rounded-full border border-red-500/20 text-red-500 font-bold hover:bg-red-500/5 transition-all"
                  >
                    Purge from Memory
                  </button>
                </motion.div>
              ) : (
                <div className="sticky top-40 h-[500px] rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-4">
                   <Clock className="text-white/5" size={80} />
                   <p className="apple-body">Results will appear after authorization.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
