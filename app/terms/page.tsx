import PolicyShell from "@/components/layout/PolicyShell";

export const metadata = { title: "Terms of Service – Scents by Naire" };

export default function TermsPage() {
  return (
    <PolicyShell>
      {/* Centered header */}
      <div className="text-center mb-10">
        <h1 className="text-[#C9A96E] text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-white/60 text-base mb-1">Terms and conditions for using nairescents.com</p>
        <p className="text-white/40 text-sm">Last Updated: May 5, 2026</p>
      </div>

      <div className="space-y-8 text-white/75 leading-relaxed text-[15px]">

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">1. Agreement to Terms</h2>
          <p className="mb-2">
            By accessing and using nairescents.com (&ldquo;Website&rdquo;), you agree to be bound by these
            Terms of Service (&ldquo;Terms&rdquo;). If you disagree with any part of these terms, please do
            not use our Website.
          </p>
          <p className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm mb-3">
            <strong className="text-white">Important:</strong> These Terms constitute a legally binding agreement between you and Naire Scents. Please read them carefully before making a purchase or using our services.
          </p>
          <div className="space-y-0.5">
            <p className="text-white font-semibold">Business Details:</p>
            <p>Business Name: Naire Scents</p>
            <p>Physical Address: Stanbank House Shop A604, Wing A 6th floor, Nairobi, Kenya</p>
            <p>Email: <a href="mailto:nairescents@gmail.com" className="text-[#C9A96E] underline">nairescents@gmail.com</a></p>
            <p>Phone / WhatsApp: <a href="https://wa.me/254141445422" className="text-[#C9A96E] underline">+254 141 445422</a></p>
          </div>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">3. Eligibility and Account Registration</h2>

          <h3 className="text-white font-semibold mb-1">3.1 Age Requirement</h3>
          <p className="mb-3">
            You must be at least 18 years old to use our Website and purchase products. By using our
            Website, you confirm that you are at least 18 years of age or have parental/guardian consent.
          </p>

          <h3 className="text-white font-semibold mb-1">3.2 Creating an Account</h3>
          <p className="mb-2">To place orders, you may need to create an account. When creating an account, you agree to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">3.3 Account Termination</h3>
          <p className="mb-2">We reserve the right to suspend or terminate accounts that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violate these Terms of Service</li>
            <li>Engage in fraudulent activity</li>
            <li>Abuse our return/refund policies</li>
            <li>Provide false or misleading information</li>
            <li>Engage in abusive behavior toward our staff or other customers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">4. Use of Website</h2>

          <h3 className="text-white font-semibold mb-1">4.1 Permitted Use</h3>
          <p className="mb-2">You may use our Website to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Browse and purchase Naire Scents products</li>
            <li>Access product information and skincare resources</li>
            <li>Contact our customer service team</li>
            <li>Subscribe to our newsletter and marketing communications</li>
            <li>Create and manage your account</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">4.2 Prohibited Activities</h3>
          <p className="mb-2">You must NOT use our Website to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Violate any Kenyan laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit harmful code, viruses, or malware</li>
            <li>Attempt to hack, disrupt, or compromise the Website&apos;s security</li>
            <li>Scrape, harvest, or collect data from the Website</li>
            <li>Impersonate any person or entity</li>
            <li>Post or transmit false, misleading, or defamatory content</li>
            <li>Interfere with other users&apos; access to or use of the Website</li>
            <li>Use the Website for any commercial purpose without our written consent</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">4.3 Consequences of Prohibited Use</h3>
          <p className="mb-2">Violation of these terms may result in:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Immediate termination of your account</li>
            <li>Cancellation of pending orders</li>
            <li>Legal action and reporting to authorities</li>
            <li>Liability for damages caused</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">5. Products and Services</h2>

          <h3 className="text-white font-semibold mb-1">5.1 Product Descriptions</h3>
          <p className="mb-2">We make every effort to provide accurate product descriptions, specifications, and images. However:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Product colors may vary slightly due to screen settings and lighting</li>
            <li>Product packaging may change without prior notice</li>
            <li>We reserve the right to correct any errors in descriptions or pricing</li>
            <li>Product images are for illustration purposes and may not represent exact product appearance</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">5.2 Product Authenticity</h3>
          <p className="mb-2">We guarantee that all products sold on nairescents.com are:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>100% genuine products</li>
            <li>Sourced directly from authorized suppliers</li>
            <li>Within their expiry dates at the time of delivery</li>
            <li>Stored and handled according to manufacturer recommendations</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">5.3 Product Availability</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>All products are subject to availability</li>
            <li>We may limit quantities per customer</li>
            <li>Discontinued or out-of-stock items will be removed or marked as unavailable</li>
            <li>If an ordered item becomes unavailable, we&apos;ll notify you and offer alternatives or a full refund</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">6. Pricing and Payment</h2>

          <h3 className="text-white font-semibold mb-1">6.1 Pricing</h3>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>All prices are in Kenyan Shillings (KSh)</li>
            <li>Prices include applicable Value Added Tax (VAT)</li>
            <li>Shipping fees are calculated at checkout based on location</li>
            <li>We reserve the right to change prices at any time without prior notice</li>
            <li>Price changes do not affect orders already placed and confirmed</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">6.2 Pricing Errors</h3>
          <p className="mb-2">If we discover a pricing error:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>We will notify you before processing your order</li>
            <li>You may choose to proceed at the correct price or cancel the order</li>
            <li>If the order has been dispatched, we&apos;ll contact you to arrange resolution</li>
            <li>We reserve the right to cancel orders with pricing errors</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">6.3 Payment Methods</h3>
          <p className="mb-2">We accept the following payment methods:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li><strong className="text-white">M-Pesa:</strong> Lipa na M-Pesa, STK Push, Paybill, Till Number</li>
            <li><strong className="text-white">Credit/Debit Cards:</strong> Visa, Mastercard (processed through secure payment gateways)</li>
            <li><strong className="text-white">Bank Transfer:</strong> Direct bank deposits (prior arrangement required)</li>
            <li><strong className="text-white">Cash on Delivery:</strong> Available for selected areas within Nairobi (extra fees may apply)</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">6.4 Payment Processing</h3>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Payment must be completed before order processing begins</li>
            <li>All payments are processed through secure, PCI-DSS compliant gateways</li>
            <li>We do not store your complete card details</li>
            <li>Payment authorization may be required for large orders or first-time customers</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">6.5 Failed Payments</h3>
          <p className="mb-2">If payment fails:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your order will not be processed</li>
            <li>You&apos;ll receive notification of the payment failure</li>
            <li>You may retry payment or contact us for assistance</li>
            <li>Orders are not held beyond 24 hours for payment completion</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">7. Orders and Fulfillment</h2>

          <h3 className="text-white font-semibold mb-1">7.1 Order Placement</h3>
          <p className="mb-2">When you place an order:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>You&apos;re making an offer to purchase at the stated price</li>
            <li>You&apos;ll receive an order confirmation via email/SMS</li>
            <li>Confirmation does not guarantee acceptance of your order</li>
            <li>We reserve the right to refuse or cancel any order</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">7.2 Order Acceptance</h3>
          <p className="mb-2">Your order is accepted when:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Payment has been successfully processed</li>
            <li>We send you a dispatch confirmation</li>
            <li>The contract for sale is formed at this point</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">7.3 Order Cancellation by Us</h3>
          <p className="mb-2">We may cancel orders if:</p>
          <ul className="list-disc pl-6 space-y-1 mb-2">
            <li>Products are unavailable or out of stock</li>
            <li>Pricing errors are discovered</li>
            <li>We suspect fraudulent activity</li>
            <li>Delivery address is unserviceable</li>
            <li>Payment authorization fails</li>
            <li>Your account has been suspended or terminated</li>
          </ul>
          <p className="mb-2">If we cancel your order, we will:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Notify you immediately via email/SMS</li>
            <li>Provide a full refund within 5–7 business days</li>
            <li>Offer alternative products where possible</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">7.4 Order Cancellation by You</h3>
          <p className="text-white font-medium mt-2 mb-1">Before Dispatch:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Contact us immediately via email, phone, or WhatsApp</li>
            <li>Provide your order number</li>
            <li>If order hasn&apos;t been processed, full refund will be issued</li>
            <li>Processing time: 3–5 business days</li>
          </ul>
          <p className="text-white font-medium mb-1">After Dispatch:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Orders cannot be cancelled once shipped</li>
            <li>Wait to receive the package</li>
            <li>Follow our standard return process (see Refund Policy)</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">7.5 Order Modifications</h3>
          <p className="mb-2">To modify an order:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Contact us immediately before dispatch</li>
            <li>Changes are subject to product availability</li>
            <li>Price differences may apply</li>
            <li>We cannot modify orders after dispatch</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">8. Shipping and Delivery</h2>

          <h3 className="text-white font-semibold mb-1">8.1 Shipping Policy</h3>
          <p className="mb-3">
            For detailed shipping information, please refer to our{" "}
            <a href="/shipping-policy" className="text-[#C9A96E] underline">Shipping Policy</a>.
          </p>

          <h3 className="text-white font-semibold mb-1">8.2 Delivery Timeline</h3>
          <p className="mb-2">Delivery times are estimates and not guarantees. We are not liable for delays caused by:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Courier service delays</li>
            <li>Weather conditions or natural disasters</li>
            <li>Public holidays</li>
            <li>Incorrect delivery information provided by customer</li>
            <li>Circumstances beyond our control</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">8.3 Delivery Responsibility</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must provide accurate delivery information</li>
            <li>Someone must be available to receive the package</li>
            <li>Valid ID may be required upon delivery</li>
            <li>Risk transfers to you upon delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">9. Returns and Refunds</h2>

          <h3 className="text-white font-semibold mb-1">9.1 Return Policy</h3>
          <p className="mb-3">
            For detailed return and refund information, please refer to our{" "}
            <a href="/refund-policy" className="text-[#C9A96E] underline">Refund &amp; Returns Policy</a>.
          </p>

          <h3 className="text-white font-semibold mb-1">9.2 Return Window</h3>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>You have 30 days from delivery date to initiate a return</li>
            <li>Products must be unopened and in original packaging</li>
            <li>For health and hygiene reasons, opened products cannot be returned unless defective</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">9.3 Refund Processing</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Approved returns are processed within 5–7 business days</li>
            <li>Refunds issued to original payment method</li>
            <li>Bank processing may take additional 3–10 business days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">10. Intellectual Property Rights</h2>

          <h3 className="text-white font-semibold mb-1">10.1 Our Intellectual Property</h3>
          <p className="mb-2">All content on nairescents.com is protected by intellectual property laws, including:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Website design, layout, and graphics</li>
            <li>Naire Scents logo and branding</li>
            <li>Product descriptions and images</li>
            <li>Text, videos, and multimedia content</li>
            <li>Software and code</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">10.3 Limited License</h3>
          <p className="mb-2">We grant you a limited, non-exclusive, non-transferable license to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Access and use the Website for personal, non-commercial purposes</li>
            <li>View and download content for personal reference</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">10.4 Restrictions</h3>
          <p className="mb-2">You may NOT:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Copy, reproduce, or redistribute Website content</li>
            <li>Modify, adapt, or create derivative works</li>
            <li>Use our content for commercial purposes without written permission</li>
            <li>Remove copyright or proprietary notices</li>
            <li>Use our trademarks or branding without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">11. Disclaimers and Limitation of Liability</h2>

          <h3 className="text-white font-semibold mb-1">11.1 Website Availability</h3>
          <p className="mb-2">We strive to keep our Website available 24/7, but we do not guarantee:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Uninterrupted access to the Website</li>
            <li>Error-free operation</li>
            <li>Freedom from viruses or harmful components</li>
            <li>Accuracy of all information displayed</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">11.2 Limitation of Damages</h3>
          <p className="mb-2">To the maximum extent permitted by Kenyan law, Naire Scents shall not be liable for:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of profits, revenue, or business opportunities</li>
            <li>Data loss or corruption</li>
            <li>Personal injury (except where caused by our negligence)</li>
            <li>Damages exceeding the amount paid for the product</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">11.3 Force Majeure</h3>
          <p className="mb-2">We are not liable for failure to perform due to circumstances beyond our reasonable control, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Natural disasters, pandemics, or acts of God</li>
            <li>War, terrorism, or civil unrest</li>
            <li>Government actions or regulations</li>
            <li>Strikes or labor disputes</li>
            <li>Failure of suppliers or service providers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">12. Indemnification</h2>
          <p className="mb-2">
            You agree to indemnify and hold harmless Naire Scents, its directors, employees, and
            agents from any claims, damages, losses, or expenses (including legal fees) arising from:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your violation of these Terms of Service</li>
            <li>Your violation of any laws or regulations</li>
            <li>Your violation of third-party rights</li>
            <li>Your misuse of products or Website</li>
            <li>Your fraudulent or illegal activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">13. Privacy and Data Protection</h2>
          <p className="mb-2">
            Your privacy is important to us. Please review our{" "}
            <a href="/privacy-policy" className="text-[#C9A96E] underline">Privacy Policy</a> to
            understand how we collect, use, and protect your personal information.
          </p>
          <p className="mb-2">By using our Website, you consent to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Collection and processing of your personal data</li>
            <li>Use of cookies and tracking technologies</li>
            <li>Communication via email, SMS, and phone</li>
            <li>Sharing data with service providers as outlined in our Privacy Policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">14. Dispute Resolution</h2>

          <h3 className="text-white font-semibold mb-1">14.1 Governing Law</h3>
          <p className="mb-3">
            These Terms shall be governed by and construed in accordance with the laws of Kenya.
          </p>

          <h3 className="text-white font-semibold mb-1">14.2 Informal Resolution</h3>
          <p className="mb-2">Before initiating formal proceedings, we encourage you to contact us to resolve disputes informally:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Email: <a href="mailto:nairescents@gmail.com" className="text-[#C9A96E] underline">nairescents@gmail.com</a></li>
            <li>Phone / WhatsApp: <a href="https://wa.me/254141445422" className="text-[#C9A96E] underline">+254 141 445422</a></li>
          </ul>

          <h3 className="text-white font-semibold mb-1">14.3 Jurisdiction</h3>
          <p className="mb-3">
            Any disputes that cannot be resolved informally shall be subject to the exclusive
            jurisdiction of the courts of Kenya.
          </p>

          <h3 className="text-white font-semibold mb-1">14.4 Alternative Dispute Resolution</h3>
          <p className="mb-2">We may agree to resolve disputes through:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mediation</li>
            <li>Arbitration under Kenyan Arbitration Act</li>
            <li>Other mutually agreed methods</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">15. Changes to Terms of Service</h2>

          <h3 className="text-white font-semibold mb-1">15.1 Right to Modify</h3>
          <p className="mb-2">We reserve the right to modify these Terms at any time. When we make changes:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>We&apos;ll post the updated Terms on this page</li>
            <li>We&apos;ll update the &ldquo;Last Updated&rdquo; date</li>
            <li>For significant changes, we&apos;ll notify you via email or Website notice</li>
            <li>Continued use of the Website after changes constitutes acceptance</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">15.2 Your Responsibility</h3>
          <p className="mb-2">You are responsible for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Regularly reviewing these Terms</li>
            <li>Understanding your rights and obligations</li>
            <li>Ceasing use of the Website if you disagree with changes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">16. Severability</h2>
          <p className="mb-2">If any provision of these Terms is found to be invalid or unenforceable by a court of law:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>That provision shall be modified to the minimum extent necessary to make it valid</li>
            <li>The remaining provisions shall remain in full force and effect</li>
            <li>Our rights and obligations shall continue as intended</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">17. Entire Agreement</h2>
          <p>
            These Terms, together with our{" "}
            <a href="/privacy-policy" className="text-[#C9A96E] underline">Privacy Policy</a>,{" "}
            <a href="/refund-policy" className="text-[#C9A96E] underline">Refund Policy</a>, and{" "}
            <a href="/shipping-policy" className="text-[#C9A96E] underline">Shipping Policy</a>,
            constitute the entire agreement between you and Naire Scents regarding use of the
            Website and purchase of products. These Terms supersede all prior agreements,
            understandings, or communications.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">18. Waiver</h2>
          <p>
            Our failure to enforce any provision of these Terms does not constitute a waiver of
            that provision or our right to enforce it in the future.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">19. Contact Information</h2>
          <p className="mb-3">For questions about these Terms of Service, please contact us:</p>
          <div className="space-y-1">
            <p className="text-white font-semibold">Naire Scents</p>
            <p>Email: <a href="mailto:nairescentsa@gmail.com" className="text-[#C9A96E] underline">nairescentsa@gmail.com</a></p>
            <p>Phone: <a href="tel:+254141445422" className="text-[#C9A96E] underline">+254 141 445422</a></p>
            <p>WhatsApp: <a href="https://wa.me/254141445422" className="text-[#C9A96E] underline">+254 141 445422</a> <span className="text-white/40 text-xs">(Fastest response)</span></p>
            <p>Physical Address: Stanbank House Shop A604, Wing A 6th floor, Nairobi, Kenya</p>
            <p>Business Hours: Monday to Friday, 9:00 AM – 6:00 PM EAT</p>
          </div>
        </section>

        {/* Centered closing */}
        <div className="pt-4 border-t border-white/10 text-center space-y-3">
          <p className="text-white/60 text-sm italic">
            Questions or Concerns? We&apos;re here to help! If you have any questions about these Terms
            or need clarification on any point, please don&apos;t hesitate to contact us. We value
            transparency and want you to feel confident shopping with us.
          </p>
          <p className="text-white/40 text-xs">
            By using nairescents.com, you acknowledge that you have read, understood, and agree
            to be bound by these Terms of Service.
          </p>
        </div>

      </div>
    </PolicyShell>
  );
}
