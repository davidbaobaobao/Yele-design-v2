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
          <p className="font-body text-muted text-sm mb-12">Last updated: July 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Data Controller</h2>
              <ul className="space-y-2 text-muted">
                <li><span className="text-ink font-medium">Name:</span> Yele</li>
                <li><span className="text-ink font-medium">Email:</span>{' '}
                  <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                    info@yele.design
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Purpose of Processing</h2>
              <p className="text-muted">
                Personal data you provide through the contact form or by email will be used exclusively to manage your request and provide the contracted service. It will not be used for purposes other than those specified at the time of collection.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Legal Basis</h2>
              <p className="text-muted">
                The processing of your personal data is based on the consent given by you when voluntarily providing it (Art. 6.1.a of the General Data Protection Regulation — GDPR) and/or on the performance of the service agreement (Art. 6.1.b GDPR).
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Recipients and Data Processors</h2>
              <p className="text-muted mb-3">
                Your data will not be shared with third parties except where legally required. We use the following technical providers, who act as data processors under GDPR-compliant data protection agreements:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-2">
                <li>
                  <span className="text-ink font-medium">Stripe, Inc.</span> — payment processing and subscription management. PCI-DSS Level 1 certified. Card data is handled entirely by Stripe and is never stored by Yele.
                </li>
                <li>
                  <span className="text-ink font-medium">Supabase, Inc.</span> — user data storage and authentication. Data is hosted on servers within the European Union.
                </li>
                <li>
                  <span className="text-ink font-medium">Vercel, Inc.</span> — website hosting and delivery.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Data Retention Period</h2>
              <p className="text-muted">
                Data will be retained for as long as necessary to provide the service and, once the contractual relationship has ended, for the periods established by law.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Your Rights</h2>
              <p className="text-muted mb-3">
                You may exercise the following rights by writing to{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-muted ml-2">
                <li>Access to your personal data</li>
                <li>Rectification of inaccurate data</li>
                <li>Erasure of your data (&ldquo;right to be forgotten&rdquo;)</li>
                <li>Objection to processing</li>
                <li>Data portability</li>
                <li>Restriction of processing</li>
              </ul>
              <p className="text-muted mt-3">
                If you believe the processing does not comply with the GDPR, you have the right to file a complaint with the Spanish Data Protection Agency (Agencia Española de Protección de Datos, www.aepd.es).
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Cookies</h2>
              <p className="text-muted">
                This website only uses technical cookies necessary for its proper functioning. No analytics, advertising or third-party tracking cookies are used.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </EnLangProvider>
  )
}
