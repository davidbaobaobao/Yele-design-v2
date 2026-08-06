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
          <p className="font-body text-muted text-sm mb-12">Last updated: July 2026</p>

          <div className="font-body text-ink space-y-10 leading-relaxed">

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">1. Purpose</h2>
              <p className="text-muted">
                These Terms and Conditions govern the contracting and use of the subscription-based website design service offered by Yele through the website yele.design. Contracting the service implies full and unconditional acceptance of these terms.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">2. Service Description</h2>
              <p className="text-muted mb-3">
                Yele offers a website design, development and maintenance service on a monthly subscription basis. Depending on the plan contracted, the service includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-2">
                <li>Custom website design and development</li>
                <li>Delivery within 1 week of brief approval</li>
                <li>Web hosting and domain for the duration of the subscription</li>
                <li>Technical maintenance and content updates</li>
                <li>Support via email and WhatsApp</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">3. Contracting and Registration</h2>
              <p className="text-muted">
                To contract the service, the client must be of legal age, act on their own behalf or with sufficient legal representation, and provide truthful and up-to-date information during registration. The client is responsible for keeping their access credentials confidential.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">4. Price and Payment</h2>
              <p className="text-muted mb-3">
                The price of the service is as shown on the pricing page at the time of contracting, expressed in euros, VAT included. Payment is collected monthly via automatic charge to the client&rsquo;s credit or debit card, processed by Stripe, a PCI-DSS Level 1 certified payment platform.
              </p>
              <p className="text-muted">
                Yele reserves the right to modify prices with at least 30 days&rsquo; notice by email. The client may cancel before the new price takes effect.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">5. Cancellation</h2>
              <p className="text-muted mb-3">
                The service has no minimum commitment period. The client may cancel their subscription at any time from the client dashboard or by writing to{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">info@yele.design</a>.
              </p>
              <p className="text-muted">
                Cancellation will take effect at the end of the current billing period. No refunds will be issued for partial periods already billed. After cancellation, the website will no longer be active, and the client may request an export of their content within 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">6. Client Obligations</h2>
              <p className="text-muted mb-3">The client agrees to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-2">
                <li>Provide the content, images and text necessary for the development of the site in a timely manner.</li>
                <li>Use the service in accordance with the law, morality and public order.</li>
                <li>Not publish unlawful, offensive, defamatory content or content that infringes third-party rights.</li>
                <li>Keep payment information up to date to avoid service interruptions.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">7. Intellectual Property</h2>
              <p className="text-muted mb-3">
                Content provided by the client (text, images, logos, etc.) is and will remain the property of the client. The client guarantees that they hold the necessary rights for its use.
              </p>
              <p className="text-muted mb-3">
                The design, code and technical development carried out by Yele are the property of Yele for the duration of the subscription. After cancellation, the client may request an export of their content, but not of the source code developed by Yele.
              </p>
              <p className="text-muted">
                <strong className="text-ink font-medium">Domain:</strong> If the domain is registered and managed by Yele as part of the service, Yele retains ownership of it for the duration of the subscription. In the event of cancellation, the domain is not automatically transferred to the client. If the client wishes to retain the domain, they must request it explicitly before cancelling, and this may be subject to the current transfer fee. If the client provides their own domain, it remains the client&rsquo;s property at all times.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">8. Limitation of Liability</h2>
              <p className="text-muted">
                Yele is not liable for loss of business, revenue or data arising from the use or inability to use the service. Yele&rsquo;s maximum liability to the client shall not, in any case, exceed the amount paid for the last month of service.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">9. Changes to These Terms</h2>
              <p className="text-muted">
                Yele reserves the right to modify these Terms and Conditions, notifying the client by email at least 15 days in advance. Continued use of the service after this period constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">10. Governing Law and Jurisdiction</h2>
              <p className="text-muted">
                These terms are governed by Spanish law. For any dispute arising from the provision of the service, the parties submit to the jurisdiction of the courts of the consumer&rsquo;s domicile, in accordance with consumer and user protection regulations.
              </p>
            </section>

            <section className="pt-4 border-t border-hairline">
              <p className="text-muted text-sm">
                For any questions about these terms, you can contact us at{' '}
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
