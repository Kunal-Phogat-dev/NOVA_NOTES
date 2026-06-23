"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { AiSidebar } from "@/components/layout/ai-sidebar";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar mobileOpen={isMobileMenuOpen} setMobileOpen={setIsMobileMenuOpen} />
      
      <main className="flex-1 overflow-y-auto relative flex flex-col w-full max-w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-2 font-semibold">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">N</span>
              </div>
              Nova Notes
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
            </Button>
        </div>
        
        {children}
      </main>
      
      <AiSidebar />
    </div>
  );
}
