"use client";

import { useState, useMemo } from "react";
import { User, Shield, Palette, Sparkles, CreditCard, Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserClient } from "@supabase/ssr";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [localName, setLocalName] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const queryClient = useQueryClient();
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      return { ...data, email: user.email };
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (newName: string) => {
      if (!profile?.id) throw new Error("No profile");
      const { error } = await supabase.from('users').update({ full_name: newName }).eq('id', profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  });

  const handleSaveProfile = () => {
    if (localName !== null) {
      updateProfileMutation.mutate(localName);
    }
  };

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Account", icon: Shield },
    { name: "Appearance", icon: Palette },
    { name: "AI Preferences", icon: Sparkles },
    { name: "Billing", icon: CreditCard },
    { name: "Data & Export", icon: Download },
  ];

  const currentName = localName !== null ? localName : (profile?.full_name || "");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-8 max-w-5xl mx-auto w-full"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left ${
                activeTab === tab.name 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </aside>

        <main className="flex-1 min-w-0 border border-border rounded-xl bg-card p-6 md:p-8">
          {activeTab === "Profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
              
              <div className="flex items-center gap-6 pb-6 border-b border-border">
                {isLoading ? (
                  <Skeleton className="w-20 h-20 rounded-full" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-semibold text-muted-foreground uppercase">
                    {profile?.full_name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <Button variant="outline" className="mb-2">Upload Avatar</Button>
                  <p className="text-sm text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input 
                        value={currentName} 
                        onChange={(e) => setLocalName(e.target.value)}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input value={profile?.email || ""} disabled />
                  )}
                </div>
                <div className="pt-4 flex items-center gap-4">
                  <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending || isLoading}>
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  {saveSuccess && (
                    <span className="text-sm text-primary flex items-center gap-1.5 transition-opacity">
                        <CheckCircle2 className="w-4 h-4" /> Profile updated
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Appearance" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Theme</h3>
                  <p className="text-sm text-muted-foreground mb-4">Nova Notes is currently in Dark Mode by default for the premium experience.</p>
                  <div className="flex gap-4">
                    <div className="border-2 border-primary rounded-xl p-1 cursor-pointer">
                      <div className="w-32 h-24 bg-[#0a0a0a] rounded-lg border border-[#262626] flex items-center justify-center">
                        <span className="text-[#00f0ff] font-medium text-sm">Dark (Active)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "AI Preferences" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6">AI Preferences</h2>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Model</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>Gemini 1.5 Flash (Fastest)</option>
                    <option disabled>Gemini 1.5 Pro (Coming soon)</option>
                  </select>
                </div>
                <div className="space-y-2 pt-4">
                  <label className="text-sm font-medium">Default Tone</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Concise</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs omitted for brevity */}
          {["Account", "Billing", "Data & Export"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-1">{activeTab}</h3>
              <p className="text-sm text-muted-foreground/60 max-w-sm">This feature is coming soon in the next update.</p>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
