"use client";

import { useAppStore } from "@/store/use-app-store";
import { Bot, FileText, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function DashboardPage() {
  const { toggleAiSidebar, isAiSidebarOpen } = useAppStore();
  const router = useRouter();

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const [profileRes, countRes, notesRes] = await Promise.all([
        supabase.from('users').select('full_name').eq('id', user.id).single(),
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('notes')
          .select('id, title, content, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(6)
      ]);

      return {
        profile: profileRes.data,
        totalNotes: countRes.count || 0,
        recentNotes: notesRes.data || []
      };
    }
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const extractExcerpt = (jsonbContent: any) => {
    if (!jsonbContent) return "Empty note...";
    try {
      const text = JSON.stringify(jsonbContent).replace(/<[^>]+>/g, '').replace(/[\{\}\[\]\"\:\,]/g, ' ').replace(/\s+/g, ' ').trim();
      if (text.length > 80) return text.substring(0, 80) + "...";
      if (text === "type doc content type paragraph") return "Empty note...";
      return text;
    } catch {
      return "Empty note...";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-8 max-w-6xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">
            {isLoading ? <Skeleton className="h-8 w-64 mb-2" /> : `${getGreeting()}, ${data?.profile?.full_name?.split(' ')[0] || 'User'}`}
          </h1>
          {!isLoading && <p className="text-muted-foreground">Here&apos;s what&apos;s happening in your workspace today.</p>}
        </div>
        {!isAiSidebarOpen && (
          <Button onClick={toggleAiSidebar} variant="outline" className="gap-2 text-primary border-primary/20 hover:bg-primary/10">
            <Bot className="w-4 h-4" />
            Open AI Assistant
          </Button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Total Notes</span>
          </div>
          <div className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-9 w-16" /> : data?.totalNotes}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Commands Used</span>
          </div>
          <div className="text-3xl font-bold">142</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Current Streak</span>
          </div>
          <div className="text-3xl font-bold">5 Days</div>
        </div>
      </div>

      {/* Recent Notes */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          Recently Edited
        </h2>
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
            </div>
        ) : data?.recentNotes?.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card/50">
                <p className="text-muted-foreground mb-4">You don't have any notes yet.</p>
                <Button onClick={() => {
                  supabase.auth.getUser().then(({data: userData}) => {
                    if (userData.user) {
                      supabase.from('notes').insert([{ user_id: userData.user.id, title: 'Untitled' }]).select('id').single().then(({data: newNote}) => {
                        if (newNote) router.push(`/notes/${newNote.id}`);
                      })
                    }
                  })
                }}>Create your first note</Button>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.recentNotes?.map((note: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => router.push(`/notes/${note.id}`)}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] flex flex-col h-40"
              >
                <h3 className="font-semibold mb-2 line-clamp-1">{note.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{extractExcerpt(note.content)}</p>
                <div className="text-xs text-muted-foreground mt-4">{new Date(note.updated_at).toLocaleDateString()}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
