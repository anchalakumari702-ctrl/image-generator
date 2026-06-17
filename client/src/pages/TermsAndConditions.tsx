import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function TermsAndConditions() {
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
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-6">
            <strong>Last Updated:</strong> June 17, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Dragon AI Image ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Dragon AI Image for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on Dragon AI Image</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The materials on Dragon AI Image are provided on an 'as is' basis. Dragon AI Image makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall Dragon AI Image or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Dragon AI Image.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
            <p className="text-muted-foreground mb-4">
              The materials appearing on Dragon AI Image could include technical, typographical, or photographic errors. Dragon AI Image does not warrant that any of the materials on its website are accurate, complete, or current. Dragon AI Image may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Links</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Dragon AI Image of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Modifications</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. AI-Generated Content Ownership</h2>
            <p className="text-muted-foreground mb-4">
              Users retain ownership of the images they generate using Dragon AI Image, subject to applicable laws and third-party intellectual property rights. Dragon AI Image does not claim ownership of AI-generated images created by users.
            </p>
            <p className="text-muted-foreground mb-4">
              Users are solely responsible for ensuring that their generated content does not violate any applicable laws, intellectual property rights, privacy rights, or other rights of third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Acceptable Use Policy</h2>
            <p className="text-muted-foreground mb-4">
              Users agree not to generate, upload, share, or distribute content that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Violates any applicable law or regulation</li>
              <li>Infringes copyright, trademark, or intellectual property rights</li>
              <li>Promotes violence, hatred, harassment, or discrimination</li>
              <li>Contains sexually explicit or exploitative material</li>
              <li>Impersonates another individual or organization</li>
              <li>Creates deceptive, fraudulent, or misleading content</li>
              <li>Violates the privacy or rights of others</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image reserves the right to remove content and restrict access to users who violate these rules.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Age Requirement</h2>
            <p className="text-muted-foreground mb-4">
              Users must be at least 13 years old to use Dragon AI Image. Users under the age of 18 should use the Service only with the involvement and supervision of a parent or legal guardian.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Account Suspension and Termination</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image reserves the right to suspend, restrict, or terminate any account that violates these Terms, engages in unlawful activities, abuses the Service, or attempts to compromise the security of the platform. Such action may be taken without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Service Availability</h2>
            <p className="text-muted-foreground mb-4">
              Dragon AI Image strives to provide reliable service but does not guarantee uninterrupted, error-free, or secure operation at all times. The Service may be temporarily unavailable due to maintenance, upgrades, technical issues, or circumstances beyond our control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Copyright Complaints</h2>
            <p className="text-muted-foreground mb-4">
              If you believe that any content available through Dragon AI Image infringes your copyright or intellectual property rights, please contact us at aicocode25@gmail.com. We will review valid complaints and take appropriate action where necessary.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">14. Payments, Credits, and Refunds</h2>
            <p className="text-muted-foreground mb-4">
              If Dragon AI Image offers paid subscriptions, credits, or premium features in the future, pricing, billing, cancellation, and refund policies will be published separately on the website. Unless otherwise stated, all purchases are final and subject to applicable consumer protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">15. Limitation of AI Outputs</h2>
            <p className="text-muted-foreground mb-4">
              AI-generated content is created automatically by artificial intelligence systems. Dragon AI Image does not guarantee the accuracy, legality, originality, suitability, or reliability of any generated output. Users are responsible for reviewing and verifying generated content before use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">16. Governing Law and Jurisdiction</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be governed by and interpreted in accordance with the laws of India. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in Delhi, India.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">17. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              If you create an account on Dragon AI Image, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">18. User Content</h2>
            <p className="text-muted-foreground mb-4">
              You retain all rights to any content you submit, post, or display on or through Dragon AI Image. By submitting content, you grant Dragon AI Image a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content in any media or medium.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">19. Prohibited Activities</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Violating any applicable laws or regulations</li>
              <li>Infringing upon intellectual property rights</li>
              <li>Harassing or causing harm to others</li>
              <li>Transmitting viruses or malicious code</li>
              <li>Spamming or sending unsolicited communications</li>
              <li>Attempting to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">20. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms & Conditions, please contact us at:
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
