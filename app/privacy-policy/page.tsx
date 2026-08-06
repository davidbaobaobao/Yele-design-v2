import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { EnLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: false, follow: false },
}

export default function PrivacyPolicy() {
  return (
    <EnLangProvider>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="font-body text-muted text-sm mb-12">Last updated: August 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <p className="text-muted">
              Yele is based in Spain and serves clients worldwide, including the United States. We take your privacy seriously and comply with the EU General Data Protection Regulation (GDPR). We also honor the rights described below for all users, regardless of where you live, and provide specific rights for U.S. and California residents.
            </p>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Data Controller</h2>
              <ul className="space-y-2 text-muted">
                <li><span className="text-ink font-medium">Name:</span> Yele Design</li>
                <li><span className="text-ink font-medium">Email:</span>{' '}
                  <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                    info@yele.design
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Information We Collect</h2>
              <p className="text-muted">
                We collect information you provide directly — such as your name, email, business details and any content you send us through our contact form, chat assistant, booking tool, or during onboarding — and information collected automatically when you use the site, such as usage data, device and browser information, and interactions captured by our analytics tools.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">How We Use Your Information</h2>
              <p className="text-muted">
                We use your information to respond to your requests, provide and manage the service you contract, process payments, communicate with you, operate and improve our website, and comply with legal obligations. We do not use it for purposes unrelated to those described here.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Legal Basis (GDPR)</h2>
              <p className="text-muted">
                We process personal data based on your consent (Art. 6.1.a GDPR), the performance of our service agreement with you (Art. 6.1.b GDPR), and our legitimate interest in operating and improving our service (Art. 6.1.f GDPR).
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Analytics and Session Recording</h2>
              <p className="text-muted">
                We use Microsoft Clarity to understand how visitors use our site and to improve it. Clarity collects usage data — including pages viewed, clicks, scrolling, and session recordings — and sets cookies. This data is processed by Microsoft Corporation (United States). See Microsoft&rsquo;s privacy statement for details. If you are in a region that requires consent for such tracking, we ask for it through our cookie banner.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Service Providers (Data Processors)</h2>
              <p className="text-muted mb-3">
                We share data only with trusted providers who process it on our behalf under data-protection agreements, and only as needed to run our service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-2">
                <li>
                  <span className="text-ink font-medium">Stripe, Inc.</span> — payment and subscription processing (PCI-DSS Level 1 certified; card data is handled by Stripe and never stored by Yele).
                </li>
                <li>
                  <span className="text-ink font-medium">Supabase, Inc.</span> — database, storage and authentication.
                </li>
                <li>
                  <span className="text-ink font-medium">Vercel, Inc.</span> — website hosting and delivery.
                </li>
                <li>
                  <span className="text-ink font-medium">Microsoft Corporation</span> — Clarity analytics and session recording.
                </li>
                <li>
                  <span className="text-ink font-medium">Groq, Inc.</span> — powers our AI chat assistant; messages you send to the assistant are processed by Groq to generate responses.
                </li>
                <li>
                  <span className="text-ink font-medium">Resend</span> — transactional and notification emails.
                </li>
                <li>
                  <span className="text-ink font-medium">Cal.com, Inc.</span> — scheduling and booking of calls.
                </li>
              </ul>
              <p className="text-muted mt-3">We do not sell your personal information.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">International Data Transfers</h2>
              <p className="text-muted">
                Because we and our providers operate internationally, your data may be processed in the European Union, the United States and other countries. Where data is transferred outside the EU, we rely on appropriate safeguards such as the EU Standard Contractual Clauses.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Data Retention</h2>
              <p className="text-muted">
                We keep personal data for as long as needed to provide the service and, after our relationship ends, for the periods required by law.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Your Rights</h2>
              <p className="text-muted">
                You may request to access, correct, delete, restrict or object to the processing of your data, or request a copy for portability, by emailing{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>. If you are in the EU/UK and believe we have not handled your data properly, you may lodge a complaint with your local data-protection authority, or with the Spanish Data Protection Agency (AEPD, www.aepd.es).
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Your California Privacy Rights (CCPA/CPRA)</h2>
              <p className="text-muted">
                If you are a California resident, you have the right to know what personal information we collect and how we use it, to request deletion or correction of your information, and to opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information. We do not sell your personal information. You will not be discriminated against for exercising these rights. To exercise them, email{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Cookies</h2>
              <p className="text-muted">
                Our use of cookies and similar technologies — including those set by Microsoft Clarity — is described in our{' '}
                <a href="/cookie-policy" className="text-[#0066CC] hover:underline">Cookie Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Children&rsquo;s Privacy</h2>
              <p className="text-muted">
                Our service is not directed to children under 16, and we do not knowingly collect their personal data. If you believe a child has provided us information, contact us and we will delete it.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Data Security</h2>
              <p className="text-muted">
                We apply reasonable technical and organizational measures to protect your information. No method of transmission or storage is completely secure, but we work to safeguard your data.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Changes to This Policy</h2>
              <p className="text-muted">
                We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date above reflects the latest version.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </EnLangProvider>
  )
}
