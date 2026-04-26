"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, ShieldAlert, Trash2, Clock, Smartphone, CreditCard, ShieldCheck, User as UserIcon } from "lucide-react";
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
      setTimeout(() => setPanicStep(0), 3000);
      return;
    }
    await wipeAllData();
    setWiped(true);
    setTimeout(() => { setWiped(false); setPanicStep(0); }, 3000);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-20">
      <header className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Settings.</h1>
        <p className="text-apple-grey text-xl font-medium">Control your privacy environment.</p>
      </header>

      <div className="space-y-8">
        {/* Account Section */}
        <section className="apple-card bg-white/5 space-y-10">
          <div className="flex items-center gap-4">
            <UserIcon className="text-white" size={24} />
            <h2 className="text-2xl font-bold">Identity & Sync</h2>
          </div>
          
          {user ? (
            <div className="flex justify-between items-center bg-black/40 p-6 rounded-3xl">
              <div className="flex items-center gap-6">
                <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-14 h-14 rounded-full border border-white/10" />
                <div>
                  <div className="text-xl font-bold tracking-tight">{user.displayName}</div>
                  <div className="text-apple-grey font-medium">{user.email}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="text-primary font-bold hover:underline">Sign Out</button>
            </div>
          ) : (
            <div className="space-y-8">
              <p className="text-apple-grey text-lg max-w-xl">
                Link your Google account to enable encrypted cloud backups. Your keys never leave your possession.
              </p>
              <button 
                onClick={handleLogin}
                className="w-full py-5 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </section>

        {/* Preferences */}
        <section className="apple-card bg-white/5 space-y-10">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Clock className="text-white" size={24} />
              <h2 className="text-2xl font-bold">Auto-Delete Timer</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[5, 15, 30, 60].map((t) => (
                <button
                  key={t}
                  onClick={() => setAutoDeleteTime(t)}
                  className={`py-4 font-bold rounded-2xl border transition-all ${autoDeleteTime === t ? 'bg-white text-black border-white' : 'border-white/10 text-apple-grey hover:border-white/30'}`}
                >
                  {t} MIN
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="apple-card bg-red-500/5 border border-red-500/10 space-y-10">
          <div className="flex items-center gap-4 text-red-500">
            <ShieldAlert size={24} />
            <h2 className="text-2xl font-bold">Security Override</h2>
          </div>
          <p className="text-apple-grey text-lg">
            A panic wipe immediately purges all local data, including keys and contacts. This action is irreversible.
          </p>
          <button 
            onClick={handlePanicWipe}
            className={`w-full py-5 font-bold rounded-full transition-all ${wiped ? 'bg-green-500 text-white' : panicStep === 1 ? 'bg-red-500 text-white' : 'bg-white/5 text-red-500 border border-red-500/20 hover:bg-red-500/10'}`}
          >
            {wiped ? "DATA WIPED" : panicStep === 1 ? "CONFIRM PURGE" : "PANIC WIPE"}
          </button>
        </section>
      </div>
    </div>
  );
}
