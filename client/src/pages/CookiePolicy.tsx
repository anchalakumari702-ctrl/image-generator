import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CookiePolicy() {
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
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          <p className="text-muted-foreground mb-6">
            <strong>Last Updated:</strong> June 17, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image uses cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Authentication:</strong> To keep you logged in to your account</li>
              <li><strong>Preferences:</strong> To remember your preferences and settings</li>
              <li><strong>Analytics:</strong> To understand how users interact with our website</li>
              <li><strong>Advertising:</strong> To serve personalized advertisements through Google AdSense</li>
              <li><strong>Security:</strong> To protect against fraud and ensure security</li>
              <li><strong>Performance:</strong> To improve website performance and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Performance Cookies:</strong> These cookies collect information about how you use our website, such as which pages you visit and how long you spend on them. This information helps us improve our website.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Functional Cookies:</strong> These cookies allow our website to remember your preferences and provide enhanced functionality.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Advertising Cookies:</strong> These cookies are used to deliver personalized advertisements and to measure the effectiveness of advertising campaigns.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use third-party services that may set their own cookies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
              <li><strong>Google AdSense:</strong> To serve personalized advertisements</li>
              <li><strong>Firebase:</strong> For authentication and data storage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. How to Control Cookies</h2>
            <p className="text-muted-foreground mb-4">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a website and some services and functionalities may not work.
            </p>
            <p className="text-muted-foreground mb-4">
              To manage cookies, please refer to your browser's help documentation or visit www.allaboutcookies.org.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Google AdSense Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Google AdSense uses cookies to serve ads based on your previous visits to our website and other websites. You can opt out of personalized advertising by visiting Google's Ads Settings at https://adssettings.google.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Consent</h2>
            <p className="text-muted-foreground mb-4">
              By using Dragon AI Image, you consent to our use of cookies as described in this Cookie Policy. If you do not consent to our use of cookies, please disable cookies in your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Changes to This Cookie Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Cookie Policy, please contact us at:
            </p>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-muted-foreground">
                <strong>Email:</strong> aicocode25@gmail.com<br />
                <strong>Website:</strong> Dragon AI Image
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
