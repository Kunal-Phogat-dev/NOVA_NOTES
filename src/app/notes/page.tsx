"use client";

import { useState, useMemo, Suspense } from "react";
import { Search, Filter, Grid, List as ListIcon, MoreHorizontal, Folder, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

function NotesContent() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const activeWorkspace = searchParams.get("workspace");
  const activeFolder = searchParams.get("folder");

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  ), []);

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', activeWorkspace, activeFolder],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (activeWorkspace) {
        query = query.eq('workspace', activeWorkspace);
      }
      if (activeFolder) {
        query = query.eq('folder', activeFolder);
      }

      const { data } = await query;
      return data || [];
    }
  });

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

  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (!searchQuery.trim()) return notes;
    const lowerQuery = searchQuery.toLowerCase();
    return notes.filter((n: any) => 
        n.title.toLowerCase().includes(lowerQuery) || 
        JSON.stringify(n.content).toLowerCase().includes(lowerQuery)
    );
  }, [notes, searchQuery]);

  const pageTitle = activeFolder 
    ? `Folder: ${activeFolder}` 
    : activeWorkspace 
        ? `Workspace: ${activeWorkspace}` 
        : "All Notes";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-8 max-w-6xl mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">Manage and search your documents.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
                placeholder="Search notes..." 
                className="pl-9 bg-secondary/30 border-border" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 text-muted-foreground border-border">
            <Filter className="w-4 h-4" />
          </Button>
          <div className="border border-border rounded-md flex shrink-0 bg-secondary/30 p-0.5">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 h-8 ${view === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setView('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 h-8 ${view === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setView('list')}
            >
              <ListIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-xl border-border bg-card/50 text-muted-foreground">
            No notes found.
        </div>
      ) : view === 'grid' ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredNotes.map((note: any) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/notes/${note.id}`}>
                  <div className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] flex flex-col h-48 group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                        <Folder className="w-3 h-3" />
                        {note.folder || "Personal"}
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2 leading-tight">{note.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{extractExcerpt(note.content)}</p>
                    <div className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(note.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-secondary/30 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Folder</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Last Edited</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredNotes.map((note: any) => (
                <tr key={note.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/notes/${note.id}`} className="font-medium text-foreground hover:text-primary transition-colors block">
                      {note.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5" />
                      {note.folder || "Personal"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{new Date(note.updated_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default function AllNotesPage() {
    return (
        <Suspense fallback={<div className="flex-1 p-8" />}>
            <NotesContent />
        </Suspense>
    );
}
