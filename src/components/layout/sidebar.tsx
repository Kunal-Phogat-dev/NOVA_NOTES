"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Folder, Home, Settings, Search, FileText, Plus, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState, useMemo } from "react";
import { Suspense } from "react";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [profile, setProfile] = useState<{ id: string; full_name: string; plan: string; custom_workspaces: string[]; custom_folders: string[] } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isAddingWorkspace, setIsAddingWorkspace] = useState(false);
  
  const [newFolderName, setNewFolderName] = useState("");
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  
  const activeWorkspace = searchParams.get("workspace");
  const activeFolder = searchParams.get("folder");

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('id, full_name, plan, custom_workspaces, custom_folders').eq('id', user.id).single();
        if (data) {
            setProfile({
                ...data,
                custom_workspaces: data.custom_workspaces || [],
                custom_folders: data.custom_folders || []
            });
        }
      }
    };
    fetchProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleNewNote = async () => {
    if (isCreating) return;
    setIsCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setIsCreating(false);
        return;
    }

    const payload: any = { user_id: user.id, title: 'Untitled', content: {} };
    if (activeWorkspace) payload.workspace = activeWorkspace;
    if (activeFolder) payload.folder = activeFolder;

    const { data, error } = await supabase
      .from('notes')
      .insert([payload])
      .select('id')
      .single();

    setIsCreating(false);
    if (!error && data) {
      router.push(`/notes/${data.id}`);
    } else {
      console.error("Error creating note:", error);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim() || !profile) return;
    const updated = [...profile.custom_workspaces, newWorkspaceName.trim()];
    setProfile({ ...profile, custom_workspaces: updated });
    setIsAddingWorkspace(false);
    setNewWorkspaceName("");
    await supabase.from('users').update({ custom_workspaces: updated }).eq('id', profile.id);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !profile) return;
    const updated = [...profile.custom_folders, newFolderName.trim()];
    setProfile({ ...profile, custom_folders: updated });
    setIsAddingFolder(false);
    setNewFolderName("");
    await supabase.from('users').update({ custom_folders: updated }).eq('id', profile.id);
  };

  const getWorkspaceStyle = (name: string) => 
    `flex items-center gap-2 px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
        activeWorkspace === name 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
    }`;

  const getFolderStyle = (name: string) => 
    `flex items-center gap-2 px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors group ${
        activeFolder === name 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
    }`;

  return (
    <aside className="w-64 border-r border-border bg-secondary/20 h-screen flex flex-col hidden md:flex">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">N</span>
          </div>
          Nova Notes
        </div>
      </div>

      {/* Main Actions */}
      <div className="p-4 space-y-2">
        <Button className="w-full justify-start text-sm h-9" onClick={handleNewNote} disabled={isCreating}>
          <Plus className="mr-2 w-4 h-4" /> {isCreating ? "Creating..." : "New Note"}
        </Button>
        <Button variant="outline" className="w-full justify-start text-sm h-9 text-muted-foreground border-border bg-background" asChild>
          <Link href="/notes">
            <Search className="mr-2 w-4 h-4" /> Search <span className="ml-auto text-xs opacity-50">⌘K</span>
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        <div className="space-y-1">
          <Link href="/dashboard">
            <div className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${pathname === '/dashboard' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}>
              <Home className="w-4 h-4" /> Dashboard
            </div>
          </Link>
          <Link href="/notes">
            <div className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${pathname === '/notes' && !activeWorkspace && !activeFolder ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}>
              <FileText className="w-4 h-4" /> All Notes
            </div>
          </Link>
          <Link href="/settings">
            <div className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${pathname === '/settings' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}>
              <Settings className="w-4 h-4" /> Settings
            </div>
          </Link>
        </div>

        <div className="space-y-1">
          <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
            Workspaces
            <Plus className="w-3 h-3 hover:text-foreground cursor-pointer" onClick={() => setIsAddingWorkspace(true)} />
          </div>
          <Link href="/notes?workspace=Personal" className={getWorkspaceStyle("Personal")}>
            <div className="w-4 h-4 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center text-[10px]">P</div>
            Personal
          </Link>
          <Link href="/notes?workspace=Work" className={getWorkspaceStyle("Work")}>
            <div className="w-4 h-4 rounded bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px]">W</div>
            Work
          </Link>
          {profile?.custom_workspaces?.map((ws) => (
            <Link key={ws} href={`/notes?workspace=${ws}`} className={getWorkspaceStyle(ws)}>
                <div className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center text-[10px]">{ws.charAt(0).toUpperCase()}</div>
                {ws}
            </Link>
          ))}
          {isAddingWorkspace && (
            <form onSubmit={handleCreateWorkspace} className="px-3 py-1">
                <input 
                    autoFocus
                    type="text" 
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    onBlur={() => setIsAddingWorkspace(false)}
                    placeholder="Workspace name..."
                    className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary"
                />
            </form>
          )}
        </div>

        <div className="space-y-1">
          <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
            Folders
            <Plus className="w-3 h-3 hover:text-foreground cursor-pointer" onClick={() => setIsAddingFolder(true)} />
          </div>
          <Link href="/notes?folder=Ideas" className={getFolderStyle("Ideas")}>
            <Folder className={`w-4 h-4 transition-colors ${activeFolder === 'Ideas' ? 'text-primary' : 'group-hover:text-primary'}`} />
            Ideas
          </Link>
          <Link href="/notes?folder=Projects" className={getFolderStyle("Projects")}>
            <Folder className={`w-4 h-4 transition-colors ${activeFolder === 'Projects' ? 'text-primary' : 'group-hover:text-primary'}`} />
            Projects
          </Link>
          {profile?.custom_folders?.map((folder) => (
            <Link key={folder} href={`/notes?folder=${folder}`} className={getFolderStyle(folder)}>
                <Folder className={`w-4 h-4 transition-colors ${activeFolder === folder ? 'text-primary' : 'group-hover:text-primary'}`} />
                {folder}
            </Link>
          ))}
          {isAddingFolder && (
            <form onSubmit={handleCreateFolder} className="px-3 py-1">
                <input 
                    autoFocus
                    type="text" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onBlur={() => setIsAddingFolder(false)}
                    placeholder="Folder name..."
                    className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary"
                />
            </form>
          )}
        </div>
      </div>

      {/* Footer / User */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-sm">
              <div className="font-medium leading-none">{profile?.full_name || "User"}</div>
              <div className="text-xs text-muted-foreground mt-1 capitalize">{profile?.plan || "Free"} Plan</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

export function Sidebar() {
    return (
        <Suspense fallback={<div className="w-64 border-r border-border bg-secondary/20 h-screen hidden md:block" />}>
            <SidebarContent />
        </Suspense>
    );
}
