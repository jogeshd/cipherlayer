"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Vault, UserPlus, MessageSquare, Trash2, Shield, Calendar, Search } from "lucide-react";
import Link from "next/link";
import { getContacts, deleteContact, Contact } from "@/lib/store/db";

export default function VaultPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refreshContacts();
  }, []);

  const refreshContacts = async () => {
    const list = await getContacts();
    setContacts(list);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this contact? This will wipe the shared secret.")) {
      await deleteContact(id);
      refreshContacts();
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 glass-cyan border-primary/30 flex items-center justify-center">
            <Vault size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-mono uppercase tracking-widest">Contact Vault</h1>
            <p className="text-xs text-muted font-mono">SECURE KEY REPOSITORY // {contacts.length} ACTIVE CHANNELS</p>
          </div>
        </div>
        
        <Link href="/exchange" className="cyber-button flex items-center gap-2 text-xs">
          <UserPlus size={16} />
          Establish New Link
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input 
          type="text" 
          placeholder="Search encrypted channels..." 
          className="cyber-input pl-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact, i) => (
          <ContactCard 
            key={contact.id} 
            contact={contact} 
            index={i} 
            onDelete={() => handleDelete(contact.id)}
          />
        ))}

        {filteredContacts.length === 0 && (
          <div className="col-span-full py-20 text-center glass border-dashed border-white/10">
            <Shield size={48} className="mx-auto text-muted mb-4 opacity-20" />
            <p className="text-muted font-mono uppercase tracking-widest text-sm">No secure links found in vault.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactCard({ contact, index, onDelete }: { contact: Contact, index: number, onDelete: () => void }) {
  const isExpired = Date.now() > contact.expiresAt;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass p-6 space-y-6 relative group overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/5 font-mono text-xl text-primary uppercase">
            {contact.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-tight">{contact.name}</h3>
            <div className={`flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold ${isExpired ? 'text-danger' : 'text-green-500'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-danger shadow-[0_0_8px_#FF2D55]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} />
              {isExpired ? 'Expired' : 'Active Channel'}
            </div>
          </div>
        </div>
        <button 
          onClick={onDelete}
          className="p-2 text-muted hover:text-danger transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} /> Established
          </div>
          <span>{new Date(contact.addedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted">
          <div className="flex items-center gap-1.5">
            <Shield size={12} /> Key Expiry
          </div>
          <span className={isExpired ? 'text-danger' : 'text-foreground'}>
            {isExpired ? 'EXPIRED' : new Date(contact.expiresAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link 
          href={`/encrypt?recipient=${contact.id}`}
          className="flex-1 py-3 bg-white/5 hover:bg-primary/10 hover:text-primary border border-white/5 hover:border-primary/30 transition-all rounded-lg flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest"
        >
          <MessageSquare size={14} />
          Message
        </Link>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
        <div className="absolute top-0 right-0 w-[1px] h-4 bg-primary/30" />
        <div className="absolute top-0 right-0 w-4 h-[1px] bg-primary/30" />
      </div>
    </motion.div>
  );
}
