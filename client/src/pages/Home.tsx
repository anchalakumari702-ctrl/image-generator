import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Sparkles, Zap } from "lucide-react";
import { useLocation } from "wouter";
import GeneratorInterface from "@/components/GeneratorInterface";
import ImageGallery from "@/components/ImageGallery";
import { useState } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [refreshGallery, setRefreshGallery] = useState(0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Leonardo AI</h1>
            </div>
            <a href={getLoginUrl()}>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Sign In
              </Button>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-2xl text-center space-y-8 animate-fade-in">
            <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                Create stunning images with AI
              </h2>
              <p className="text-xl text-muted-foreground">
                Transform your ideas into beautiful visuals. Describe what you want, and watch it come to life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 text-sm animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-accent">∞</div>
                <p className="text-muted-foreground">Unlimited generations</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-accent">⚡</div>
                <p className="text-muted-foreground">Lightning fast</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-accent">✨</div>
                <p className="text-muted-foreground">Premium quality</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Leonardo AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-12">
        {/* Generator Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Create New Image</h2>
            <p className="text-muted-foreground">
              Describe your vision and let AI bring it to life
            </p>
          </div>
          <GeneratorInterface onSuccess={() => setRefreshGallery(prev => prev + 1)} />
        </section>

        {/* Gallery Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Your Gallery</h2>
            <p className="text-muted-foreground">
              Browse and manage your generated images
            </p>
          </div>
          <ImageGallery key={refreshGallery} />
        </section>
      </main>
    </div>
  );
}
