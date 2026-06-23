"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Lock, User, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        // On success, typically Supabase will auto-login if email confirmations are off.
        // Otherwise, show a message. For now, redirect.
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during authentication.");
      } else {
        setError("An error occurred during authentication.");
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen w-full flex bg-background text-foreground">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-secondary/30 relative flex-col justify-between p-12 border-r border-border overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-[100%] blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="font-bold text-2xl tracking-tight">Nova Notes</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight max-w-lg">
            Your second brain, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">powered by AI.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Join thousands of developers and creators who are already writing less and thinking more.
          </p>
        </div>
        
        <div className="relative z-10 w-full h-[300px] rounded-xl border border-border bg-card shadow-2xl p-6 mt-12 overflow-hidden flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="h-4 w-32 bg-secondary rounded" />
            </div>
            <div className="h-4 w-full bg-secondary rounded" />
            <div className="h-4 w-5/6 bg-secondary rounded" />
            <div className="h-4 w-4/6 bg-secondary rounded" />
            <div className="mt-4 p-4 rounded bg-primary/10 border border-primary/20">
                <div className="h-4 w-2/3 bg-primary/40 rounded mb-2" />
                <div className="h-4 w-1/2 bg-primary/40 rounded" />
            </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Enter your details to access your workspace."
                : "Enter your details to get started with Nova Notes."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="fullName" 
                    placeholder="John Doe" 
                    className="pl-10 bg-secondary/50 border-border"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  className="pl-10 bg-secondary/50 border-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary">
                    Forgot password?
                  </Button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 bg-secondary/50 border-border"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/20 border border-destructive/50 rounded-md text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>



          <div className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium text-primary"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Log in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
