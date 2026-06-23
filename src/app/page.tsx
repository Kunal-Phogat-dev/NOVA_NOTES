"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, Command, FileText, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[800px] h-[500px] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none" />

      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10 max-w-7xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">Nova Notes</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
          <Button asChild>
            <Link href="/auth">Start for Free</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center relative z-10 max-w-5xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm mb-6 border border-border">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Nova AI 1.0 is now live</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Write Less. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Think More.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              The AI-powered notes app that thinks with you. Summarize, generate, and organize — all in one beautifully crafted workspace.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base h-12 px-8" asChild>
                <Link href="/auth">
                  Start for Free <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base h-12 px-8">
                See it in Action
              </Button>
            </motion.div>
          </motion.div>

          {/* Editor Demo Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
            <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden text-left relative z-0">
              <div className="flex items-center px-4 py-3 border-b border-border bg-secondary/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto text-xs font-medium text-muted-foreground">Product Requirements.md</div>
              </div>
              <div className="p-8 md:p-12 prose prose-invert max-w-none font-sans">
                <h1 className="text-3xl font-bold mb-4">Launch Strategy</h1>
                <p className="text-muted-foreground mb-6">Here is the detailed plan for our upcoming product launch next month...</p>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Bot className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-2">AI Suggestion (Streaming...)</p>
                    <p className="opacity-90">Based on your notes, here are 3 key action items you should prioritize for the launch:</p>
                    <ul className="list-disc ml-4 mt-2 space-y-1 opacity-90">
                      <li>Finalize social media copy by Thursday</li>
                      <li>Schedule email sequence to early access users</li>
                      <li>Run a final QA test on the payment gateway</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">A powerful brain for your ideas</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to capture thoughts and turn them into finished work.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Sparkles, title: "AI Writing Assistant", desc: "Generate, rewrite, or expand content inline with one click." },
                { icon: Zap, title: "Smart Summarization", desc: "Condense any long note or selected text instantly." },
                { icon: FileText, title: "Notion-style Blocks", desc: "Flexible blocks: headings, todos, code, embeds, and more." },
                { icon: Bot, title: "AI Chat Sidebar", desc: "Contextual chat that understands your entire note." },
                { icon: CheckCircle2, title: "Powerful Organization", desc: "Workspaces, nested folders, tags, and powerful search." },
                { icon: Command, title: "Lightning Fast", desc: "Built with Next.js for instant load times and smooth editing." }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-2xl bg-card border border-border flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <p className="text-muted-foreground mb-6">Perfect for trying out Nova Notes.</p>
                <div className="text-4xl font-extrabold mb-8">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {['10 notes', 'Basic AI (5 requests/day)', '1 workspace', 'Community support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth">Get Started</Link>
                </Button>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-b from-card to-secondary border border-primary relative flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                <p className="text-muted-foreground mb-6">For power users and professionals.</p>
                <div className="text-4xl font-extrabold mb-8">$12<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {['Unlimited notes', 'Unlimited AI usage', 'Multiple workspaces & advanced folders', 'PDF/Markdown export', 'Priority support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/auth">Upgrade to Pro</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">Nova Notes</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Nova Notes. Built by Kunal Phogat.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Twitter</Link>
            <Link href="#" className="hover:text-foreground">GitHub</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
