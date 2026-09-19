import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { EnLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://yele.design/cookie-policy',
    languages: {
      en: 'https://yele.design/cookie-policy',
      es: 'https://yele.design/es/cookie-policy',
    },
  },
}

export default function CookiePolicy() {
  return (
    <EnLangProvider>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Cookie Policy
          </h1>
          <p className="font-body text-muted text-sm mb-12">Last updated: August 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <p className="text-muted">
              This Cookie Policy explains how Yele (yele.design) uses cookies and similar technologies when you visit our website. It should be read together with our{' '}
              <a href="/privacy-policy" className="text-[#0066CC] hover:underline">Privacy Policy</a>.
            </p>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">What Are Cookies?</h2>
              <p className="text-muted">
                Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work, to remember your preferences, and to provide information to the site owner. Similar technologies — such as pixels, tags and local storage — perform comparable functions, and we refer to all of them here as &ldquo;cookies&rdquo;.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Categories of Cookies We Use</h2>

              <p className="text-muted mb-3">
                <span className="text-ink font-medium">Strictly necessary cookies.</span> Required for the website to function and to remember your cookie choices. These are always active and do not require consent. Without them, parts of the site would not work correctly.
              </p>
              <p className="text-muted mb-3">
                <span className="text-ink font-medium">Analytics cookies.</span> Help us understand how visitors use the site so we can improve it. We use <span className="text-ink font-medium">Microsoft Clarity</span>, which collects usage data such as pages viewed, clicks, scrolling and anonymised session recordings. These are set only where permitted and can be turned off in our cookie settings.
              </p>
              <p className="text-muted">
                <span className="text-ink font-medium">Marketing / advertising cookies.</span> Used to measure and improve our advertising and to understand which campaigns bring visitors to us. These may include the <span className="text-ink font-medium">Meta (Facebook) Pixel</span> and <span className="text-ink font-medium">Google</span> advertising and measurement tools. You can turn these off in our cookie settings.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Your Choices and Consent</h2>
              <p className="text-muted mb-3">
                When you first visit, we show a cookie banner that lets you accept or reject non-essential (analytics and marketing) cookies, or set your preferences by category. You can change your choice at any time using the cookie settings link on our banner, or by clearing cookies in your browser.
              </p>
              <p className="text-muted">
                You can also block or delete cookies through your browser settings. Note that if you block strictly necessary cookies, some parts of the site may not work as intended.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Third-Party Cookies and Transfers</h2>
              <p className="text-muted">
                Some cookies are set by the third-party providers named above (for example Microsoft, Meta and Google), which may process data outside the European Union, including in the United States, under appropriate safeguards such as the EU Standard Contractual Clauses. Their use of data is governed by their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Changes to This Policy</h2>
              <p className="text-muted">
                We may update this Cookie Policy from time to time. The &ldquo;Last updated&rdquo; date above reflects the latest version. Questions? Email{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">info@yele.design</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </EnLangProvider>
  )
}
