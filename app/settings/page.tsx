"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, ShieldAlert, Trash2, LogOut, Clock, Smartphone, CreditCard, ShieldCheck, User as UserIcon } from "lucide-react";
import { wipeAllData } from "@/lib/store/db";
import { auth } from "@/lib/firebase/config";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, type User } from "firebase/auth";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [panicStep, setPanicStep] = useState(0);
  const [autoDeleteTime, setAutoDeleteTime] = useState(15);
  const [wiped, setWiped] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleLogout = () => signOut(auth);

  const handlePanicWipe = async () => {
    if (panicStep === 0) {
      setPanicStep(1);
      setTimeout(() => setPanicStep(0), 3000); // Reset after 3s
      return;
    }
    
    await wipeAllData();
    setWiped(true);
    setTimeout(() => {
      setWiped(false);
      setPanicStep(0);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 glass border-white/10 flex items-center justify-center">
          <Settings size={24} className="text-muted" />
        </div>
        <div>
          <h1 className="text-2xl font-mono uppercase tracking-widest">Settings</h1>
          <p className="text-xs text-muted font-mono">SYSTEM CONFIGURATION // USER PREFERENCES</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Account Section */}
        <div className="glass p-8 space-y-6">
          <div className="flex items-center gap-3">
            <UserIcon className="text-primary" size={20} />
            <h2 className="font-mono uppercase tracking-widest text-sm">Identity & Sync</h2>
          </div>
          
          {user ? (
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="text-sm font-bold">{user.displayName}</div>
                  <div className="text-xs text-muted font-mono">{user.email}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="text-[10px] uppercase font-mono text-danger hover:underline">Sign Out</button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-muted leading-relaxed">
                Stay anonymous for local-only use, or sign in with Google to enable cloud vault backup (fully encrypted).
              </p>
              <button 
                onClick={handleLogin}
                className="w-full py-3 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="glass p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Clock className="text-primary" size={20} />
              <h2 className="font-mono uppercase tracking-widest text-sm">Auto-Delete Timer</h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[5, 15, 30, 60].map((t) => (
                <button
                  key={t}
                  onClick={() => setAutoDeleteTime(t)}
                  className={`py-3 font-mono text-xs rounded-lg border transition-all ${autoDeleteTime === t ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-white/5 border-white/5 text-muted hover:border-white/10'}`}
                >
                  {t} MIN
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <Smartphone className="text-primary" size={20} />
              <h2 className="font-mono uppercase tracking-widest text-sm">PWA Installation</h2>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              CipherLayer is a Progressive Web App. You can install it on your home screen or desktop via your browser settings for a native, zero-browser interface.
            </p>
          </div>
        </div>

        {/* Subscription */}
        <div className="glass p-8 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CreditCard className="text-primary" size={20} />
              <h2 className="font-mono uppercase tracking-widest text-sm">Plan: FREE CLEARANCE</h2>
            </div>
            <p className="text-[10px] font-mono text-muted">Upgrade for AI features & unlimited data.</p>
          </div>
          <button className="cyber-button text-[10px] py-2 px-6">Upgrade</button>
        </div>

        {/* Danger Zone */}
        <div className="p-8 border border-danger/20 bg-danger/5 rounded-xl space-y-6">
          <div className="flex items-center gap-3 text-danger">
            <ShieldAlert size={20} />
            <h2 className="font-mono uppercase tracking-widest text-sm">Panic Zone</h2>
          </div>
          <p className="text-xs text-muted">
            Immediately wipes all local contacts, keys, and decrypted data. This cannot be undone.
          </p>
          <button 
            onClick={handlePanicWipe}
            className={`w-full py-4 font-mono uppercase tracking-[0.2em] transition-all rounded-lg flex items-center justify-center gap-3 ${wiped ? 'bg-green-500 text-white' : panicStep === 1 ? 'bg-danger text-white' : 'bg-white/5 text-danger border border-danger/30 hover:bg-danger/10'}`}
          >
            {wiped ? (
              <>
                <ShieldCheck size={20} />
                ALL DATA WIPED
              </>
            ) : (
              <>
                <Trash2 size={20} />
                {panicStep === 1 ? "CONFIRM WIPE" : "🚨 PANIC WIPE"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
