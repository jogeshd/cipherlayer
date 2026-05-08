"use client";

import { motion } from "framer-motion";
import { Shield, Smartphone, Bell, Trash2, Globe, Database, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-black pt-40 pb-20 px-6 relative overflow-hidden">
      <div className="cipher-stream opacity-20" />
      
      <div className="max-w-[980px] mx-auto space-y-24 relative z-10">
        <header className="space-y-4">
           <h1 className="apple-h1">Settings.</h1>
           <p className="apple-body text-2xl">Manage your local security profile.</p>
        </header>

        <section className="space-y-8">
           <SettingsGroup title="System">
              <SettingsItem 
                icon={<Smartphone size={20} className="text-blue-500" />}
                title="PWA Status"
                value="Installed"
              />
              <SettingsItem 
                icon={<Database size={20} className="text-cyan-400" />}
                title="Local Storage"
                value="IndexedDB (Encrypted)"
              />
           </SettingsGroup>

           <SettingsGroup title="Privacy">
              <SettingsItem 
                icon={<Shield size={20} className="text-green-500" />}
                title="PolyShield Version"
                value="V1.2.4 (Active)"
              />
              <SettingsItem 
                icon={<Globe size={20} className="text-purple-500" />}
                title="Cloud Connection"
                value="Disabled (Zero-Trust)"
              />
           </SettingsGroup>

           <div className="pt-20">
              <button className="w-full p-8 rounded-[32px] bg-red-500/5 border border-red-500/10 flex items-center justify-between group hover:bg-red-500/10 transition-all">
                 <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-red-500/10 text-red-500">
                       <Trash2 size={24} />
                    </div>
                    <div className="text-left">
                       <h3 className="text-xl font-bold text-white">Panic Wipe</h3>
                       <p className="text-apple-grey text-sm">Instantly purge all local keys and vaults.</p>
                    </div>
                 </div>
                 <ChevronRight className="text-red-500" />
              </button>
           </div>
        </section>
      </div>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
       <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-apple-grey ml-6">{title}</h2>
       <div className="apple-card-pro bg-[#1D1D1F]/40 p-2 space-y-1">
          {children}
       </div>
    </div>
  );
}

function SettingsItem({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
       <div className="flex items-center gap-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
             {icon}
          </div>
          <span className="text-lg font-medium text-white">{title}</span>
       </div>
       <div className="flex items-center gap-4 text-apple-grey">
          <span className="text-sm font-medium">{value}</span>
          <ChevronRight size={18} />
       </div>
    </div>
  );
}
