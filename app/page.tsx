"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Shield, Zap, EyeOff, Lock, Check, Cpu, ArrowRight, Globe, Layers, ShieldCheck, ChevronRight, Fingerprint, Activity } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.2], [1, 0.95]), { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full bg-black selection:bg-primary selection:text-white">
      
      {/* 🌌 THE MOVING THEME: DYNAMIC MESH & GRAIN */}
      <div className="mesh-bg" />
      <div className="grain-overlay" />

      {/* 📱 ANDROID ANNOUNCEMENT */}
      <div className="relative z-[100] w-full bg-primary/20 backdrop-blur-md border-b border-primary/20 py-3 text-center">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase">
          New: <span className="text-white">CipherLayer for Android</span> is now available. 
          <a href="/downloads/cipherlayer.apk" download className="ml-4 text-primary hover:underline">Download APK →</a>
        </p>
      </div>

      {/* 🚀 THE HERO: ULTRA PREMIUM REVEAL */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div
          style={{ scale, opacity }}
          className="z-10 space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex items-center justify-center gap-3 mb-12"
          >
             <div className="h-[1px] w-12 bg-white/20" />
             <span className="text-primary tracking-[0.4em] text-xs font-bold uppercase">The Silicon Standard</span>
             <div className="h-[1px] w-12 bg-white/20" />
          </motion.div>

          <h1 className="apple-h1">
            Privacy. <br />
            <motion.span 
              initial={{ backgroundPosition: "-200% 0%" }}
              animate={{ backgroundPosition: "200% 0%" }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-white/20 via-white to-white/20 bg-[length:200%_100%]"
            >
              Reimagined.
            </motion.span>
          </h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col items-center gap-10 pt-12"
          >
            <p className="apple-body max-w-3xl">
              CipherLayer. Military-grade encryption wrapped in an experience that feels like magic. 
              Your data is now untouchable.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Link href="/encrypt" className="apple-button-primary group overflow-hidden relative">
                <span className="relative z-10 flex items-center gap-2">
                  Start Encrypting <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <a href="/downloads/cipherlayer.apk" download className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-8 py-5 rounded-full text-xl font-semibold flex items-center gap-3 transition-all">
                Download Android <Zap size={20} className="text-primary fill-primary" />
              </a>
              <Link href="/vault" className="text-white/60 hover:text-white font-semibold text-xl flex items-center gap-2 transition-colors">
                Explore Vault <ChevronRight size={24} />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Background Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </section>

      {/* 🛡️ THE REVEAL: INTERACTIVE PRODUCT DISPLAY */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-40">
        <RevealSection>
          <div className="relative glass-card aspect-[16/9] overflow-hidden group border-white/10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="w-full h-full"
            >
               <img 
                 src="/cipherlayer_hero_apple_style_1777201004291.png" 
                 alt="CipherLayer Interface" 
                 className="w-full h-full object-cover opacity-80"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
               
               {/* Interactive Overlay */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="flex gap-4">
                     <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">AES-256GCM</span>
                     <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">RSA-4096</span>
                     <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">SHA-3</span>
                  </div>
               </div>
            </motion.div>
          </div>
        </RevealSection>
      </section>

      {/* 🍱 THE BENTO GRID: REVOLUTIONARY UI */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-40">
        <h2 className="apple-h2 mb-20 text-center">Built for the <br /><span className="text-apple-grey">Next Decade.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           <BentoItem 
             className="md:col-span-8 bg-primary/5"
             title="PolyShield™ Core"
             description="Every packet is wrapped in 12 layers of shifting entropy. Pattern analysis is now impossible."
             icon={<Shield className="text-primary" size={40} />}
             image="/privacy_shield.png"
           />
           <BentoItem 
             className="md:col-span-4"
             title="Biometric Sync"
             description="Hardware-level handshake for key exchange."
             icon={<Fingerprint className="text-purple-400" size={40} />}
           />
           <BentoItem 
             className="md:col-span-4"
             title="Instant Wipe"
             description="Remote panic triggers for total purging."
             icon={<Zap className="text-yellow-400" size={40} />}
           />
           <BentoItem 
             className="md:col-span-8 bg-white/5"
             title="Global Grid"
             description="Decentralized encryption nodes across 140 countries for zero-latency secure handshakes."
             icon={<Globe className="text-blue-400" size={40} />}
             image="/cipherlayer_hero_apple_style_1777201004291.png"
           />
        </div>
      </section>

      {/* 📊 THE PERFORMANCE: REAL-TIME FEEL */}
      <section className="w-full py-40 px-6 overflow-hidden">
         <div className="max-w-[980px] mx-auto glass-card p-20 flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-6">
               <h3 className="text-4xl font-bold tracking-tight">Zero Lag. <br />Zero Compromise.</h3>
               <p className="apple-body">Our Rust-powered core processes encryption at 1.2GB/s without breaking a sweat.</p>
               <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                     <Activity size={16} className="text-green-500" />
                     <span className="text-sm font-bold text-green-500">SYSTEM OPTIMAL</span>
                  </div>
                  <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       whileInView={{ width: "98%" }}
                       transition={{ duration: 2 }}
                       className="h-full bg-green-500"
                     />
                  </div>
               </div>
            </div>
            <div className="flex-1 flex justify-center">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="relative w-60 h-60"
               >
                  <Cpu size={240} className="text-white/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Shield size={60} className="text-primary animate-pulse" />
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* 🎯 FINAL CALL TO ACTION */}
      <section className="w-full py-60 flex flex-col items-center justify-center text-center px-6">
        <RevealSection>
          <div className="space-y-16">
            <h2 className="text-[12vw] font-black tracking-tighter leading-none select-none opacity-20">CIPHERLAYER</h2>
            <div className="space-y-8">
               <h3 className="apple-h2">The wait is over.</h3>
               <Link href="/encrypt" className="apple-button-primary inline-block text-2xl px-16 py-6 shimmer">
                 Join the Elite
               </Link>
            </div>
          </div>
        </RevealSection>
      </section>

    </div>
  );
}

function RevealSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function BentoItem({ title, description, icon, image, className = "" }: any) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      className={`glass-card p-12 relative overflow-hidden group min-h-[400px] flex flex-col justify-between ${className}`}
    >
      <div className="relative z-10 space-y-6">
        <motion.div 
          animate={isHovered ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10"
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="text-3xl font-bold tracking-tight mb-4">{title}</h3>
          <p className="apple-body text-lg">{description}</p>
        </div>
      </div>
      
      {image && (
        <div className="absolute -bottom-10 -right-10 w-2/3 transition-transform duration-700 group-hover:scale-110 group-hover:-translate-x-4">
           <img src={image} alt={title} className="w-full h-full object-contain opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      <div className={`absolute -inset-24 bg-primary/20 blur-[80px] rounded-full transition-opacity duration-700 ${isHovered ? "opacity-40" : "opacity-0"}`} />
    </motion.div>
  );
}
