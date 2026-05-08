"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Shield, Zap, Crown, CreditCard, Sparkles, Star, Cpu } from "lucide-react";
import { useState, useEffect } from "react";

// Add script type for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProModal({ isOpen, onClose }: ProModalProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert("Cyber-link to Razorpay not established. Please refresh the page.");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Create Order on Server
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 2000 }),
      });
      
      if (!res.ok) throw new Error("Secure Node Connection Failed");
      
      const order = await res.json();

      if (!order.id) throw new Error("Order signature invalid");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "CipherLayer Pro",
        description: "12-Month Elite Access",
        order_id: order.id,
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        handler: async function (response: any) {
          // Success Handler - Verify on server
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              localStorage.setItem("cipher_pro", "true");
              alert("AUTHENTICATION SUCCESS: Welcome to the Elite.");
              onClose();
              window.location.reload();
            } else {
              throw new Error("Verification failed");
            }
          } catch (error) {
            alert("SECURITY ALERT: Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User",
          email: "support@cipherlayer.io",
        },
        theme: {
          color: "#0071E3",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("GATEWAY ERROR: Handshake failed. Ensure your server is restarted.");
    } finally {
      // We don't set loading false here if rzp.open() is successful 
      // because the modal is open. We handle it in ondismiss.
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[1000px] glass-card overflow-hidden bg-black/60 border-primary/20 flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,113,227,0.3)]"
          >
            {/* Left Side: Features */}
            <div className="flex-1 p-16 bg-primary/5 space-y-12 border-r border-white/5 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-primary rounded-full blur-[100px]" />
               </div>

               <div className="flex items-center gap-4 text-primary relative z-10">
                  <Crown size={40} className="filter drop-shadow-[0_0_10px_#0071E3]" />
                  <span className="font-black tracking-[0.6em] text-[10px] uppercase">Elite Tier Protocol</span>
               </div>
               
               <h2 className="text-6xl font-black tracking-tight leading-none relative z-10">Upgrade to <br /><span className="text-primary">Pro.</span></h2>
               
               <div className="space-y-8 relative z-10">
                  <FeatureItem text="Unlimited PolyShield™ Encryption" />
                  <FeatureItem text="Hardware-Level Entropy Access" />
                  <FeatureItem text="Biometric Handshake Vault" />
                  <FeatureItem text="Advanced AI Privacy Assistant" />
                  <FeatureItem text="Zero-Latency Global Grid Nodes" />
               </div>

               <div className="pt-12 relative z-10">
                  <div className="flex items-center gap-4 text-apple-grey text-sm font-bold">
                     <Shield size={24} className="text-green-500" />
                     <span className="uppercase tracking-widest text-[10px]">Zero-Knowledge Payment Gateway</span>
                  </div>
               </div>
            </div>

            {/* Right Side: Checkout */}
            <div className="flex-1 p-16 flex flex-col justify-between items-center text-center space-y-16 relative">
               <div className="space-y-6">
                  <p className="text-apple-grey font-black uppercase tracking-[0.4em] text-xs">Annual Access</p>
                  <div className="flex items-end justify-center gap-3">
                     <span className="text-8xl font-black tracking-tighter">₹2,000</span>
                     <span className="text-2xl text-apple-grey font-bold pb-4">/yr</span>
                  </div>
                  <div className="flex justify-center">
                    <p className="text-green-500 font-black bg-green-500/10 px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.3em] border border-green-500/20">Elite Membership</p>
                  </div>
               </div>

               <div className="w-full space-y-8">
                  <button 
                    onClick={handlePayment}
                    disabled={loading}
                    className="apple-button-primary w-full py-8 text-2xl flex items-center justify-center gap-4 group relative overflow-hidden active:scale-95"
                  >
                     <span className="relative z-10 flex items-center gap-4">
                        {loading ? (
                           <>
                              <Cpu size={32} className="animate-spin" />
                              Verifying Node...
                           </>
                        ) : (
                           <>
                              Initialize Checkout <CreditCard size={32} />
                           </>
                        )}
                     </span>
                     <div className="absolute inset-0 bg-white/20 translate-x-[-150%] skew-x-12 animate-shimmer" />
                  </button>
                  <p className="text-apple-grey text-[10px] uppercase tracking-widest leading-relaxed opacity-50">
                    Encrypted via Razorpay SSL. <br />No data is stored on our servers.
                  </p>
               </div>

               <button 
                 onClick={onClose}
                 className="text-apple-grey hover:text-white font-black uppercase tracking-[0.4em] text-[10px] transition-colors"
               >
                  Decline Access
               </button>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 text-white/20 hover:text-white transition-colors z-50"
            >
               <X size={32} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-6 group">
       <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,113,227,0.2)]">
          <Check size={20} className="text-primary" />
       </div>
       <span className="text-2xl font-black text-white tracking-tight">{text}</span>
    </div>
  );
}
