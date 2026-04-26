"use client";

import { motion } from "framer-motion";
import { Shield, Zap, EyeOff, Lock, Check, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="z-10"
        >
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-4">Introducing CipherLayer</h2>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
            Unbreakable. <br />
            <span className="text-white/40">Untraceable.</span>
          </h1>
          <p className="text-apple-grey text-xl md:text-2xl max-w-3xl mx-auto font-medium mb-12">
            The world&apos;s most advanced encryption wrapper. <br className="hidden md:block" />
            Designed for those who demand absolute digital privacy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/encrypt" className="apple-button-primary text-lg">
              Start Encrypting
            </Link>
            <Link href="/exchange" className="apple-button-secondary text-lg flex items-center justify-center gap-2 group">
              Pair Device <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Hero Image / Asset */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-20 w-full max-w-5xl relative aspect-video rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
        >
          <img 
            src="/cipherlayer_hero_apple_style_1777201004291.png" 
            alt="CipherLayer Interface" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="w-full max-w-7xl px-6 py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BentoItem 
            className="md:col-span-2 md:row-span-2 bg-[#161617]"
            title="PolyShield™ Engine"
            subtitle="The architecture of silence."
            description="Our custom engine uses 12 unique cryptographic algorithms, independently derived for every single message. No two transmissions are alike."
            icon={<Cpu className="text-primary" size={32} />}
          />
          <BentoItem 
            className="bg-[#1d1d1f]"
            title="Zero Trust"
            subtitle="By design."
            description="We never see your keys. We never store your messages. Absolute privacy is not a feature; it's the foundation."
            icon={<Shield className="text-secondary" size={24} />}
          />
          <BentoItem 
            className="bg-[#1d1d1f]"
            title="Stealth"
            subtitle="Hidden in plain sight."
            description="Disguise your data using AI-generated decoys that look like everyday conversations."
            icon={<EyeOff className="text-danger" size={24} />}
          />
          <BentoItem 
            className="md:col-span-2 bg-gradient-to-br from-primary/10 to-transparent"
            title="PWA Experience"
            subtitle="Native power, web speed."
            description="Install CipherLayer on any device. Offline-ready, lightning fast, and browser-independent."
            icon={<Zap size={24} className="text-white" />}
          />
        </div>
      </section>

      {/* Comparison Section (Apple style clean) */}
      <section className="w-full bg-[#f5f5f7] py-40 text-black px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-20 text-center">Beyond the standard.</h2>
          <div className="space-y-12">
            <ComparisonPoint title="Algorithmic Diversity" value="12 Algos" />
            <ComparisonPoint title="Server Access" value="Zero Knowledge" />
            <ComparisonPoint title="Key Storage" value="Local-Only (IndexedDB)" />
            <ComparisonPoint title="Transport" value="Universal Wrapper" />
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="w-full py-60 text-center px-6">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-12">Ready to vanish?</h2>
        <Link href="/encrypt" className="apple-button-primary text-2xl px-16 py-6">
          Get Started — Free
        </Link>
      </section>
    </div>
  );
}

function BentoItem({ title, subtitle, description, icon, className = "" }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className={`rounded-[30px] p-10 flex flex-col justify-between overflow-hidden group transition-all duration-500 ${className}`}
    >
      <div className="space-y-4">
        {icon}
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">{title}</h3>
          <p className="text-apple-grey text-lg font-medium">{subtitle}</p>
        </div>
      </div>
      <p className="text-apple-grey mt-12 text-lg leading-relaxed max-w-sm">
        {description}
      </p>
    </motion.div>
  );
}

function ComparisonPoint({ title, value }: { title: string, value: string }) {
  return (
    <div className="flex justify-between items-end border-b border-black/10 pb-6">
      <span className="text-2xl font-semibold tracking-tight">{title}</span>
      <span className="text-2xl text-primary font-bold">{value}</span>
    </div>
  );
}
