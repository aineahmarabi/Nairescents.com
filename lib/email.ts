import nodemailer from "nodemailer";

const ADMIN_EMAIL = "nairescents@gmail.com";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("Gmail credentials not configured (GMAIL_USER / GMAIL_APP_PASSWORD)");
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

export interface OrderEmailData {
  orderNumber?: string;
  customer: { name: string; email: string; phone?: string };
  items: Array<{ title: string; quantity: number; price: number }>;
  shippingAddress?: string;
  shippingZoneName?: string;
  subtotal: number;
  shippingFee?: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
}

export async function sendOrderEmail(
  order: OrderEmailData,
  trigger: "new_order" | "fulfilled" = "new_order"
) {
  const subject =
    trigger === "new_order"
      ? `🛒 New Order${order.orderNumber ? ` ${order.orderNumber}` : ""} — ${order.customer.name}`
      : `✅ Order${order.orderNumber ? ` ${order.orderNumber}` : ""} Fulfilled — ${order.customer.name}`;

  const shippingFee = order.shippingFee ?? order.total - order.subtotal;
  const itemLines = order.items
    .map(
      (i) =>
        `  • ${i.title} × ${i.quantity}  @  KES ${i.price.toLocaleString()}  =  KES ${(i.quantity * i.price).toLocaleString()}`
    )
    .join("\n");

  const text = [
    trigger === "new_order" ? "NEW ORDER RECEIVED" : "ORDER FULFILLED",
    "=".repeat(44),
    "",
    `Order:     ${order.orderNumber ?? "(new)"}`,
    `Payment:   ${order.paymentStatus ?? "—"}  |  ${order.paymentMethod ?? "—"}`,
    `Fulfil:    ${order.fulfillmentStatus ?? "—"}`,
    "",
    "CUSTOMER",
    "--------",
    `Name:      ${order.customer.name}`,
    `Email:     ${order.customer.email}`,
    `Phone:     ${order.customer.phone ?? "—"}`,
    "",
    "DELIVERY",
    "--------",
    order.shippingAddress ?? "—",
    order.shippingZoneName ? `Zone: ${order.shippingZoneName}` : "",
    "",
    "ITEMS",
    "-----",
    itemLines,
    "",
    "TOTALS",
    "------",
    `Subtotal:  KES ${order.subtotal.toLocaleString()}`,
    `Shipping:  ${shippingFee === 0 ? "FREE" : `KES ${shippingFee.toLocaleString()}`}`,
    `TOTAL:     KES ${order.total.toLocaleString()}`,
    "",
    "=".repeat(44),
    "Naire Scents Admin Notifications",
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  await getTransporter().sendMail({
    from: `"Naire Scents Notifications" <${process.env.GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject,
    text,
  });
}

export interface MessageEmailData {
  name: string;
  email: string;
  phone?: string;
  comment: string;
}

export async function sendMessageEmail(msg: MessageEmailData) {
  const text = [
    "NEW CONTACT MESSAGE",
    "=".repeat(44),
    "",
    `From:   ${msg.name}`,
    `Email:  ${msg.email}`,
    `Phone:  ${msg.phone ?? "—"}`,
    "",
    "MESSAGE",
    "-------",
    msg.comment,
    "",
    "=".repeat(44),
    "Naire Scents Admin Notifications",
  ].join("\n");

  await getTransporter().sendMail({
    from: `"Naire Scents Notifications" <${process.env.GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `📩 New Message from ${msg.name}`,
    text,
  });
}
