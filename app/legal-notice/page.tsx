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
          <p className="font-body text-muted text-sm mb-12">Last updated: August 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <p className="text-muted">
              Yele is a website design studio based in Spain, serving clients worldwide — including throughout the United States. This Legal Notice explains who operates this website and the terms under which you use it.
            </p>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">1. Site Owner</h2>
              <p className="text-muted">
                In compliance with Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSICE), the details of the site owner are:
              </p>
              <ul className="mt-4 space-y-2 text-muted">
                <li><span className="text-ink font-medium">Name:</span> Yele Design</li>
                <li><span className="text-ink font-medium">Activity:</span> Subscription-based website design, development and maintenance</li>
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
                This Legal Notice governs access to and use of yele.design. By accessing the site, you accept this notice in full. Yele may update it at any time, with changes effective upon publication.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">3. Intellectual and Industrial Property</h2>
              <p className="text-muted">
                All content on this website — text, images, graphics, logos, icons, videos and source code — belongs to Yele or its licensors and is protected under Spanish, U.S. and international intellectual property law. You may not reproduce, distribute, publicly communicate or modify it without Yele&rsquo;s written permission.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">4. Limitation of Liability</h2>
              <p className="text-muted">
                Yele does not guarantee that the site will be available without interruption or free of errors. To the fullest extent permitted by law, Yele is not liable for damages arising from service interruptions, viruses or unauthorized access beyond its reasonable control.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">5. Privacy and Cookies</h2>
              <p className="text-muted">
                The processing of personal data is governed by our{' '}
                <a href="/privacy-policy" className="text-[#0066CC] hover:underline">Privacy Policy</a>.
                The use of cookies and tracking technologies is described in our{' '}
                <a href="/cookie-policy" className="text-[#0066CC] hover:underline">Cookie Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">6. Governing Law</h2>
              <p className="text-muted">
                This Legal Notice is governed by Spanish law. Any dispute relating to the website will be subject to the competent courts, without prejudice to any mandatory consumer-protection rights available to you under the laws of your place of residence.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </EnLangProvider>
  )
}
