import PolicyShell from "@/components/layout/PolicyShell";

export const metadata = { title: "Shipping & Delivery Policy – Scents by Naire" };

export default function ShippingPolicyPage() {
  return (
    <PolicyShell>
      {/* Centered header */}
      <div className="text-center mb-10">
        <h1 className="text-[#C9A96E] text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-white/60 text-base mb-1">Everything you need to know about order delivery</p>
        <p className="text-white/40 text-sm">Last Updated: May 05, 2026</p>
      </div>

      <div className="space-y-8 text-white/75 leading-relaxed text-[15px]">

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">1. Shipping Coverage</h2>
          <p>
            We deliver products nationwide across Kenya. Whether you&apos;re in Nairobi, Mombasa,
            Kisumu, Nakuru, or any other town, we&apos;ve got you covered!
          </p>
          <p className="mt-2">
            <strong className="text-white">Fast Delivery:</strong> Orders within Nairobi are typically
            delivered within 1–2 business days. Nationwide delivery takes 2–5 business days depending
            on location.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">2. Shipping Rates</h2>
          <h3 className="text-white font-semibold mb-1">2.1 Within Nairobi</h3>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Standard Delivery: KSh 300 (1–2 business days)</li>
            <li>FREE Delivery: On orders above KSh 10,000</li>
          </ul>
          <h3 className="text-white font-semibold mb-1">2.2 Outside Nairobi</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Major Towns: KSh 350 (Mombasa, Kisumu, Nakuru, Eldoret, Thika)</li>
            <li>Other Locations: KSh 400–600 depending on distance</li>
            <li>FREE Delivery: On orders above KSh 10,000 nationwide</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">3. Order Processing Time</h2>
          <p className="mb-2">Orders are processed within:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-white">Weekdays (Mon–Fri):</strong> Orders placed before 2 PM are processed the same day</li>
            <li><strong className="text-white">Weekends (Sat–Sun):</strong> Orders placed on weekends are processed on Monday</li>
            <li><strong className="text-white">Public Holidays:</strong> No processing; orders resume the next business day</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">4. Delivery Timeline</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 pr-8 text-white font-semibold">Location</th>
                  <th className="text-left py-2 text-white font-semibold">Estimated Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="py-2 pr-8">Nairobi CBD &amp; Suburbs</td><td className="py-2">1–2 business days</td></tr>
                <tr><td className="py-2 pr-8">Mombasa, Kisumu, Nakuru</td><td className="py-2">2–3 business days</td></tr>
                <tr><td className="py-2 pr-8">Other Major Towns</td><td className="py-2">3–4 business days</td></tr>
                <tr><td className="py-2 pr-8">Remote Areas</td><td className="py-2">4–5 business days</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-white/50 text-sm italic">
            Note: Delivery times are estimates and may vary due to unforeseen circumstances such as weather,
            courier delays, or public holidays.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">5. Order Tracking</h2>
          <p className="mb-2">Once your order is dispatched, you&apos;ll receive:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>SMS notification with tracking details</li>
            <li>Email confirmation with courier information</li>
            <li>Tracking number to monitor your delivery</li>
          </ul>
          <p className="mb-2">You can track your order by:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Clicking the tracking link in your email/SMS</li>
            <li>Visiting the courier&apos;s website with your tracking number</li>
            <li>Contacting our customer service for updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">6. Delivery Partners</h2>
          <p className="mb-2">We work with trusted courier services including:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>G4S Courier Services — Nationwide delivery</li>
            <li>Fargo Courier — Express delivery</li>
            <li>Posta Kenya — Standard delivery</li>
            <li>Local delivery partners — For faster Nairobi deliveries</li>
          </ul>
          <p>We select the most appropriate courier based on your location and delivery requirements.</p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">7. Delivery Requirements</h2>
          <p className="mb-2">To ensure successful delivery:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-white">Provide accurate details:</strong> Ensure delivery address and phone number are correct</li>
            <li><strong className="text-white">Be available:</strong> Someone must be present to receive the package</li>
            <li><strong className="text-white">Answer courier calls:</strong> Our courier will call before delivery</li>
            <li><strong className="text-white">Valid ID required:</strong> Be prepared to show ID upon delivery</li>
            <li><strong className="text-white">Inspect package:</strong> Check for any visible damage before signing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">8. Failed Delivery Attempts</h2>
          <p className="mb-2">If delivery fails due to recipient unavailability or incorrect address:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Courier will attempt to contact you via phone</li>
            <li>A second delivery attempt will be scheduled (may incur additional fees)</li>
            <li>After 2 failed attempts, package will be returned to us</li>
            <li>Reshipment fees will apply for returned packages</li>
            <li>You&apos;ll be notified of each failed attempt</li>
          </ul>
          <p className="mb-2">To avoid failed deliveries:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate phone number and address</li>
            <li>Ensure someone is available during delivery hours</li>
            <li>Respond promptly to courier calls</li>
            <li>Provide clear delivery instructions if needed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">9. Delivery Restrictions</h2>
          <h3 className="text-white font-semibold mb-1">9.1 P.O. Box Deliveries</h3>
          <p className="mb-3">
            Unfortunately, we cannot deliver to P.O. Boxes. Please provide a physical street address
            for delivery.
          </p>
          <h3 className="text-white font-semibold mb-1">9.2 Remote or High-Risk Areas</h3>
          <p className="mb-2">We may be unable to deliver to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Areas deemed unsafe by our courier partners</li>
            <li>Extremely remote locations with no courier access</li>
            <li>Military or restricted zones</li>
          </ul>
          <p>
            We&apos;ll notify you during checkout if your area is unserviceable and offer alternative
            solutions such as pickup from the nearest collection point.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">10. International Shipping</h2>
          <p className="mb-2">
            Currently, we only ship within Kenya. We&apos;re working on expanding to East Africa soon!
          </p>
          <p className="mb-2">
            Subscribe to our newsletter to be notified when international shipping becomes available.
            We plan to expand to:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Uganda</li>
            <li>Tanzania</li>
            <li>Rwanda</li>
            <li>Other East African countries</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">11. Damaged or Lost Packages</h2>
          <h3 className="text-white font-semibold mb-1">11.1 Damaged Packages</h3>
          <p className="mb-2">If your package arrives damaged:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Do not accept delivery if damage is visible</li>
            <li>Take photos of the damaged package</li>
            <li>Contact us within 48 hours of delivery</li>
            <li>Provide: Order number, photos of damage, description</li>
            <li>We&apos;ll arrange: Free replacement or full refund</li>
          </ul>
          <h3 className="text-white font-semibold mb-1">11.2 Lost Packages</h3>
          <p className="mb-2">If your package doesn&apos;t arrive within the estimated delivery time:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Wait 2 business days beyond estimated delivery</li>
            <li>Contact us with your order number and tracking details</li>
            <li>We&apos;ll investigate with the courier immediately</li>
            <li>If lost, we&apos;ll send a replacement or issue a full refund</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">12. Shipping During Peak Periods</h2>
          <p className="mb-2">During high-demand periods (holidays, sales events), please note:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Processing times may be extended by 1–2 business days</li>
            <li>Delivery times may be longer than usual</li>
            <li>We&apos;ll notify you of any delays</li>
            <li>Order early to ensure timely delivery</li>
          </ul>
          <p className="mb-2">Peak periods include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Christmas and New Year season (December)</li>
            <li>Black Friday sales (November)</li>
            <li>Easter holidays</li>
            <li>Back-to-school season (January, May, September)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">13. Delivery Signature Requirements</h2>
          <p className="mb-2">For security purposes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>All deliveries require a signature upon receipt</li>
            <li>Valid ID (National ID, Passport, or Driver&apos;s License) may be required</li>
            <li>Someone 18+ years must be present to receive the package</li>
            <li>Courier will not leave packages unattended</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">14. Special Delivery Instructions</h2>
          <p className="mb-2">
            You can provide special delivery instructions during checkout, such as:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Gate codes or access information</li>
            <li>Preferred delivery time windows</li>
            <li>Alternative contact person</li>
            <li>Specific landmarks or directions</li>
          </ul>
          <p className="text-white/50 text-sm italic">
            Note: We cannot guarantee adherence to time-specific requests, but we&apos;ll do our best
            to accommodate.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">15. Packaging Standards</h2>
          <p className="mb-2">We take great care in packaging your products:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-white">Protective materials:</strong> Bubble wrap, padding, and secure boxes</li>
            <li><strong className="text-white">Sealed packaging:</strong> All products arrive sealed in original manufacturer packaging</li>
            <li><strong className="text-white">Branded boxes:</strong> Naire Scents branded packaging for easy identification</li>
            <li><strong className="text-white">Weather protection:</strong> Waterproof wrapping for protection during transit</li>
            <li><strong className="text-white">Discreet packaging:</strong> No external indication of contents</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">16. Multiple Item Orders</h2>
          <p className="mb-2">If you order multiple items:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>All items are typically shipped together in one package</li>
            <li>If items are from different warehouses, they may arrive separately</li>
            <li>You&apos;ll be notified if split shipment is necessary</li>
            <li>No additional shipping charges for split shipments</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">17. Change of Delivery Address</h2>
          <p className="mb-2">To change your delivery address:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li><strong className="text-white">Before dispatch:</strong> Contact us immediately — we can update the address at no extra cost</li>
            <li><strong className="text-white">After dispatch:</strong> Contact both us and the courier — address changes may incur fees</li>
            <li>Provide: Order number and new delivery address</li>
          </ul>
          <p>
            We cannot guarantee address changes after dispatch, but we&apos;ll do our best to assist.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">18. Delivery Confirmation</h2>
          <p className="mb-2">Once your order is delivered:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You&apos;ll receive SMS/email confirmation of delivery</li>
            <li>The courier obtains your signature as proof of delivery</li>
            <li>Tracking status updates to &ldquo;Delivered&rdquo;</li>
            <li>Risk and responsibility transfer to you upon delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">19. Contact for Shipping Queries</h2>
          <p className="mb-3">For questions about your delivery or shipping:</p>
          <div className="space-y-1">
            <p className="text-white font-semibold">Naire Scents Customer Service</p>
            <p>WhatsApp: <a href="https://wa.me/254702129226" className="text-[#C9A96E] underline">+254 702 129226</a> <span className="text-white/40 text-xs">(Fastest response)</span></p>
            <p>Email: <a href="mailto:nairescents@gmail.com" className="text-[#C9A96E] underline">nairescents@gmail.com</a></p>
            <p>Phone: <a href="tel:+254702129226" className="text-[#C9A96E] underline">+254 702 129226</a></p>
            <p>Business Hours: Monday – Friday, 9:00 AM – 6:00 PM EAT</p>
            <p>Response Time: We aim to respond within 2–4 hours during business hours</p>
          </div>
        </section>

        {/* Centered closing statement */}
        <p className="text-center text-white/60 text-sm pt-4 border-t border-white/10 italic">
          We&apos;re committed to getting your orders to you quickly and safely!
        </p>

      </div>
    </PolicyShell>
  );
}
