import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Disclaimer() {
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
          <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
          <p className="text-muted-foreground mb-6">
            <strong>Last Updated:</strong> June 17, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. General Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The information provided on Dragon AI Image is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. AI-Generated Content Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image generates images using artificial intelligence technology. These images are created based on text prompts provided by users. We do not guarantee the accuracy, quality, or appropriateness of AI-generated images. Users are responsible for reviewing and approving generated images before use.
            </p>
            <p className="text-muted-foreground mb-4">
              AI-generated images may contain errors, inaccuracies, or inappropriate content. Dragon AI Image is not responsible for any consequences arising from the use of AI-generated images.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. No Professional Advice</h2>
            <p className="text-muted-foreground mb-4">
              The content on Dragon AI Image is not intended to constitute professional advice. Any reliance you place on such information is therefore strictly at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall Dragon AI Image, its directors, employees, or agents be liable to you for any damages arising out of the use or inability to use the materials on the website, even if Dragon AI Image or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property Rights</h2>
            <p className="text-muted-foreground mb-4">
              The AI-generated images created through Dragon AI Image may be subject to copyright and intellectual property laws. Users are responsible for ensuring they have the right to use generated images in their intended manner. Dragon AI Image does not guarantee that generated images do not infringe upon third-party intellectual property rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Third-Party Content</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image may contain links to third-party websites and services. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party websites is governed by their terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Service Availability</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image is provided on an "as is" and "as available" basis. We do not guarantee that the service will be uninterrupted, timely, secure, or error-free. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. User Responsibility</h2>
            <p className="text-muted-foreground mb-4">
              Users are responsible for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Maintaining the confidentiality of their account information</li>
              <li>Ensuring their use of the service complies with all applicable laws</li>
              <li>Reviewing and approving all generated content before use</li>
              <li>Obtaining necessary permissions for use of generated images</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. No Warranty</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image makes no warranty that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>The service will meet your requirements</li>
              <li>The service will be uninterrupted or error-free</li>
              <li>Any defects will be corrected</li>
              <li>Generated images will be suitable for your purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Disclaimer, please contact us at:
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
