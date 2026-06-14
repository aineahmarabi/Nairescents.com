import PolicyShell from "@/components/layout/PolicyShell";

export const metadata = { title: "Refund & Returns Policy – Scents by Naire" };

export default function RefundPolicyPage() {
  return (
    <PolicyShell>
      {/* Centered header */}
      <div className="text-center mb-10">
        <h1 className="text-[#C9A96E] text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Refund &amp; Returns Policy
        </h1>
        <p className="text-white/60 text-base mb-1">Your satisfaction is our priority</p>
        <p className="text-white/40 text-sm">Last Updated: January 5, 2026</p>
      </div>

      <div className="space-y-8 text-white/75 leading-relaxed text-[15px]">

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">1. Our Commitment</h2>
          <p className="mb-2">
            At Naire Scents, we stand behind the quality of our products. If you&apos;re not completely
            satisfied with your purchase, we&apos;re here to help.
          </p>
          <p className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm">
            <strong className="text-white">30-Day Return Window:</strong> You have 30 days from the date of delivery to return eligible items for a refund or exchange.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">2. Eligibility for Returns</h2>

          <h3 className="text-white font-semibold mb-1">2.1 Items Eligible for Return</h3>
          <p className="mb-2">We accept returns on:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Unopened products in original packaging with seals intact</li>
            <li>Products with manufacturing defects or quality issues</li>
            <li>Wrong items delivered (items different from what you ordered)</li>
            <li>Damaged products received during shipping</li>
            <li>Products past expiry date upon delivery (though this is extremely rare)</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">2.2 Items NOT Eligible for Return</h3>
          <p className="mb-2">For health, hygiene, and safety reasons, we cannot accept returns on:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Opened or used products (unless defective)</li>
            <li>Products with broken seals or tampered packaging</li>
            <li>Products without original packaging or labels</li>
            <li>Products purchased more than 30 days ago</li>
            <li>Products on final sale or clearance (unless defective)</li>
            <li>Products damaged due to misuse or improper storage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">3. Return Process</h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E] text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-white font-semibold mb-1">Contact Us</p>
                <p className="mb-1">Within 30 days of receiving your order, contact us via:</p>
                <ul className="list-disc pl-6 space-y-0.5">
                  <li>WhatsApp: <a href="https://wa.me/254141445422" className="text-[#C9A96E] underline">+254 141 445422</a> <span className="text-white/40 text-xs">(Fastest response)</span></li>
                  <li>Email: <a href="mailto:nairescents@gmail.com" className="text-[#C9A96E] underline">nairescents@gmail.com</a></li>
                  <li>Phone: <a href="tel:+254141445422" className="text-[#C9A96E] underline">+254 141 445422</a></li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E] text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-white font-semibold mb-1">Provide Details</p>
                <p className="mb-1">Include in your return request:</p>
                <ul className="list-disc pl-6 space-y-0.5">
                  <li>Order number (found in your confirmation email)</li>
                  <li>Product(s) you wish to return with item names</li>
                  <li>Reason for return (defective, wrong item, changed mind, etc.)</li>
                  <li>Photos (if product is defective, damaged, or wrong item)</li>
                  <li>Preferred resolution (refund, exchange, or store credit)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E] text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="text-white font-semibold mb-1">Return Authorization</p>
                <p className="mb-1">Once approved, we&apos;ll provide:</p>
                <ul className="list-disc pl-6 space-y-0.5">
                  <li>Return authorization number (RMA number)</li>
                  <li>Return shipping instructions</li>
                  <li>Return address details</li>
                  <li>Shipping label (for defective or wrong items)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E] text-xs font-bold flex items-center justify-center">4</span>
              <div>
                <p className="text-white font-semibold mb-1">Ship the Item</p>
                <p className="mb-2">Package the item securely and ship to:</p>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm mb-2">
                  <p className="text-white">Naire Scents Returns Department</p>
                  <p>Stanbank House Shop A604</p>
                  <p>Wing A, 6th Floor</p>
                  <p>Nairobi, Kenya</p>
                </div>
                <p className="mb-1 text-white/50 text-sm italic">Important packing instructions:</p>
                <ul className="list-disc pl-6 space-y-0.5 text-sm">
                  <li>Include your RMA number inside the package</li>
                  <li>Use adequate padding to prevent damage during transit</li>
                  <li>Include a copy of your order confirmation or invoice</li>
                  <li>Remove or cover any existing shipping labels</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E] text-xs font-bold flex items-center justify-center">5</span>
              <div>
                <p className="text-white font-semibold mb-1">Refund Processing</p>
                <p className="mb-1">Once we receive and inspect your return:</p>
                <ul className="list-disc pl-6 space-y-0.5">
                  <li>Inspection: 2–3 business days</li>
                  <li>Approval notification: Via email/SMS</li>
                  <li>Refund processing: 5–7 business days</li>
                  <li>You&apos;ll receive: Email confirmation with refund details</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">4. Refund Methods</h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-white font-semibold mb-1">4.1 M-Pesa Payments</h3>
              <ul className="list-disc pl-6 space-y-0.5">
                <li>Refunded directly to your M-Pesa account</li>
                <li>Processing time: 3–5 business days after approval</li>
                <li>You&apos;ll receive M-Pesa confirmation message</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">4.2 Card Payments (Visa/Mastercard)</h3>
              <ul className="list-disc pl-6 space-y-0.5">
                <li>Refunded to your original card</li>
                <li>Processing time: 5–10 business days (depending on your bank)</li>
                <li>Refund appears on your bank statement</li>
                <li>Contact your bank if not received after 10 business days</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">4.3 Bank Transfer</h3>
              <ul className="list-disc pl-6 space-y-0.5">
                <li>If original payment method unavailable</li>
                <li>Provide your bank account details</li>
                <li>Processing time: 5–7 business days</li>
                <li>Bank details required: Account name, number, bank name, branch</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">4.4 Store Credit</h3>
              <ul className="list-disc pl-6 space-y-0.5">
                <li>Instant credit to your Naire Scents account</li>
                <li>No expiry date on store credits</li>
                <li>Can be used on any future purchase</li>
                <li>Faster than cash refunds</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">5. Return Shipping Costs</h2>

          <h3 className="text-white font-semibold mb-1">5.1 Defective, Damaged, or Wrong Items</h3>
          <p className="mb-2">If we sent you a defective, damaged, or wrong item:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>We cover all return shipping costs</li>
            <li>We&apos;ll arrange courier pickup at no charge to you</li>
            <li>We&apos;ll provide a prepaid shipping label</li>
            <li>No cost to you whatsoever</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">5.2 Change of Mind or Other Reasons</h3>
          <p className="mb-2">If you&apos;re returning for other reasons (change of mind, ordered wrong product, etc.):</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Customer is responsible for return shipping</li>
            <li>We recommend using a trackable shipping method</li>
            <li>Keep your shipping receipt as proof of return</li>
            <li>Typical cost: KSh 200–400 depending on courier and location</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">6. Exchanges</h2>
          <p className="mb-2">
            We currently don&apos;t offer direct product exchanges. If you need a different product:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-2">
            <li>Return the original item following our return process</li>
            <li>Receive your refund (typically 5–7 business days)</li>
            <li>Place a new order for the desired item</li>
          </ul>
          <p className="text-white/50 text-sm italic">
            This ensures you get the product you want as quickly as possible without waiting for the exchange process.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">7. Damaged or Defective Products</h2>

          <h3 className="text-white font-semibold mb-1">7.1 Report Within 48 Hours</h3>
          <p className="mb-2">If you receive a damaged or defective product:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Contact us immediately (within 48 hours of delivery)</li>
            <li>Provide clear photos showing the damage/defect</li>
            <li>Include your order number</li>
            <li>Describe the issue in detail</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">7.2 Resolution Options</h3>
          <p className="mb-2">We&apos;ll offer one of the following (your choice):</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Full refund to your original payment method</li>
            <li>Free replacement product shipped immediately</li>
            <li>Store credit for the full amount</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">7.3 No Return Required for Some Defects</h3>
          <p className="mb-2">For minor defects or issues, we may:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Offer a partial refund while you keep the product</li>
            <li>Provide a discount code for future purchase</li>
            <li>Issue store credit without requiring a return</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">8. Cancellations</h2>

          <h3 className="text-white font-semibold mb-1">8.1 Before Shipment</h3>
          <p className="mb-2">If you need to cancel your order:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Contact us immediately via WhatsApp, email, or phone</li>
            <li>Provide your order number</li>
            <li>If order hasn&apos;t been processed: Full refund issued within 3–5 business days</li>
            <li>If already processed but not shipped: We&apos;ll try to stop the shipment</li>
          </ul>

          <h3 className="text-white font-semibold mb-1">8.2 After Shipment</h3>
          <p className="mb-2">Once your order has been shipped:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cannot cancel the order</li>
            <li>Wait to receive the package</li>
            <li>Follow our standard return process (see Section 3)</li>
            <li>Return shipping fees may apply unless product is defective</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">9. Partial Returns</h2>
          <p className="mb-2">If you ordered multiple items and want to return only some:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You can return individual items from your order</li>
            <li>Partial refund will be processed for returned items only</li>
            <li>Original shipping fee is non-refundable (except for defective/wrong items)</li>
            <li>Follow the same return process for each item</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">10. Store Credit</h2>
          <p className="mb-3">Instead of a cash refund, you can opt for store credit:</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white font-semibold mb-2">Benefits of Store Credit</p>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Instant processing — no waiting for bank transfers</li>
                <li>Full value retained — use for any future purchase</li>
                <li>No expiry date — use whenever you&apos;re ready</li>
                <li>Easy to apply — automatically at checkout</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white font-semibold mb-2">How to Use Store Credit</p>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Credit is added to your Naire Scents account</li>
                <li>Automatically applied at checkout</li>
                <li>Can be combined with other promotions</li>
                <li>Check your balance in your account dashboard</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">11. Non-Refundable Items and Fees</h2>
          <p className="mb-2">The following cannot be refunded:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Shipping fees (except for defective/wrong items sent by us)</li>
            <li>Gift cards or promotional credits</li>
            <li>Products damaged due to misuse or improper care</li>
            <li>Products opened and used (unless defective)</li>
            <li>Sale or clearance items (unless defective)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">12. Refund Timeline Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 pr-8 text-white font-semibold">Stage</th>
                  <th className="text-left py-2 text-white font-semibold">Timeframe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="py-2 pr-8">Return Request Approval</td><td className="py-2">1–2 business days</td></tr>
                <tr><td className="py-2 pr-8">Item Received &amp; Inspected</td><td className="py-2">2–3 business days</td></tr>
                <tr><td className="py-2 pr-8">Refund Processing</td><td className="py-2">5–7 business days</td></tr>
                <tr><td className="py-2 pr-8">Bank/M-Pesa Reflection</td><td className="py-2">3–10 business days</td></tr>
                <tr className="border-t border-white/20"><td className="py-2 pr-8 text-white font-semibold">Total Time</td><td className="py-2 text-white font-semibold">11–22 business days</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-2">13. Quality Guarantee</h2>
          <p className="mb-2">We guarantee that all Naire Scents products:</p>
          <ul className="list-disc pl-6 space-y-1 mb-2">
            <li>Are 100% authentic and genuine</li>
            <li>Are within their expiry dates</li>
            <li>Have been stored properly</li>
            <li>Meet all quality standards</li>
          </ul>
          <p className="text-white/50 text-sm italic">
            If you&apos;re unsatisfied with product quality, we&apos;ll make it right — no questions asked.
          </p>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">14. Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I return a product if I just don't like it?",
                a: "Yes, as long as the product is unopened and in original packaging, you can return it within 30 days. Return shipping costs apply for change-of-mind returns."
              },
              {
                q: "What if I lost my receipt/order confirmation?",
                a: "No problem! Provide your order number, email, or phone number used for the order. We can look up your purchase in our system."
              },
              {
                q: "Can I return a product purchased during a sale?",
                a: "Yes, our return policy applies to all products, including sale items. However, you'll be refunded the sale price you paid, not the original price."
              },
              {
                q: "How do I know if my return has been received?",
                a: "We'll send you an email/SMS confirmation once we receive your return. You can also track your return shipment using the courier's tracking number."
              },
              {
                q: "Can I exchange one product for another?",
                a: "We don't offer direct exchanges. Return the item for a refund, then place a new order for the product you want. This is actually faster than waiting for an exchange!"
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-white/5 pb-4">
                <p className="text-white font-semibold mb-1">Q: {q}</p>
                <p>A: {a}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[#C9A96E] text-lg font-semibold mb-3">15. Contact Customer Care</h2>
          <p className="mb-3">Questions about returns or refunds? We&apos;re here to help!</p>
          <div className="space-y-1">
            <p className="text-white font-semibold">Naire Scents Customer Service</p>
            <p>WhatsApp: <a href="https://wa.me/254141445422" className="text-[#C9A96E] underline">+254 141 445422</a> <span className="text-white/40 text-xs">(Fastest response — available 24/7)</span></p>
            <p>Email: <a href="mailto:nairescents@gmail.com" className="text-[#C9A96E] underline">nairescents@gmail.com</a></p>
            <p>Phone: <a href="tel:+254141445422" className="text-[#C9A96E] underline">+254 141 445422</a></p>
            <p>Business Hours: Monday – Friday, 9:00 AM – 6:00 PM EAT</p>
            <p className="text-white/50 text-sm">Response Time: We aim to respond to all return requests within 24 hours</p>
          </div>
        </section>

        {/* Centered closing */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2">
          <p className="text-white/60 text-sm italic">
            Your Satisfaction Matters: We&apos;re committed to making your shopping experience wonderful.
            If something isn&apos;t right, we&apos;ll fix it quickly and fairly. Your happiness is our success!
          </p>
          <p className="text-white/40 text-sm">
            Thank you for choosing Naire Scents. We appreciate your trust in us!
          </p>
        </div>

      </div>
    </PolicyShell>
  );
}
