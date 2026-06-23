# Nova Notes 🚀

> "Write Less. Think More."

Nova Notes is a premium Notion-style notes app with a built-in Gemini AI assistant. It allows users to write, organize, and enhance their notes using intelligent AI commands — all in one seamless interface.

## 🌟 Features

- **Notion-style Blocks**: Flexible Tiptap editor with headings, lists, code blocks, and more.
- **AI Writing Assistant**: Generate, rewrite, or expand content inline with Gemini AI.
- **Smart Summarization**: Condense any note instantly.
- **AI Chat Sidebar**: Contextual chat that understands your entire note.
- **Powerful Organization**: Folders, Workspaces, and quick search.
- **Premium Dark UI**: Built with Tailwind CSS and Framer Motion for a butter-smooth experience.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Custom UI components
- **Editor**: Tiptap + ProseMirror
- **AI**: Google Gemini API (streaming)
- **Backend/Database**: Supabase (Auth + Postgres + Storage)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Getting Started

### 1. Clone & Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables
Rename the provided \`.env.local.example\` or update your \`.env.local\` file with the following keys:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

### 3. Setup Supabase
Create a project on [Supabase](https://supabase.com) and run the following SQL snippet in the SQL editor to set up the necessary tables:

\`\`\`sql
create table users (
  id uuid references auth.users not null primary key,
  email text unique,
  full_name text,
  avatar_url text,
  plan text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: Setup RLS policies for secure multi-tenancy before going to production.
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👨‍💻 Built By
**Kunal Phogat**
