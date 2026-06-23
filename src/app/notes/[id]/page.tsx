"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Share, MoreHorizontal, CheckCircle2, Loader2 } from "lucide-react";
import { use, useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [title, setTitle] = useState<string | null>(null);
  const [content, setContent] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  ), []);

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    }
  });

  // Sync internal state with fetched data only on first load
  useEffect(() => {
    if (note && title === null) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note, title]);

  const updateNoteMutation = useMutation({
    mutationFn: async ({ newTitle, newContent }: { newTitle: string; newContent: any }) => {
      const { error } = await supabase
        .from('notes')
        .update({ title: newTitle, content: newContent, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate dashboard and notes lists so they show fresh data when we go back
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  // Debounced save
  useEffect(() => {
    if (title === null || isLoading) return; // Don't save before initial load
    const timeoutId = setTimeout(() => {
      updateNoteMutation.mutate({ newTitle: title, newContent: content });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [title, content]); // Excluding updateNoteMutation on purpose

  if (isLoading || title === null) {
    return (
      <div className="flex-1 flex flex-col w-full">
        <div className="h-14 border-b border-border flex items-center px-4 lg:px-8">
            <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 lg:p-12 pb-32">
                <Skeleton className="h-16 w-3/4 mb-8" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-5/6 mb-3" />
                <Skeleton className="h-4 w-4/6 mb-3" />
            </div>
        </div>
      </div>
    );
  }

  const isSaving = updateNoteMutation.isPending;
  const saveError = updateNoteMutation.isError;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col w-full"
    >
      {/* Top Bar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Personal
          </div>
          <span className="text-border">/</span>
          <div className="text-foreground font-medium truncate max-w-[200px]">{title || "Untitled"}</div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-1.5 mr-2">
            {isSaving ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
            ) : saveError ? (
                <span className="text-destructive">Error saving</span>
            ) : (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Saved to cloud</>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-2 hidden sm:flex">
            <Share className="w-4 h-4" /> Share
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 lg:p-12 pb-32">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="w-full text-4xl sm:text-5xl font-bold bg-transparent border-none outline-none mb-8 text-foreground placeholder:text-muted-foreground/50"
          />
          <TiptapEditor 
            initialContent={content} 
            onChange={(newContent) => setContent(newContent)} 
          />
        </div>
      </div>
    </motion.div>
  );
}
