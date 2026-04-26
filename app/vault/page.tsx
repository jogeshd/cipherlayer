"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, MessageSquare, Trash2, Search, ArrowRight } from "lucide-react";
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
    if (confirm("Delete this contact?")) {
      await deleteContact(id);
      refreshContacts();
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Vault.</h1>
          <p className="text-apple-grey text-xl font-medium">Your secure communication directory.</p>
        </div>
        <Link href="/exchange" className="apple-button-primary flex items-center gap-2">
          New Handshake <UserPlus size={18} />
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-apple-grey" size={20} />
        <input 
          type="text" 
          placeholder="Search contacts..." 
          className="apple-input pl-14"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredContacts.map((contact, i) => (
          <ContactCard 
            key={contact.id} 
            contact={contact} 
            index={i} 
            onDelete={() => handleDelete(contact.id)}
          />
        ))}

        {filteredContacts.length === 0 && (
          <div className="col-span-full py-40 text-center rounded-[40px] border border-dashed border-white/10">
            <p className="text-apple-grey text-lg">No secure links found in your vault.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactCard({ contact, index, onDelete }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="apple-card hover:bg-white/[0.06] group"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl font-bold">
          {contact.name.charAt(0)}
        </div>
        <button onClick={onDelete} className="text-apple-grey hover:text-white transition-colors">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-2 mb-10">
        <h3 className="text-2xl font-bold tracking-tight">{contact.name}</h3>
        <p className="text-apple-grey font-medium">Established {new Date(contact.addedAt).toLocaleDateString()}</p>
      </div>

      <Link 
        href={`/encrypt?recipient=${contact.id}`}
        className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all"
      >
        Message <ArrowRight size={20} />
      </Link>
    </motion.div>
  );
}
