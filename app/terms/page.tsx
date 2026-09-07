import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { EnLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  // No "— Yele" suffix here — the root layout's title template ("%s | Yele")
  // already appends it; the old Spanish page had this same redundant suffix
  // baked in, which rendered as "... — Yele | Yele".
  title: 'Terms and Conditions',
  description: 'General terms of Yele\'s custom website design service — one-time build from $699 plus optional Yele Care maintenance from $49/month.',
}

export default function TermsAndConditions() {
  return (
    <EnLangProvider>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Terms and Conditions
          </h1>
          <p className="font-body text-muted text-sm mb-12">Last updated: August 2026</p>

          <div className="font-body text-ink space-y-10 leading-relaxed">

            <p className="text-muted">
              These Terms govern your use of the website design and maintenance service provided by Yele through yele.design. By contracting the service, you accept these Terms in full.
            </p>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">1. Purpose</h2>
              <p className="text-muted">
                These Terms govern the contracting and use of Yele&rsquo;s website design, development and maintenance service.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">2. Service Description</h2>
              <p className="text-muted">
                Yele designs and builds a custom website for a one-time price, and then keeps it running through Yele Care, an optional monthly maintenance subscription. Depending on your package, the one-time build includes custom website design and development, a delivery goal of under four weeks from brief approval, and the features listed in Section 3. Yele Care includes hosting, security, backups, technical maintenance, support, small content updates and a full website redesign every year. Support is provided by email and WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">3. What&rsquo;s Included</h2>
              <p className="text-muted mb-3">
                The website build is a one-time price. The packages are as follows and form part of these Terms:
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Launch ($699 one-time):</strong> custom website design, mobile optimization, custom domain, contact and forms, SEO and Google indexing, and professional image and video content for the site.
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Business ($1,199 one-time):</strong> everything in Launch, plus calendar booking, payment acceptance, small e-commerce, conversion optimization, a blog and analytics.
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Pro (from $2,799 one-time):</strong> everything in Business, plus high-performance e-commerce, custom functionality and dashboards, advanced integrations, multiple locations and complex workflows.
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Yele Care ($49/month; $99/month for Pro):</strong> hosting, domain support, security, backups, technical maintenance, support, small content updates, and a full website redesign every year.
              </p>
              <p className="text-muted">
                Add-on services (ongoing content creation, advertising, AI tools and automations) are quoted separately and are not part of the website build or Yele Care unless expressly stated.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">4. Price and Payment</h2>
              <p className="text-muted mb-3">
                The website build is a one-time price shown on our pricing page at the time of contracting, in U.S. dollars (USD), exclusive of any applicable local taxes. You pay 50% to begin the project and the remaining 50% when the website is finished and approved for launch. Payments are processed by Stripe, a PCI-DSS Level 1 certified processor.
              </p>
              <p className="text-muted">
                Yele Care, if taken, is billed monthly and automatically to your card and renews each month until you cancel. Yele may change Yele Care pricing with at least 30 days&rsquo; notice by email; you may cancel before the new price takes effect.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">5. Yele Care, Cancellation and Refunds</h2>
              <p className="text-muted mb-3">
                Yele Care is optional and not compulsory, though we highly recommend it so your website stays hosted, secure, up to date and redesigned every year. There is no minimum commitment; you may cancel Yele Care anytime by emailing{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">info@yele.design</a>.
              </p>
              <p className="text-muted mb-3">
                If you stop paying for Yele Care, your website hosting remains active for a migration period of 30 days so you can migrate and back up your website and content. After that period, hosting is discontinued and the site may go offline. You are responsible for arranging alternative hosting before the migration period ends.
              </p>
              <p className="text-muted">
                We do not issue refunds for the one-time build once work has begun, nor for Yele Care periods already billed.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">6. Client Obligations</h2>
              <p className="text-muted mb-3">
                You agree to: provide the content, images and text needed to build your site in a timely way; use the service lawfully; not publish unlawful, offensive, defamatory or infringing content; and keep your payment information current to avoid interruptions.
              </p>
              <p className="text-muted">
                If your plan includes e-commerce, you are solely responsible for the products or services you sell, their descriptions and pricing, order fulfilment, and any applicable taxes, consumer and product-safety laws.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">7. Intellectual Property &amp; Ownership</h2>
              <p className="text-muted mb-3">
                Content you provide (text, images, logos, etc.) remains yours, and you confirm you hold the rights to use it. Once the one-time build is paid in full, you own the completed website design and all custom images and videos Yele produces for you, and you hold the copyright to that content — you may keep and use it freely, including if you later cancel Yele Care. Generic third-party frameworks, libraries, fonts and tooling used to build the site remain under their own respective licenses.
              </p>
              <p className="text-muted">
                <strong className="text-ink font-medium">Domain:</strong> A domain you provide yourself remains yours at all times. A standard domain that Yele registers for you can be transferred to you on request, subject to any applicable transfer fee.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">8. Your Content and Media When You Leave</h2>
              <p className="text-muted">
                If you stop Yele Care, you may — within the 30-day migration period described in Section 5 — request an export of the website, the content you provided, and the custom design, images and videos Yele created for you, delivered in standard, commonly used file formats. E-commerce customer, order and product data are not included in this export.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">9. Warranty Disclaimer</h2>
              <p className="text-muted">
                The service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; To the fullest extent permitted by law, Yele disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and uninterrupted or error-free operation.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">10. Limitation of Liability</h2>
              <p className="text-muted">
                Yele is not liable for loss of business, revenue or data arising from the use of or inability to use the service. Yele&rsquo;s total liability shall not exceed the amount you paid for the most recent month of service.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">11. Indemnification</h2>
              <p className="text-muted">
                You agree to indemnify and hold Yele harmless from any claim arising out of the content you provide, the products or services you sell through your site, or your use of the service in breach of these Terms or applicable law.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">12. Changes to These Terms</h2>
              <p className="text-muted">
                Yele may modify these Terms with at least 15 days&rsquo; notice by email. Continued use after that period constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">13. Governing Law</h2>
              <p className="text-muted">
                These Terms are governed by Spanish law. Any dispute arising from the service will be subject to the competent courts, without prejudice to any mandatory consumer-protection rights available to you under the laws of your place of residence. Yele operates internationally and serves clients including in the United States.
              </p>
            </section>

            <section className="pt-4 border-t border-hairline">
              <p className="text-muted text-sm">
                For questions about these Terms, contact{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </EnLangProvider>
  )
}
