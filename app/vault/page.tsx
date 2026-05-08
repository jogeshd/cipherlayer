"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Vault, UserPlus, Trash2, Key, ShieldCheck, Search } from "lucide-react";
import { getContacts, Contact, deleteContact } from "@/lib/store/db";

export default function VaultPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    refreshContacts();
  }, []);

  const refreshContacts = () => getContacts().then(setContacts);

  const handleDelete = async (id: string) => {
    if (confirm("Purge this handshake from the local vault?")) {
      await deleteContact(id);
      refreshContacts();
    }
  };

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black pt-40 pb-20 px-6 relative overflow-hidden">
      <div className="cipher-stream opacity-20" />
      
      <div className="max-w-[980px] mx-auto space-y-150 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="space-y-4">
             <h1 className="apple-h1">Vault.</h1>
             <p className="apple-body text-2xl">Secure handshakes and keys.</p>
          </div>
          <div className="relative w-full md:w-80">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-grey" size={18} />
             <input 
               className="apple-input-pro bg-[#1D1D1F] border border-white/5 pl-12"
               placeholder="Search vault..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {filtered.length > 0 ? filtered.map((c) => (
             <motion.div 
               key={c.id}
               whileHover={{ y: -5 }}
               className="apple-card-pro bg-[#1D1D1F]/40 p-10 flex flex-col justify-between group"
             >
                <div className="flex justify-between items-start">
                   <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                      <Key size={24} className="text-cyan-400" />
                   </div>
                   <ShieldCheck className="text-primary/20" size={40} />
                </div>
                <div className="mt-8 space-y-2">
                   <h3 className="text-2xl font-bold tracking-tight">{c.name}</h3>
                   <p className="text-[10px] font-mono text-apple-grey break-all uppercase tracking-widest">
                     Handshake: {Array.from(c.sharedSecret.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('')}...
                   </p>
                </div>
                <div className="mt-10 pt-10 border-t border-white/5 flex justify-between items-center">
                   <span className="text-[10px] font-bold text-apple-grey uppercase tracking-[0.2em]">Zero-Trust Local</span>
                   <button 
                     onClick={() => handleDelete(c.id)}
                     className="text-apple-grey hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
             </motion.div>
           )) : (
             <div className="md:col-span-2 h-[400px] rounded-apple-pro border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-4">
                <Vault size={60} className="text-white/5" />
                <p className="apple-body">The vault is empty. Establish a handshake to begin.</p>
             </div>
           )}
        </section>
      </div>
    </div>
  );
}
