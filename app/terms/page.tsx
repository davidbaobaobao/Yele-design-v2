import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { EnLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  // No "— Yele" suffix here — the root layout's title template ("%s | Yele")
  // already appends it; the old Spanish page had this same redundant suffix
  // baked in, which rendered as "... — Yele | Yele".
  title: 'Terms and Conditions',
  description: 'General terms of Yele\'s subscription-based website design service.',
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
              These Terms govern your use of the subscription website-design service provided by Yele through yele.design. By contracting the service, you accept these Terms in full.
            </p>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">1. Purpose</h2>
              <p className="text-muted">
                These Terms govern the contracting and use of Yele&rsquo;s subscription-based website design, development and maintenance service.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">2. Service Description</h2>
              <p className="text-muted">
                Yele provides website design, development and maintenance on a monthly subscription. Depending on your plan, the service includes: custom website design and development; delivery within one week of brief approval; hosting and domain for the duration of the subscription; technical maintenance and content updates; and support by email and WhatsApp. The specific services and monthly deliverables included in your plan are set out in Section 3 below.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">3. What&rsquo;s Included in Your Plan</h2>
              <p className="text-muted mb-3">
                The features and monthly deliverables of each plan are as follows and form part of these Terms:
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Starter ($99/mo):</strong> functional website with no page limit, custom domain, content control panel, on-page SEO, custom email and 24/7 support.
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Pro ($169/mo):</strong> everything in Starter, plus branding, online payments, calendar &amp; reservations, periodic redesigns, an AI chat assistant, advanced SEO (monthly technical and on-page optimization), and advanced media creation of up to 1 video and 20 images per month (video: up to 10 seconds, up to 3 revisions; images: unlimited revisions).
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Frontier ($699/mo):</strong> everything in Pro, plus premium media creation of up to 4 videos and 80 images per month (videos: up to 10 seconds each, up to 3 revisions; images: unlimited revisions), one monthly marketing campaign, advanced SEO backlinks, one article per month, Google Ads management (ad spend billed separately), and the AI phone receptionist.
              </p>
              <p className="text-muted">
                Where a plan references a monthly quantity (e.g. images, videos, articles or campaigns), unused monthly allowances do not roll over unless stated.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">4. Price and Payment</h2>
              <p className="text-muted mb-3">
                Prices are those shown on our pricing page at the time of contracting, in U.S. dollars (USD). Prices do not include any applicable local taxes, which may be added where required. Payment is charged monthly and automatically to your card through Stripe, a PCI-DSS Level 1 certified processor. The subscription renews automatically each month until you cancel.
              </p>
              <p className="text-muted">
                Yele may change prices with at least 30 days&rsquo; notice by email; you may cancel before the new price takes effect.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">5. Cancellation and Refunds</h2>
              <p className="text-muted mb-3">
                There is no minimum commitment. You may cancel anytime from your dashboard or by emailing{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">info@yele.design</a>.
              </p>
              <p className="text-muted">
                Cancellation takes effect at the end of the current billing period (no separate notice period); the service remains active until then. We do not issue refunds for periods already billed. After cancellation your website is deactivated, and you may request your data as described in Section 8.
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
              <h2 className="font-display font-semibold text-xl text-ink mb-3">7. Intellectual Property</h2>
              <p className="text-muted mb-3">
                Content you provide (text, images, logos, etc.) remains yours, and you confirm you hold the rights to use it. The custom media and branding that Yele creates for you — including images, videos and brand assets produced under your plan — become your property once delivered and paid for; you may keep and use them freely, including after cancellation. The underlying website source code, framework, templates and technical systems developed by Yele remain Yele&rsquo;s property and are not transferred.
              </p>
              <p className="text-muted">
                <strong className="text-ink font-medium">Domain:</strong> If Yele registers and manages your domain as part of the service, Yele retains it for the duration of the subscription and it is not automatically transferred on cancellation. To keep the domain, you must request it before cancelling, which may be subject to the applicable transfer fee. A domain you provide yourself remains yours at all times.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">8. Your Content and Media When You Leave</h2>
              <p className="text-muted">
                For 30 days after cancellation, you may request an export of: (a) the content you provided, and (b) the custom media and branding Yele created for you, delivered in standard, commonly used file formats. This export does not include Yele&rsquo;s proprietary source code, framework or templates, nor e-commerce customer, order or product data, which are not included in the export.
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
