import { Sidebar } from "@/components/layout/sidebar";
import { AiSidebar } from "@/components/layout/ai-sidebar";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {children}
      </main>
      <AiSidebar />
    </div>
  );
}
