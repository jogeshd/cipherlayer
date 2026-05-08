"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot", text: string }[]>([
    { role: "bot", text: "Hello! I'm your privacy assistant. How can I help you secure your communications today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg,
          systemInstruction: "You are a friendly privacy assistant for CipherLayer app. Keep answers under 3 sentences. Be reassuring but honest about security."
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 glass-cyan z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-primary/5">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-primary" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">Privacy Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="h-80 overflow-y-auto p-4 space-y-4 font-sans scrollbar-hide"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary/20 text-foreground rounded-br-none' : 'bg-white/5 text-muted rounded-bl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-lg rounded-bl-none">
                    <Sparkles size={14} className="animate-pulse text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask anything..." 
                className="flex-1 bg-black/40 border border-white/5 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary text-black rounded hover:bg-primary/80 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
