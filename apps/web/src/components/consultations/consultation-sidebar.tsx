"use client";

import { MessageSquare, FileText, Send, Paperclip, ClipboardList, PenTool, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "doctor" | "patient";
  text: string;
  time: string;
}

export function ConsultationSidebar({ isOpen }: { isOpen: boolean }) {
  const [activeTab, setActiveTab] = useState<"chat" | "notes">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "doctor", text: "Hello John, can you hear me clearly?", time: "09:30 AM" },
    { id: "2", sender: "patient", text: "Yes doctor, the connection is stable.", time: "09:31 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: "patient", text: newMessage, time: "09:35 AM" }]);
    setNewMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 bottom-0 w-[400px] bg-brand-black/40 backdrop-blur-3xl border-l border-white/10 flex flex-col z-[45]"
        >
          {/* 1. Sidebar Header (Tabs) */}
          <div className="p-6 border-b border-white/5">
            <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10 overflow-hidden relative">
              <motion.div 
                className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-brand-dark rounded-xl z-0"
                animate={{ x: activeTab === "chat" ? 0 : "100%" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
              <button 
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "relative z-10 flex-1 py-1.5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                  activeTab === "chat" ? "text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Live Chat
              </button>
              <button 
                onClick={() => setActiveTab("notes")}
                className={cn(
                  "relative z-10 flex-1 py-1.5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                  activeTab === "notes" ? "text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Session Notes
              </button>
            </div>
          </div>

          {/* 2. Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
            {activeTab === "chat" ? (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex flex-col", msg.sender === "patient" ? "items-end" : "items-start")}>
                    <div className={cn(
                      "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                      msg.sender === "patient" 
                        ? "bg-brand-dark text-white rounded-tr-none" 
                        : "bg-white/10 text-white border border-white/10 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 opacity-60">
                    <PenTool className="w-3.5 h-3.5 text-brand-light" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Auto-transcribing...</h4>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <p className="text-xs text-brand-light/80 font-medium leading-relaxed italic">
                      "Patient describes intermittent chest pain over the last 3 days. Pain is localized behind the sternum..."
                    </p>
                    <div className="h-px bg-white/10" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-bold text-white/70">Heart rate within normal range (72 bpm)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-bold text-white/70">Previous blood test reports reviewed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Input Area (Only for chat) */}
          {activeTab === "chat" && (
            <div className="p-6 border-t border-white/5">
              <div className="relative group/input">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full h-14 bg-white/5 rounded-2xl border border-white/10 pl-6 pr-14 text-sm font-medium focus:outline-none focus:border-brand-light/30 transition-all text-white placeholder:text-white/20 shadow-xl"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                   <button className="p-2 hover:bg-white/10 rounded-xl text-white/40 transition-colors">
                     <Paperclip className="w-5 h-5" />
                   </button>
                   <button 
                    onClick={handleSendMessage}
                    className="p-2 bg-brand-light/20 hover:bg-brand-light text-white rounded-xl transition-all shadow-lg shadow-brand-light/10"
                   >
                     <Send className="w-5 h-5" />
                   </button>
                </div>
              </div>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-4 text-center">Consultation End-to-End Encrypted</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
