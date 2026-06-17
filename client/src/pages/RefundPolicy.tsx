import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function RefundPolicy() {
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
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-6">
            <strong>Last Updated:</strong> June 17, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Refund Eligibility</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image offers refunds for premium subscriptions and paid services under the following conditions:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Refund requests must be made within 30 days of the original purchase date</li>
              <li>The service must not have been fully utilized</li>
              <li>The refund request must be submitted through our official support channels</li>
              <li>The refund is limited to the amount paid for the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. How to Request a Refund</h2>
            <p className="text-muted-foreground mb-4">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
              <li>Contact our support team at aicocode25@gmail.com</li>
              <li>Provide your account email and order details</li>
              <li>Explain the reason for your refund request</li>
              <li>Our team will review your request and respond within 5-7 business days</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Refund Processing</h2>
            <p className="text-muted-foreground mb-4">
              Once your refund request is approved, the refund will be processed to your original payment method. Please allow 5-10 business days for the refund to appear in your account, depending on your financial institution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Non-Refundable Items</h2>
            <p className="text-muted-foreground mb-4">
              The following are non-refundable:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Free tier services and features</li>
              <li>Generated images (once downloaded)</li>
              <li>Services that have been fully utilized</li>
              <li>Refund requests made more than 30 days after purchase</li>
              <li>Purchases made with promotional codes or discounts (unless otherwise specified)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Subscription Cancellation</h2>
            <p className="text-muted-foreground mb-4">
              You can cancel your subscription at any time. Upon cancellation, you will retain access to your paid features until the end of your current billing period. No refunds will be issued for partial months or unused portions of your subscription.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Exceptional Circumstances</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image reserves the right to consider refund requests outside the standard 30-day window in exceptional circumstances, such as:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Service outages or technical issues preventing service use</li>
              <li>Billing errors or duplicate charges</li>
              <li>Unauthorized purchases</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Dispute Resolution</h2>
            <p className="text-muted-foreground mb-4">
              If you believe your refund request was denied unfairly, you may appeal the decision by contacting our support team with additional information. We will review your appeal and provide a final decision within 10 business days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image reserves the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to the website. Your continued use of the service following the posting of revised terms means that you accept and agree to the changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Refund Policy or wish to request a refund, please contact us at:
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
