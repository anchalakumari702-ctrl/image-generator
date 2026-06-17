import { useLocation } from "wouter";
import { Heart } from "lucide-react";

export default function Footer() {
  const [, setLocation] = useLocation();

  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Disclaimer", path: "/disclaimer" },
    { label: "Cookie Policy", path: "/cookies" },
    { label: "Refund Policy", path: "/refund" },
  ];

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-20">
      <div className="container py-12">
        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold">✨</span>
              </div>
              <h3 className="text-lg font-bold">Dragon AI Image</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Create stunning images with AI-powered technology.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => setLocation(link.path)}
                    className="text-muted-foreground hover:text-accent transition text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => setLocation(link.path)}
                    className="text-muted-foreground hover:text-accent transition text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-muted-foreground text-sm mb-2">
              <a
                href="mailto:aicocode25@gmail.com"
                className="hover:text-accent transition"
              >
                aicocode25@gmail.com
              </a>
            </p>
            <p className="text-muted-foreground text-sm">
              Available 24/7 for support
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Dragon AI Image. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            Made with
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            by Dragon AI Team
          </div>
        </div>
      </div>
    </footer>
  );
}
