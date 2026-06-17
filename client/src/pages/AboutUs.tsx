import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles, Zap, Shield } from "lucide-react";

export default function AboutUs() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold">✨</span>
            </div>
            <h1 className="text-xl font-bold">Dragon AI Image</h1>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            size="sm"
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">About Dragon AI Image</h1>
          <p className="text-muted-foreground text-lg">
            Empowering creativity through artificial intelligence
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            Dragon AI Image is dedicated to democratizing AI-powered image generation. Our mission is to make advanced image creation technology accessible to everyone, regardless of their technical expertise or artistic background. We believe that creativity should know no bounds, and AI should be a tool that empowers rather than limits human potential.
          </p>
        </section>

        {/* What We Do */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <Sparkles className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold mb-2">AI Image Generation</h3>
              <p className="text-muted-foreground text-sm">
                Create stunning, unique images from simple text descriptions using cutting-edge AI technology.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <Zap className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold mb-2">Fast & Efficient</h3>
              <p className="text-muted-foreground text-sm">
                Generate high-quality images in seconds. Our optimized infrastructure ensures quick processing times.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <Shield className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground text-sm">
                Your data is secure. We prioritize privacy and never share your information with third parties.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span><strong>Multiple Styles:</strong> Choose from various artistic styles including realistic, artistic, abstract, and more</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span><strong>Flexible Aspect Ratios:</strong> Generate images in any aspect ratio you need</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span><strong>Batch Generation:</strong> Create multiple images at once to explore different variations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span><strong>Image History:</strong> Keep track of all your generated images in one place</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span><strong>Easy Sharing:</strong> Download and share your creations with others</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span><strong>Secure Authentication:</strong> Firebase-powered authentication with Google Sign-in support</span>
            </li>
          </ul>
        </section>

        {/* Technology Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Technology</h2>
          <p className="text-muted-foreground mb-4">
            Dragon AI Image is built on modern, scalable technology:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong>Frontend:</strong> React 19 with TypeScript and Tailwind CSS for a beautiful, responsive interface</li>
            <li>• <strong>Backend:</strong> Node.js with Express and tRPC for fast, type-safe API calls</li>
            <li>• <strong>Database:</strong> MySQL for reliable data storage and management</li>
            <li>• <strong>Authentication:</strong> Firebase for secure user authentication</li>
            <li>• <strong>AI:</strong> Advanced AI models for high-quality image generation</li>
            <li>• <strong>Hosting:</strong> Cloud-based infrastructure for reliability and scalability</li>
          </ul>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <div className="space-y-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground text-sm">
                We continuously explore new technologies and methods to improve our service and provide the best user experience.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Accessibility</h3>
              <p className="text-muted-foreground text-sm">
                We believe AI should be accessible to everyone. Our platform is designed to be user-friendly and intuitive.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Responsibility</h3>
              <p className="text-muted-foreground text-sm">
                We are committed to responsible AI development and use. We prioritize ethics, privacy, and security.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground text-sm">
                We value our community and listen to feedback. Your suggestions help us improve and grow.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-card p-8 rounded-lg border border-border text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have questions or want to learn more about Dragon AI Image? We'd love to hear from you!
          </p>
          <Button
            onClick={() => setLocation("/contact")}
            className="bg-accent hover:bg-accent/90"
          >
            Contact Us
          </Button>
        </section>
      </main>
    </div>
  );
}
