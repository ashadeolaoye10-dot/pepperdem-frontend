import { RESTAURANT } from "../config";

const naira = (n) => `₦${n.toLocaleString()}`;

// 08012345678 -> 2348012345678
export function toIntl(phone) {
  const p = phone.replace(/[\s-]/g, "");
  if (p.startsWith("+")) return p.slice(1);
  if (p.startsWith("0")) return `234${p.slice(1)}`;
  return p;
}

export function orderToOwnerLink(order) {
  const ref = order.id.slice(-6).toUpperCase();
  const items = order.items
    .map((i) => `- ${i.qty} x ${i.name} (${naira(i.price * i.qty)})`)
    .join("\n");
  const payment = order.paymentMethod === "BANK_TRANSFER" ? "Bank transfer" : "Pay on delivery";

  const confirmation =
    `Hello ${order.customerName}, this is ${RESTAURANT.name}. We have received your order #${ref} (${naira(order.total)}). ` +
    (order.paymentMethod === "BANK_TRANSFER"
      ? `Please transfer to ${RESTAURANT.bank.bankName}, ${RESTAURANT.bank.accountNumber} (${RESTAURANT.bank.accountName}) and send us the proof. `
      : "Please have your payment ready on delivery. ") +
    "Your food is being prepared. Thank you!";

  const text = [
    `NEW ORDER #${ref}`,
    "",
    `Name: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Area: ${order.area}`,
    `Address: ${order.address}`,
    order.note ? `Note: ${order.note}` : null,
    "",
    items,
    "",
    `Subtotal: ${naira(order.subtotal)}`,
    `Delivery: ${naira(order.deliveryFee)}`,
    `TOTAL: ${naira(order.total)}`,
    `Payment: ${payment}`,
    "",
    "Tap to confirm to customer:",
    `https://wa.me/${toIntl(order.phone)}?text=${encodeURIComponent(confirmation)}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(text)}`;
}