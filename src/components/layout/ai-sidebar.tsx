"use client";

import { useState } from "react";
import { useAppStore } from "@/store/use-app-store";
import { X, Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AiSidebar() {
  const { isAiSidebarOpen, toggleAiSidebar, currentNoteContext } = useAppStore();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hi! I'm your Nova AI assistant. I can help you summarize this note, expand your thoughts, or answer questions based on the current context." }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAiSidebarOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setPrompt("");
    setIsLoading(true);

    // Simulate network delay before showing inactive message
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { role: "ai", content: "AI features are currently inactive. Please provide a valid Gemini API Key to enable Nova AI." }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <aside className="w-[320px] border-l border-border bg-card h-screen flex flex-col hidden lg:flex shadow-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-primary">
          <Bot className="w-5 h-5" />
          Nova AI
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={toggleAiSidebar}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-secondary" : "bg-primary/20 text-primary"}`}>
              {msg.role === "user" ? <span className="text-xs">U</span> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className={`p-3 rounded-lg text-sm ${msg.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary/10 border border-primary/20 text-foreground"} max-w-[80%]`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-lg text-sm bg-primary/10 border border-primary/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-secondary/20">
        <form onSubmit={handleSubmit} className="relative">
          <Input 
            placeholder="Ask AI about this note..." 
            className="pr-10 bg-background border-border placeholder:text-muted-foreground/50"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
            disabled={!prompt.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="text-[10px] text-center text-muted-foreground mt-2">
          AI can make mistakes. Verify important information.
        </div>
      </div>
    </aside>
  );
}
