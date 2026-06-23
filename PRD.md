# Nova Notes PRD

**Product Name:** Nova Notes  
**Tagline:** The smartest Notion-style notes app with built-in AI assistant.  
**Version:** 1.0  
**Date:** June 23, 2026  
**Author:** Grok (assisting Kunal Phogat)  

## 1. Product Vision

Nova Notes is a premium dark-themed productivity app that combines Notion-style note-taking with a powerful built-in Gemini AI assistant. Users can write, organize, and enhance their notes using AI commands — all in one seamless interface.

**Core Value Proposition:**  
Write Less. Think More.  
Nova Notes acts as your intelligent second brain — capturing raw thoughts and transforming them into polished, actionable content through intuitive AI assistance.

**Key Differentiators:**
- Deeply integrated Gemini AI that understands context from your notes.
- Notion-like block editor with superior AI capabilities.
- Premium Mac-inspired dark UI focused on focus and speed.
- Real-time streaming AI responses directly in the editor.
- Smart organization with workspaces, folders, and AI-powered insights.

## 2. Design Reference & Brand Guidelines

### Visual Identity
- **Primary Background:** `#0a0a0a` (deep dark)
- **Accent Color:** `#00f0ff` (vibrant cyan)
- **Text:** Light grays and whites for excellent contrast
- **Secondary Accents:** Subtle neon gradients, soft glows on interactive elements
- **Theme:** Premium dark mode only (with optional light mode in settings)
- **Aesthetic:** Clean, minimal, inspired by Notion, Linear, Craft, Reflect, and macOS apps
- **Typography:** Inter or SF Pro for UI; system fonts for editor content
- **Animations:** Smooth with Framer Motion — subtle fades, scale transitions, and typing indicators

### UI/UX Principles
- Keyboard-first experience (heavy use of Cmd/Ctrl shortcuts)
- Floating command palettes and contextual toolbars
- Responsive design prioritizing desktop with excellent mobile support
- Consistent cyan highlights for all primary actions
- Generous whitespace and focus on content

## 3. User Personas

### 1. Indie Developer / Builder (Primary)
- **Name:** Alex Rivera, 28, Freelance Full-stack Developer
- **Goals:** Document project specs, architecture decisions, feature roadmaps; generate code snippets and requirements from ideas.
- **Pain Points:** Switching between Notion + ChatGPT; disorganized notes; time wasted on formatting.
- **Usage:** Daily note-taking during building sessions; AI for turning bullet points into detailed specs.

### 2. Content Creator
- **Name:** Maya Chen, 32, YouTuber & Blogger
- **Goals:** Draft scripts, blog posts, social threads; brainstorm ideas; summarize research.
- **Pain Points:** Writer's block; repetitive editing; organizing content ideas.
- **Usage:** Heavy AI use for expansion, rewriting, and generating outlines.

### 3. Student / Researcher
- **Name:** Jordan Patel, 21, Computer Science PhD Student
- **Goals:** Lecture notes, literature reviews, research synthesis.
- **Pain Points:** Long unstructured notes; difficulty extracting insights; needing quick summaries before exams.
- **Usage:** Folder hierarchies for courses/projects; AI summarization and key point extraction.

## 4. Pages & Features — Full Detail

### PAGE 1: LANDING PAGE (Public)

#### Hero Section
- Massive centered headline: **"Write Less. Think More."**
- Subheadline: "The AI-powered notes app that thinks with you. Summarize, generate, and organize — all in one place."
- Prominent CTA buttons:
  - Primary: **"Start for Free"** (cyan, leads to /auth)
  - Secondary: **"See it in Action"** (scrolls to demo or opens modal video)
- Animated hero: Live demo of editor with AI streaming text in real-time (using Framer Motion or Lottie)
- Background: Dark gradient mesh with subtle floating particles or geometric patterns

#### Features Section (6 Cards in 2x3 grid, responsive)
1. **AI Writing Assistant**  
   Generate, rewrite, or expand content inline with one click.
2. **Smart Summarization**  
   Condense any note or selection instantly.
3. **Notion-style Blocks**  
   Flexible blocks: headings, todos, code, embeds, and more.
4. **AI Chat Sidebar**  
   Contextual chat that understands your entire note.
5. **Powerful Organization**  
   Workspaces, nested folders, tags, and search.
6. **Lightning Fast**  
   Built with Next.js for instant load times and smooth editing.

#### How It Works (3-step horizontal timeline with illustrations)
1. **Capture Ideas** — Jot down rough thoughts in the beautiful editor.
2. **Invoke AI** — Use commands, palette, or chat to enhance.
3. **Organize & Share** — Structure with folders, export polished docs.

#### Pricing Section
**Free Plan**
- 10 notes
- Basic AI (5 requests/day)
- 1 workspace
- Community support

**Pro Plan — $12/month or $120/year (20% discount)**
- Unlimited notes & AI usage
- Multiple workspaces & advanced folders
- Priority support & early features
- PDF/Markdown/JSON export
- Custom AI personas (future)

**Comparison Table** including feature checkboxes.

#### Social Proof
- 3 realistic testimonials with avatars, names, and quotes matching personas.
- Trust signals: "Trusted by indie hackers and creators"
- Stats row: "10,000+ notes created", "500+ active users", "4.9/5 from 120 reviews"

#### Footer
- Logo + tagline
- Navigation links (Product, Pricing, Blog, etc.)
- Legal: Privacy, Terms
- Copyright © 2026 Nova Notes. Built with ❤️

### PAGE 2: AUTH PAGE

**Layout:** Split screen (50/50 on desktop)
- **Left:** Beautiful app screenshot or looping animation with tagline "Your second brain, powered by AI."
- **Right:** Form card with glassmorphic effect.

**Sign In Form:**
- Email
- Password
- "Sign In" (cyan button)
- Forgot password
- Google OAuth button
- Link to Register

**Register Form:** Similar, with Full Name, Email, Password, Confirm Password, Terms checkbox.

**Tech:**
- Supabase Auth (email/password + Google OAuth)
- Protected route middleware
- Success redirect to `/dashboard`

### PAGE 3: DASHBOARD (Post-login Home)

**Three-column Layout:**
- **Left Sidebar (240px):** Navigation, Workspaces, Folders, Pinned notes
- **Main Content:** Greeting, Recent notes grid, Quick stats, Activity
- **Right Sidebar (toggleable, 320px):** AI Chat panel (initially collapsed)

**Detailed Sidebar Elements:**
- User profile at top
- **New Note** prominent cyan button
- Navigation items with icons
- Workspaces with expand/collapse
- Folders with note counts and context menu
- Bottom section: Settings, Upgrade banner, Logout

**Main Area:**
- Personalized greeting with time-based message
- 2x2 grid of recent notes (cards)
- Quick action cards
- Productivity stats (notes count, AI usage, streak)
- Recent activity timeline

### PAGE 4: NOTE EDITOR (Core Experience)

**URL:** `/notes/[noteId]`

**Layout:**
- Top: Breadcrumb + Note Header
- Center: Full-bleed Tiptap Editor
- Right: Collapsible AI Sidebar

**Note Header:**
- Emoji picker
- Editable title (large font)
- Metadata (last edited, word count)
- Share, Favorite, More menu (duplicate, move, delete, export)

**Block Types Supported:**
- H1, H2, H3
- Paragraph
- Bullet & Numbered lists
- Todo lists with interactive checkboxes
- Code blocks (Prism.js syntax highlighting)
- Blockquotes & Callouts
- Dividers
- Images (upload + drag-drop)
- Future: Tables, Embeds

**Editor Interactions:**
- **Floating Toolbar:** On selection — formatting + AI "Enhance" button
- **Slash Commands:** `/` for block menu including `/ai`
- **Floating AI Button:** Bottom-right orb that opens command palette (Cmd/Ctrl + K)
- **AI Command Palette:** Searchable list of 15+ commands with descriptions and examples

**AI Capabilities in Editor:**
1. **Command Palette Actions** (streaming insertion):
   - Summarize note
   - Generate action items
   - Expand section
   - Professional tone / Simplify
   - Create blog post
   - Brainstorm ideas
   - Grammar fix
   - Outline generation
   - Translate

2. **Inline AI:** Type prompt after `/ai`, streams directly into document.

3. **AI Sidebar Chat:**
   - Persistent conversation per note/session
   - Full note context automatically included
   - Suggested prompts
   - Copy response to editor button

**Auto-save:** Every 30s + on blur. Version history stub.

### PAGE 5: ALL NOTES PAGE

- Toggle between Grid and List views
- Advanced search with filters (workspace, folder, date range, tags)
- Sort options
- Note cards with preview snippets, metadata, quick actions
- Bulk operations (future)

### PAGE 6: SETTINGS PAGE

Tabbed or accordion sections:
1. **Profile** — Update name, avatar
2. **Account** — Security, delete account
3. **Appearance** — Theme toggle
4. **AI Preferences** — Model settings, default tone, temperature
5. **Billing & Plans** — Upgrade, manage subscription
6. **Data** — Exports, backups
7. **Integrations** (future: Google Drive, etc.)

## 5. Technical Specifications

### Tech Stack
- **Frontend:** Next.js 15 (App Router), TypeScript (strict), Tailwind CSS, shadcn/ui
- **Editor:** Tiptap + ProseMirror
- **AI:** Google Gemini API (streaming)
- **Backend/Database:** Supabase (Auth, Postgres, Storage)
- **State:** Zustand + TanStack Query
- **Animations:** Framer Motion
- **Deployment:** Vercel

### Database Schema (Supabase)

```sql
-- Users
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique,
  full_name text,
  avatar_url text,
  plan text default 'free',
  created_at timestamp default now()
);

-- Workspaces, Folders, Notes, AI Requests (as detailed in query)
```

**Full schema includes indexes, RLS policies for multi-tenancy.**

### API Routes (Next.js Route Handlers)
- `/api/ai/complete` — Streaming completion
- `/api/ai/chat` — Contextual chat
- CRUD for notes, workspaces, folders
- Rate limiting middleware based on plan

### AI Implementation Details
- Streaming using Gemini's generateContentStream
- Frontend: ReadableStream parsing with TextDecoder
- Context management: Current note + recent history
- Token tracking and usage limits

## 6. Development Phases

**Phase 1: Foundation (Days 1-2)**
- Project bootstrap
- Supabase setup + Auth
- Landing + Auth pages
- Basic dashboard & sidebar

**Phase 2: Core Editor (Days 2-3)**
- Tiptap integration
- Block system
- Note CRUD + auto-save
- Organization (workspaces/folders)

**Phase 3: AI Magic (Days 3-4)**
- Gemini integration
- Command palette + inline AI
- Streaming UI
- AI Sidebar chat

**Phase 4: Polish & Launch (Day 4+)**
- Responsiveness
- Error states, loading UX
- Analytics & tracking
- Deployment
- Portfolio showcase

## 7. Component Architecture

```
/components
  ├── layout/ (Sidebar, Header, AIPanel)
  ├── editor/ (TiptapEditor, FloatingToolbar, AICommandPalette, etc.)
  ├── notes/ (NoteCard, NoteHeader)
  ├── ai/ (AIChat, StreamingText)
  └── ui/ (shadcn primitives)
```

## 8. Non-Functional Requirements
- Performance: Editor loads < 500ms, AI response < 2s initial token
- Accessibility: ARIA labels, keyboard navigation
- Security: RLS, input sanitization, auth middleware
- Scalability: Ready for 10k+ users
- Offline: Basic (PWA future)

## 9. Success Metrics for MVP Demo
- New user can sign up, create note, and use AI successfully in < 60 seconds
- Streaming works smoothly on desktop & mobile
- All core flows functional
- Beautiful, polished UI matching design spec
- "Built by Kunal Phogat" attribution visible

---

**This PRD serves as the single source of truth for development.** All features, designs, and technical decisions should align with this document. Future iterations will expand on analytics, mobile apps, team collaboration, and advanced AI features.