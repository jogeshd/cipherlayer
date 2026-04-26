"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Scan, ShieldCheck, ArrowRight, User, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";
import { Html5QrcodeScanner } from "html5-qrcode";
import { 
  generateKeyPair, 
  exportPublicKey, 
  importPublicKey, 
  deriveSharedSecret,
  KeyPair 
} from "@/lib/crypto/key-exchange";
import { saveContact } from "@/lib/store/db";

export default function KeyExchangePage() {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"show" | "scan" | null>(null);
  const [myKeys, setMyKeys] = useState<KeyPair | null>(null);
  const [qrData, setQrData] = useState("");
  const [nickname, setNickname] = useState("");
  const [success, setSuccess] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Generate my keys on mount
    generateKeyPair().then(setMyKeys);
  }, []);

  const handleShowQR = async () => {
    if (!myKeys) return;
    const pubKeyStr = await exportPublicKey(myKeys.publicKey);
    const url = await QRCode.toDataURL(pubKeyStr);
    setQrData(url);
    setMode("show");
  };

  const handleStartScan = () => {
    setMode("scan");
    // Small delay to ensure container is rendered
    setTimeout(() => {
      scannerRef.current = new Html5QrcodeScanner("scanner-container", { fps: 10, qrbox: 250 }, false);
      scannerRef.current.render(onScanSuccess, onScanError);
    }, 100);
  };

  const onScanSuccess = async (decodedText: string) => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    if (!myKeys) return;

    try {
      const theirPubKey = await importPublicKey(decodedText);
      const sharedSecret = await deriveSharedSecret(myKeys.privateKey, theirPubKey);
      
      // Save to database
      await saveContact({
        id: crypto.randomUUID(),
        name: nickname || "New Contact",
        sharedSecret: sharedSecret,
        addedAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      setSuccess(true);
      setStep(3);
    } catch (err) {
      alert("Invalid QR code or key format.");
      setMode(null);
    }
  };

  const onScanError = (err: any) => {
    // Console error suppressed for better UX unless critical
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-mono uppercase tracking-[0.2em]">Secure Handshake</h1>
        <div className="flex justify-center gap-4">
          <StepDot active={step >= 1} />
          <StepDot active={step >= 2} />
          <StepDot active={step >= 3} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="glass p-8 space-y-6 text-center">
              <User size={48} className="mx-auto text-primary mb-4" />
              <div className="space-y-2">
                <h2 className="text-xl font-mono uppercase tracking-widest">Identify Yourself</h2>
                <p className="text-muted text-sm">Enter a nickname for your recipient to see.</p>
              </div>
              <input 
                type="text" 
                placeholder="Ex: GhostRunner" 
                className="cyber-input text-center text-xl font-mono"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <button 
                onClick={() => setStep(2)}
                disabled={!nickname}
                className="w-full cyber-button flex items-center justify-center gap-2"
              >
                Proceed <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {!mode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  onClick={handleShowQR}
                  className="glass p-8 hover:border-primary/50 transition-all space-y-4 group"
                >
                  <QrCode size={48} className="mx-auto text-primary group-hover:scale-110 transition-transform" />
                  <div className="font-mono uppercase text-sm tracking-widest">My QR Code</div>
                </button>
                <button 
                  onClick={handleStartScan}
                  className="glass p-8 hover:border-secondary/50 transition-all space-y-4 group"
                >
                  <Scan size={48} className="mx-auto text-secondary group-hover:scale-110 transition-transform" />
                  <div className="font-mono uppercase text-sm tracking-widest">Scan Theirs</div>
                </button>
              </div>
            ) : mode === "show" ? (
              <div className="glass p-8 text-center space-y-8">
                <h3 className="font-mono uppercase tracking-widest text-sm">Show this to {nickname}</h3>
                <div className="bg-white p-4 inline-block rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  <img src={qrData} alt="My Public Key QR" className="w-64 h-64" />
                </div>
                <p className="text-xs text-muted font-mono leading-relaxed px-12">
                  Once they scan this, they will have established their end of the secure channel.
                </p>
                <button onClick={() => setMode(null)} className="text-muted font-mono text-[10px] uppercase underline">Cancel</button>
              </div>
            ) : (
              <div className="glass p-8 text-center space-y-6">
                <h3 className="font-mono uppercase tracking-widest text-sm">Scanning for {nickname}&apos;s key...</h3>
                <div id="scanner-container" className="overflow-hidden rounded-xl bg-black border border-white/5 aspect-square" />
                <button onClick={() => setMode(null)} className="text-muted font-mono text-[10px] uppercase underline">Cancel Camera</button>
              </div>
            )}

            <div className="glass p-4 bg-primary/5 flex gap-4 items-center">
              <AlertCircle className="text-primary shrink-0" size={20} />
              <p className="text-[10px] font-mono leading-relaxed">
                <span className="text-primary font-bold">PRO-TIP:</span> Key exchange is a one-time event. Both parties should ideally scan each other to ensure bidirectional security.
              </p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-12 text-center space-y-8 border-green-500/30"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <Check size={40} className="text-green-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-mono uppercase tracking-[0.2em] text-green-500">Channel Established</h2>
              <p className="text-muted text-sm">Shared secret derived and stored in Vault.</p>
            </div>
            <Link href="/vault" className="cyber-button w-full block">
              View In Vault
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepDot({ active }: { active: boolean }) {
  return (
    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${active ? 'bg-primary shadow-[0_0_10px_rgba(0,240,255,1)]' : 'bg-white/10'}`} />
  );
}
