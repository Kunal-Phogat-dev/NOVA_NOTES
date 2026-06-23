"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import { useAppStore } from '@/store/use-app-store';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, CheckSquare, Code, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function TiptapEditor({ 
  initialContent,
  onChange 
}: { 
  initialContent?: any;
  onChange?: (content: any) => void;
}) {
  const { setAiSidebarOpen, setCurrentNoteContext } = useAppStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type '/' for commands or start writing...",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight,
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-p:my-2 prose-headings:mb-3 prose-headings:mt-6 focus:outline-none max-w-none font-sans',
      },
    },
    onUpdate: ({ editor }) => {
      // Update global context for AI
      setCurrentNoteContext(editor.getText());
      
      // Trigger onChange for autosaving
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
  });

  useEffect(() => {
    if (editor) {
      setCurrentNoteContext(editor.getText());
    }
  }, [editor, setCurrentNoteContext]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative min-h-[500px] flex flex-col gap-4">
      {editor && (
        <div className="flex bg-card border border-border shadow-sm rounded-md overflow-x-auto max-w-full sticky top-0 z-10 scrollbar-hide">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 hover:bg-secondary transition-colors ${editor.isActive('bold') ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 hover:bg-secondary transition-colors ${editor.isActive('italic') ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 hover:bg-secondary transition-colors ${editor.isActive('strike') ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <div className="w-px bg-border my-1 mx-1" />
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 hover:bg-secondary transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}>
            <Heading1 className="w-4 h-4" />
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 hover:bg-secondary transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}>
            <Heading2 className="w-4 h-4" />
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 hover:bg-secondary transition-colors ${editor.isActive('bulletList') ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 hover:bg-secondary transition-colors ${editor.isActive('orderedList') ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}>
            <ListOrdered className="w-4 h-4" />
          </button>
          <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-2 hover:bg-secondary transition-colors ${editor.isActive('taskList') ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}>
            <CheckSquare className="w-4 h-4" />
          </button>
          <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 hover:bg-secondary transition-colors ${editor.isActive('codeBlock') ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}>
            <Code className="w-4 h-4" />
          </button>
          <div className="w-px bg-border my-1 mx-1" />
          <button
            onClick={() => {
                setAiSidebarOpen(true);
            }}
            className="p-2 hover:bg-secondary transition-colors text-primary flex items-center gap-1 font-medium text-xs px-3"
          >
            <Sparkles className="w-3 h-3" />
            AI Enhance
          </button>
        </div>
      )}

      <EditorContent editor={editor} className="min-h-[500px]" />
      
      {/* Floating AI Button */}
      <Button 
        size="icon" 
        className="fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground lg:hidden z-50"
        onClick={() => setAiSidebarOpen(true)}
      >
        <Sparkles className="w-6 h-6" />
      </Button>
    </div>
  );
}
