import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useLocation } from "wouter";
import GeneratorInterface from "@/components/GeneratorInterface";
import ImageGallery from "@/components/ImageGallery";
import Footer from "@/components/Footer";
import { AdSenseAd } from "@/components/AdSenseAd";
import { toast } from "sonner";

export default function Home() {
  const { user, loading, logout } = useFirebaseAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      setLocation("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
        <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">✨</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Dragon AI Image</h1>
          <p className="text-muted-foreground mb-8">
            Create stunning images with AI. Sign in to get started.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setLocation("/login")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setLocation("/signup")}
              variant="outline"
              className="px-8"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold">✨</span>
            </div>
            <h1 className="text-xl font-bold">Dragon AI Image</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8 space-y-8">
        <AdSenseAd slot="1234567890" format="horizontal" />
        <GeneratorInterface />
        <AdSenseAd slot="0987654321" format="horizontal" />
        <ImageGallery />
        <AdSenseAd slot="1111111111" format="horizontal" />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
