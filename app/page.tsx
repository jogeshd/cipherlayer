"use client";

import { motion } from "framer-motion";
import { Shield, Zap, EyeOff, Lock, Check, Cpu } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-32 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto glass-cyan flex items-center justify-center mb-8">
            <Lock size={48} className="text-primary animate-pulse" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-4">
            Your words. <span className="text-primary">Their encryption.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Zero trust.</span>
          </h1>
          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto">
            WhatsApp sees gibberish. You see the truth. The world&apos;s first multi-algorithmic 
            encryption wrapper for any messaging platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 pt-8"
        >
          <Link href="/encrypt" className="cyber-button text-lg px-10">
            Start Encrypting — Free
          </Link>
          <Link href="#how-it-works" className="px-10 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-foreground uppercase font-mono tracking-widest text-sm">
            How It Works
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Cpu className="text-primary" />}
          title="PolyShield Engine"
          description="Every message uses one of 12 custom algorithms, auto-selected and derived independently."
        />
        <FeatureCard 
          icon={<Shield className="text-secondary" />}
          title="Zero Knowledge"
          description="We never store your keys. We never store your plaintext. We can't read your messages even if we wanted to."
        />
        <FeatureCard 
          icon={<EyeOff className="text-danger" />}
          title="Cipher Camouflage"
          description="Disguise your encrypted data as phone numbers, stock tickers, or innocent daily texts."
        />
      </section>

      {/* Comparison Table */}
      <section className="glass p-8 sm:p-12 overflow-x-auto">
        <h2 className="text-3xl font-mono mb-12 text-center uppercase tracking-widest">Comparison Matrix</h2>
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10 font-mono text-xs text-muted uppercase tracking-widest">
              <th className="pb-6">Feature</th>
              <th className="pb-6">WhatsApp</th>
              <th className="pb-6">Telegram</th>
              <th className="pb-6 text-primary">CipherLayer</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <ComparisonRow title="Multi-Algo Encryption" whatsapp={false} telegram={false} cipher={true} />
            <ComparisonRow title="Anti-Surveillance Patterns" whatsapp={false} telegram={false} cipher={true} />
            <ComparisonRow title="Zero-Trust Server Rule" whatsapp={false} telegram={false} cipher={true} />
            <ComparisonRow title="Auto-Delete Post-Read" whatsapp={true} telegram={true} cipher={true} />
            <ComparisonRow title="Decoy Generation (AI)" whatsapp={false} telegram={false} cipher={true} />
          </tbody>
        </table>
      </section>

      {/* Pricing */}
      <section className="text-center space-y-16">
        <h2 className="text-4xl font-mono uppercase tracking-widest">Select Your Clearance</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard 
            tier="Free" 
            price="$0" 
            features={["500 Char Limit", "12 PolyShield Algos", "Standard Key Exchange"]}
            buttonText="Get Started"
          />
          <PricingCard 
            tier="Pro" 
            price="$9" 
            popular
            features={["Unlimited Chars", "AI Decoy Messages", "Cipher Camouflage", "Priority AI Assistant"]}
            buttonText="Go Pro"
          />
          <PricingCard 
            tier="Team" 
            price="$29" 
            features={["Everything in Pro", "Shared Contact Vaults", "Panic Wipe API", "Advanced Auditing"]}
            buttonText="Contact Us"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-8 space-y-4 hover:border-primary/30 transition-all group"
    >
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-mono uppercase tracking-tight">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function ComparisonRow({ title, whatsapp, telegram, cipher }: { title: string, whatsapp: boolean, telegram: boolean, cipher: boolean }) {
  return (
    <tr className="border-b border-white/5">
      <td className="py-6 font-medium">{title}</td>
      <td className="py-6">{whatsapp ? <Check className="text-green-500" /> : <div className="w-5 h-px bg-white/20" />}</td>
      <td className="py-6">{telegram ? <Check className="text-green-500" /> : <div className="w-5 h-px bg-white/20" />}</td>
      <td className="py-6">{cipher ? <Check className="text-primary shadow-[0_0_10px_rgba(0,240,255,0.5)]" /> : <div className="w-5 h-px bg-white/20" />}</td>
    </tr>
  );
}

function PricingCard({ tier, price, features, buttonText, popular = false }: { tier: string, price: string, features: string[], buttonText: string, popular?: boolean }) {
  return (
    <div className={`glass p-8 space-y-8 flex flex-col ${popular ? 'border-primary/50 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative' : ''}`}>
      {popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</span>}
      <div className="space-y-2">
        <h3 className="font-mono text-xl uppercase tracking-widest">{tier}</h3>
        <div className="text-4xl font-bold">{price}<span className="text-sm font-normal text-muted">/mo</span></div>
      </div>
      <ul className="space-y-4 text-sm text-muted flex-1 text-left">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <Zap size={14} className="text-primary" /> {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-mono uppercase tracking-widest text-sm transition-all ${popular ? 'bg-primary text-black hover:bg-primary/80' : 'bg-white/5 hover:bg-white/10'}`}>
        {buttonText}
      </button>
    </div>
  );
}
