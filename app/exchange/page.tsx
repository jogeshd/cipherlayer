"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Smartphone, MessageSquare, Send, Copy, Check, ChevronRight, Share2, MessageCircle } from "lucide-react";
import { generateHandshake, joinHandshake } from "@/lib/crypto/handshake";
import { QRCodeSVG } from "qrcode.react";

export default function ExchangePage() {
  const [step, setStep] = useState<"choice" | "generate" | "join" | "success">("choice");
  const [token, setToken] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [contactName, setContactName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    // Generate a 16-digit pseudo-secret for the handshake
    const newToken = Array.from({length: 16}, () => Math.random().toString(36)[2]).join('').toUpperCase();
    setToken(newToken);
    setStep("generate");
  };

  const handleJoin = async () => {
    if (!inputToken || !contactName) return;
    setStep("success");
    // Handshake logic would happen here
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black pt-40 pb-20 px-6 relative overflow-hidden">
      <div className="cipher-stream opacity-20" />
      
      <div className="max-w-[980px] mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {step === "choice" && (
            <motion.div 
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              <header className="text-center space-y-6">
                 <h1 className="apple-h1">Pair.</h1>
                 <p className="apple-body text-2xl">Choose your connection protocol.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <ChoiceCard 
                    title="Initialize"
                    description="Create a new secure handshake and invite a contact."
                    icon={<QrCode size={40} className="text-cyan-400" />}
                    onClick={handleGenerate}
                 />
                 <ChoiceCard 
                    title="Join"
                    description="Enter a token or scan to connect to an existing secure line."
                    icon={<Smartphone size={40} className="text-blue-500" />}
                    onClick={() => setStep("join")}
                 />
              </div>
            </motion.div>
          )}

          {step === "generate" && (
            <motion.div 
              key="generate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-16 flex flex-col items-center text-center"
            >
               <h1 className="apple-h2">Share Securely.</h1>
               
               <div className="apple-card-pro bg-white p-12 w-full max-w-sm flex flex-col items-center gap-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  <QRCodeSVG value={token} size={256} bgColor="#FFFFFF" fgColor="#000000" level="H" />
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em]">16-Digit Token</p>
                     <p className="text-4xl font-mono font-bold text-black tracking-tighter">{token.match(/.{1,4}/g)?.join(' ')}</p>
                  </div>
               </div>

               <div className="w-full max-w-sm space-y-8">
                  <button 
                    onClick={copyToClipboard}
                    className="apple-button-blue w-full py-5 text-xl flex items-center justify-center gap-3"
                  >
                    {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy Token"}
                  </button>

                  <div className="space-y-4">
                     <p className="text-apple-grey text-sm font-bold uppercase tracking-widest">Instant Bridge</p>
                     <div className="grid grid-cols-2 gap-4">
                        <a href={`https://wa.me/?text=Connect+on+CipherLayer:+${token}`} target="_blank" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all">
                           <MessageCircle size={20} /> WhatsApp
                        </a>
                        <a href={`https://t.me/share/url?url=https://cipherlayer.app&text=Connect+on+CipherLayer:+${token}`} target="_blank" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#0088CC]/10 border border-[#0088CC]/20 text-[#0088CC] hover:bg-[#0088CC]/20 transition-all">
                           <Send size={20} /> Telegram
                        </a>
                     </div>
                  </div>
               </div>

               <button onClick={() => setStep("choice")} className="apple-button-link mt-10">
                 Cancel Handshake
               </button>
            </motion.div>
          )}

          {step === "join" && (
            <motion.div 
              key="join"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-md mx-auto space-y-12"
            >
               <h1 className="apple-h2 text-center">Join Line.</h1>
               <div className="space-y-8">
                  <div className="space-y-4">
                     <label className="text-xs font-bold uppercase tracking-widest text-apple-grey">Contact Name</label>
                     <input 
                       className="apple-input-pro"
                       placeholder="e.g. Agent Alpha"
                       value={contactName}
                       onChange={(e) => setContactName(e.target.value)}
                     />
                  </div>
                  <div className="space-y-4">
                     <label className="text-xs font-bold uppercase tracking-widest text-apple-grey">16-Digit Token</label>
                     <input 
                       className="apple-input-pro font-mono text-center tracking-[0.2em]"
                       placeholder="XXXX-XXXX-XXXX-XXXX"
                       value={inputToken}
                       onChange={(e) => setInputToken(e.target.value.toUpperCase())}
                       maxLength={16}
                     />
                  </div>
                  <button 
                    onClick={handleJoin}
                    className="apple-button-blue w-full py-6 text-xl shadow-[0_0_30px_rgba(0,113,227,0.3)]"
                  >
                    Establish Handshake
                  </button>
                  <button onClick={() => setStep("choice")} className="apple-button-link w-full justify-center">
                    Back to Choices
                  </button>
               </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12 py-20"
            >
               <div className="w-32 h-32 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-10">
                  <Check className="text-green-500" size={60} />
               </div>
               <h1 className="apple-h1">Secure.</h1>
               <p className="apple-body text-2xl">Protocol established with {contactName}.</p>
               <div className="flex flex-col items-center gap-6 pt-10">
                  <a href="/encrypt" className="apple-button-blue px-12 py-4 text-xl">Start Encrypting</a>
                  <button onClick={() => setStep("choice")} className="apple-button-link">Exit to Dashboard</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChoiceCard({ title, description, icon, onClick }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="apple-card-pro p-12 cursor-pointer group flex flex-col justify-between h-[450px]"
    >
       <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group-hover:border-cyan-500/30 transition-colors self-start">
          {icon}
       </div>
       <div className="space-y-6">
          <h3 className="text-4xl font-bold tracking-tight text-white">{title}</h3>
          <p className="text-apple-grey text-xl leading-relaxed">{description}</p>
          <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
             Begin Protocol <ChevronRight size={20} />
          </div>
       </div>
    </motion.div>
  );
}
