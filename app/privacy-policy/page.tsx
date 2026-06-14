import PolicyShell from "@/components/layout/PolicyShell";

export const metadata = { title: "Privacy Policy – Scents by Naire" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyShell>
      {/* Centered header */}
      <div className="text-center mb-10">
        <h1 className="text-[#C9A96E] text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-white/60 text-base mb-1">How we collect, use, and protect your information</p>
        <p className="text-white/40 text-sm">Last Updated: December 31, 2024</p>
      </div>

      <div className="space-y-8 text-white/75 leading-relaxed text-[15px]">

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">1. Introduction</h2>
          <p className="mb-2">
            Naire Scents (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website nairescents.com and make purchases from us.
          </p>
          <p className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm">
            <strong className="text-white">Key Point:</strong> We only collect information necessary to process your
            orders and improve your shopping experience. We never sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">2. Information We Collect</h2>

          <h3 className="text-white font-semibold mb-1">2.1 Personal Information You Provide</h3>
          <p className="mb-2">When you place an order, create an account, or contact us, we collect:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong className="text-white">Identity Information:</strong> Full name, date of birth (if provided)</li>
            <li><strong className="text-white">Contact Information:</strong> Email address, phone number, delivery address</li>
            <li><strong className="text-white">Payment Information:</strong> Payment details (securely processed through our payment providers)</li>
            <li><strong className="text-white">Order Information:</strong> Products purchased, order history, preferences</li>
            <li><strong className="text-white">Communication Data:</strong> Your inquiries, feedback, and correspondence with us</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">2.2 Information Automatically Collected</h3>
          <p className="mb-2">When you browse our website, we automatically collect:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong className="text-white">Technical Data:</strong> IP address, browser type and version, device type, operating system</li>
            <li><strong className="text-white">Usage Data:</strong> Pages visited, time spent on pages, links clicked, search queries</li>
            <li><strong className="text-white">Location Data:</strong> General location based on IP address</li>
            <li><strong className="text-white">Cookie Data:</strong> Information from cookies and similar technologies (see Section 8)</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">2.3 Information from Third Parties</h3>
          <p className="mb-2">We may receive information from:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Payment Processors: Transaction confirmation and payment status</li>
            <li>Delivery Partners: Delivery status and confirmation</li>
            <li>Social Media: If you interact with us on social platforms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">3. How We Use Your Information</h2>

          <h3 className="text-white font-semibold mb-1">3.1 To Process Orders and Provide Services</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Process and fulfill your orders</li>
            <li>Arrange delivery of products</li>
            <li>Process payments and prevent fraud</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Handle returns and refunds</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">3.2 To Communicate With You</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Respond to your inquiries and customer service requests</li>
            <li>Send important updates about your orders</li>
            <li>Provide skincare tips and product information</li>
            <li>Send promotional emails (only if you&apos;ve opted in)</li>
            <li>Conduct surveys to improve our services</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">3.3 To Improve Our Website and Services</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Analyze website usage and customer behavior</li>
            <li>Improve website functionality and user experience</li>
            <li>Develop new products and services</li>
            <li>Personalize your shopping experience</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">3.4 For Legal and Security Purposes</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Comply with legal obligations and regulations</li>
            <li>Prevent fraudulent transactions and protect against security threats</li>
            <li>Enforce our Terms and Conditions</li>
            <li>Protect our rights, property, and safety</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">4. Legal Basis for Processing <span className="text-sm font-normal text-white/50">(Kenya Data Protection Act, 2019)</span></h2>
          <p className="mb-2">We process your personal data based on:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-white">Contract Performance:</strong> To fulfill our contract with you when you place an order</li>
            <li><strong className="text-white">Consent:</strong> When you opt in to receive marketing communications</li>
            <li><strong className="text-white">Legitimate Interests:</strong> To improve our services, prevent fraud, and ensure security</li>
            <li><strong className="text-white">Legal Obligation:</strong> To comply with Kenyan laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">5. Information Sharing and Disclosure</h2>

          <h3 className="text-white font-semibold mb-1">5.1 Service Providers We Share Data With</h3>
          <p className="mb-2">We share your information with trusted third parties who help us operate our business:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong className="text-white">Delivery Partners:</strong> We share your name, phone number, and delivery address with courier services (G4S, Fargo Courier, Posta Kenya) to deliver your orders</li>
            <li><strong className="text-white">Payment Processors:</strong> Payment information is securely processed by authorized payment gateway providers</li>
            <li><strong className="text-white">Website Hosting:</strong> Shopify hosts our website and stores order data securely</li>
            <li><strong className="text-white">Email Service Providers:</strong> To send order confirmations and marketing emails (if opted in)</li>
            <li><strong className="text-white">Analytics Providers:</strong> To understand website usage and improve our services</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">5.2 Legal Disclosures</h3>
          <p className="mb-2">We may disclose your information when required by law:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>To comply with court orders, legal processes, or government requests</li>
            <li>To enforce our Terms and Conditions</li>
            <li>To protect our rights, property, and safety, or that of others</li>
            <li>In connection with fraud prevention and investigation</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">5.3 Business Transfers</h3>
          <p className="mb-4">
            If Naire Scents is involved in a merger, acquisition, or sale of assets, your information
            may be transferred as part of that transaction.
          </p>

          <h3 className="text-white font-semibold mb-1">5.4 What We Do NOT Do</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>We do <strong className="text-white">NOT</strong> sell your personal information to third parties for marketing purposes</li>
            <li>We do <strong className="text-white">NOT</strong> share your information with advertisers without your consent</li>
            <li>We do <strong className="text-white">NOT</strong> use your information for purposes other than those stated in this policy</li>
            <li>We do <strong className="text-white">NOT</strong> spam you — you can unsubscribe from marketing emails anytime</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">6. Data Security</h2>

          <h3 className="text-white font-semibold mb-1">6.1 Security Measures</h3>
          <p className="mb-2">
            We implement appropriate technical and organizational security measures to protect your
            personal information:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong className="text-white">SSL/TLS Encryption:</strong> All data transmission is encrypted</li>
            <li><strong className="text-white">Secure Payment Processing:</strong> PCI-DSS compliant payment systems</li>
            <li><strong className="text-white">Access Controls:</strong> Limited access to personal data by authorized personnel only</li>
            <li><strong className="text-white">Regular Security Audits:</strong> We regularly review and update our security practices</li>
            <li><strong className="text-white">Data Backup:</strong> Regular backups to prevent data loss</li>
            <li><strong className="text-white">Employee Training:</strong> Staff trained on data protection and privacy</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">6.2 Data Retention</h3>
          <p className="mb-2">We retain your personal information for as long as necessary to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-2">
            <li>Fulfill the purposes outlined in this policy</li>
            <li>Comply with legal, accounting, or reporting requirements</li>
            <li>Resolve disputes and enforce our agreements</li>
          </ul>
          <p>When data is no longer needed, we securely delete or anonymize it.</p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">7. Your Rights Under Kenya Data Protection Act, 2019</h2>
          <p className="mb-4">You have the following rights regarding your personal data:</p>

          <div className="space-y-3">
            {[
              { title: "7.1 Right to Access", body: "You can request a copy of the personal data we hold about you." },
              { title: "7.2 Right to Rectification", body: "You can request correction of inaccurate or incomplete data." },
              { title: "7.3 Right to Erasure (\"Right to be Forgotten\")", body: "You can request deletion of your personal data, subject to legal retention requirements." },
              { title: "7.4 Right to Restrict Processing", body: "You can request that we limit how we use your data." },
              { title: "7.5 Right to Data Portability", body: "You can request your data in a structured, commonly used format." },
              { title: "7.6 Right to Object", body: "You can object to certain types of processing, including direct marketing." },
              { title: "7.7 Right to Withdraw Consent", body: "Where we rely on consent, you can withdraw it at any time." },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3 className="text-white font-semibold text-sm mb-0.5">{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-white font-semibold mb-1">7.8 Right to Lodge a Complaint</h3>
            <p className="mb-2">You have the right to lodge a complaint with:</p>
            <p className="mb-1">Office of the Data Protection Commissioner, Kenya</p>
            <p>Email: <a href="mailto:info@odpc.go.ke" className="text-[#C9A96E] underline">info@odpc.go.ke</a> &nbsp;|&nbsp; Phone: +254 (0) 20 2185027</p>
          </div>

          <div className="mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <p className="text-white font-semibold mb-1">How to Exercise Your Rights</p>
            <p className="mb-1">To exercise any of these rights, contact us at:</p>
            <ul className="space-y-0.5">
              <li>Email: <a href="mailto:nairescents@gmail.com" className="text-[#C9A96E] underline">nairescents@gmail.com</a></li>
              <li>Phone: <a href="tel:+254141445422" className="text-[#C9A96E] underline">+254 141 445422</a></li>
              <li>Written Request: Stanbank House Shop A604, Wing A 6th floor, Nairobi</li>
            </ul>
            <p className="mt-2 text-white/50 text-sm">We will respond to your request within 30 days.</p>
          </div>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">8. Cookies and Tracking Technologies</h2>

          <h3 className="text-white font-semibold mb-1">8.1 What Are Cookies?</h3>
          <p className="mb-4">
            Cookies are small text files stored on your device when you visit our website. They help
            us improve your experience and understand how you use our site.
          </p>

          <h3 className="text-white font-semibold mb-2">8.2 Types of Cookies We Use</h3>
          <div className="space-y-3 mb-4">
            <div>
              <p className="text-white font-medium mb-1">Essential Cookies <span className="text-white/40 text-xs font-normal">(Required)</span></p>
              <ul className="list-disc pl-6 space-y-0.5">
                <li>Enable core website functionality</li>
                <li>Remember items in your shopping cart</li>
                <li>Maintain your login session</li>
              </ul>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Analytics Cookies <span className="text-white/40 text-xs font-normal">(Optional)</span></p>
              <ul className="list-disc pl-6 space-y-0.5">
                <li>Track website traffic and usage patterns</li>
                <li>Help us understand which pages are most popular</li>
                <li>Improve website performance</li>
              </ul>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Marketing Cookies <span className="text-white/40 text-xs font-normal">(Optional)</span></p>
              <ul className="list-disc pl-6 space-y-0.5">
                <li>Track your browsing habits across websites</li>
                <li>Deliver personalized advertisements</li>
                <li>Measure effectiveness of marketing campaigns</li>
              </ul>
            </div>
          </div>

          <h3 className="text-white font-semibold mb-1">8.3 Managing Cookies</h3>
          <p className="mb-2">
            You can control cookies through your browser settings. However, disabling essential
            cookies may affect website functionality. To manage cookies:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Chrome: Settings → Privacy and Security → Cookies</li>
            <li>Safari: Preferences → Privacy → Cookies and website data</li>
            <li>Firefox: Settings → Privacy &amp; Security → Cookies and Site Data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">9. Marketing Communications</h2>

          <h3 className="text-white font-semibold mb-1">9.1 What You&apos;ll Receive</h3>
          <p className="mb-2">If you opt in to receive marketing emails, we&apos;ll send you:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>New product launches and arrivals</li>
            <li>Special offers, discounts, and promotions</li>
            <li>Skincare tips and advice</li>
            <li>Exclusive deals for newsletter subscribers</li>
            <li>Seasonal promotions and sales</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">9.2 Frequency</h3>
          <p className="mb-4">
            We typically send 2–4 marketing emails per month. We respect your inbox and won&apos;t spam you.
          </p>

          <h3 className="text-white font-semibold mb-1">9.3 How to Unsubscribe</h3>
          <p className="mb-2">You can unsubscribe at any time by:</p>
          <ul className="list-disc pl-6 space-y-1 mb-2">
            <li>Clicking the &ldquo;Unsubscribe&rdquo; link at the bottom of any marketing email</li>
            <li>Emailing us at <a href="mailto:nairescents@gmail.com" className="text-[#C9A96E] underline">nairescents@gmail.com</a></li>
            <li>Updating your preferences in your account settings</li>
            <li>Contacting us via WhatsApp at <a href="https://wa.me/254141445422" className="text-[#C9A96E] underline">+254 141 445422</a></li>
          </ul>
          <p className="text-white/50 text-sm italic">
            Note: Even if you unsubscribe from marketing emails, we&apos;ll still send you important
            transactional emails about your orders.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">10. Children&apos;s Privacy</h2>
          <p className="mb-2">
            Our website and services are not directed to children under 18 years of age. We do not
            knowingly collect personal information from children.
          </p>
          <p>
            If you are a parent or guardian and believe your child has provided us with personal
            information, please contact us immediately. We will take steps to remove that information
            from our systems.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">11. International Data Transfers</h2>
          <p className="mb-2">
            Your information is primarily stored and processed in Kenya. However, some of our service
            providers (such as Shopify) may store data on servers outside Kenya.
          </p>
          <p>
            When we transfer data internationally, we ensure appropriate safeguards are in place to
            protect your information in accordance with Kenya&apos;s data protection laws.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">12. Third-Party Links</h2>
          <p className="mb-2">
            Our website may contain links to third-party websites (such as social media platforms).
            This Privacy Policy does not apply to those websites.
          </p>
          <p>
            We are not responsible for the privacy practices of third-party websites. We encourage
            you to read their privacy policies before providing any personal information.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">13. Changes to This Privacy Policy</h2>
          <p className="mb-2">
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or legal requirements.
          </p>
          <p className="mb-2">When we make changes:</p>
          <ul className="list-disc pl-6 space-y-1 mb-2">
            <li>We&apos;ll post the updated policy on this page</li>
            <li>We&apos;ll update the &ldquo;Last Updated&rdquo; date at the top</li>
            <li>For significant changes, we&apos;ll notify you by email or prominent notice on our website</li>
          </ul>
          <p>
            Your continued use of our website after changes constitutes acceptance of the updated
            policy. We encourage you to review this Privacy Policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">14. Contact Us</h2>
          <p className="mb-3">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our
            data practices, please contact us:
          </p>
          <div className="space-y-1">
            <p className="text-white font-semibold">Naire Scents</p>
            <p>Email: <a href="mailto:nairescents@gmail.com" className="text-[#C9A96E] underline">nairescents@gmail.com</a></p>
            <p>Phone: <a href="tel:+254141445422" className="text-[#C9A96E] underline">+254 141 445422</a></p>
            <p>WhatsApp: <a href="https://wa.me/254141445422" className="text-[#C9A96E] underline">+254 141 445422</a> <span className="text-white/40 text-xs">(Fastest response)</span></p>
            <p>Physical Address: Stanbank House Shop A604, Wing A 6th floor, Nairobi, Kenya</p>
            <p>Business Hours: Monday to Friday, 9:00 AM – 6:00 PM EAT</p>
            <p className="text-white/50 text-sm">Response Time: We aim to respond to all privacy inquiries within 48 hours.</p>
          </div>
        </section>

        {/* Centered closing statement */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2">
          <p className="text-white/60 text-sm italic">
            Your Privacy Matters: We take your privacy seriously. If you have any concerns about how
            we handle your personal information, please don&apos;t hesitate to reach out. We&apos;re here to
            help and ensure your data is protected.
          </p>
          <p className="text-white/30 text-xs">
            This Privacy Policy is compliant with the Kenya Data Protection Act, 2019
          </p>
        </div>

      </div>
    </PolicyShell>
  );
}
