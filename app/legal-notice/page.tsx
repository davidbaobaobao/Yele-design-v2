import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { EnLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Legal Notice',
  robots: { index: false, follow: false },
}

export default function LegalNotice() {
  return (
    <EnLangProvider>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Legal Notice
          </h1>
          <p className="font-body text-muted text-sm mb-12">Last updated: July 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">1. Site Owner Details</h2>
              <p className="text-muted">
                In compliance with Law 34/2002, of 11 July, on Information Society Services and Electronic Commerce (LSSICE), the identifying details of the owner of this website are provided below:
              </p>
              <ul className="mt-4 space-y-2 text-muted">
                <li><span className="text-ink font-medium">Name:</span> Yele</li>
                <li><span className="text-ink font-medium">Activity:</span> Subscription-based website design and development</li>
                <li><span className="text-ink font-medium">Contact email:</span>{' '}
                  <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                    info@yele.design
                  </a>
                </li>
                <li><span className="text-ink font-medium">Website:</span>{' '}
                  <a href="https://yele.design" className="text-[#0066CC] hover:underline" target="_blank" rel="noopener noreferrer">
                    yele.design
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">2. Purpose and Terms of Use</h2>
              <p className="text-muted">
                This legal notice governs access to and use of the website yele.design. Accessing the site implies full acceptance of this notice. Yele reserves the right to modify it at any time, effective upon publication on the website.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">3. Intellectual and Industrial Property</h2>
              <p className="text-muted">
                All content on this website — including text, images, graphics, logos, icons, videos and source code — is the property of Yele or its licensors and is protected under Spanish and international intellectual and industrial property law. Its reproduction, distribution, public communication or transformation without the written authorization of the owner is expressly prohibited.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">4. Limitation of Liability</h2>
              <p className="text-muted">
                Yele does not guarantee uninterrupted availability of the site or the absence of errors in its content. Yele is not liable for damages arising from service interruptions, computer viruses or unauthorized access beyond its control.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">5. Privacy and Cookies</h2>
              <p className="text-muted">
                The processing of personal data is governed by our{' '}
                <a href="/privacy-policy" className="text-[#0066CC] hover:underline">Privacy Policy</a>.
                The use of cookies is governed by our{' '}
                <a href="/cookie-policy" className="text-[#0066CC] hover:underline">Cookie Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">6. Governing Law and Jurisdiction</h2>
              <p className="text-muted">
                This legal notice is governed by Spanish law. For any dispute relating to access to or use of the site, the parties submit to the competent courts in accordance with applicable law, without prejudice to consumer protection regulations.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </EnLangProvider>
  )
}
