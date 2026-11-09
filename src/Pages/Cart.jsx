import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  Check,
  Landmark,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import BankDetails from "../components/BankDetails";
import { orderToOwnerLink } from "../utils/whatsapp";


const naira = (n) => `₦${n.toLocaleString()}`;
const cleanPhone = (p) => p.replace(/\s/g, "");
const phoneOk = (p) => /^(\+234|0)\d{10}$/.test(cleanPhone(p));

export default function Cart() {
  const { items, addItem, decrease, removeItem, clearCart, subtotal } = useCart();
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    zoneId: "",
    note: "",
    payment: "PAY_ON_DELIVERY",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/delivery-zones`)
      .then((res) => res.json())
      .then(setZones)
      .catch(() => setError("We couldn't load the delivery areas. Is the backend running?"));
  }, []);

  const zone = zones.find((z) => z.id === form.zoneId);
  const fee = zone ? zone.fee : 0;
  const total = subtotal + fee;
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const ready =
    items.length > 0 &&
    form.name.trim() &&
    phoneOk(form.phone) &&
    form.address.trim() &&
    zone;

  const placeOrder = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name.trim(),
          phone: cleanPhone(form.phone),
          address: form.address.trim(),
          zoneId: form.zoneId,
          note: form.note.trim(),
          paymentMethod: form.payment,
          items: items.map((i) => ({ menuItemId: i.id, qty: i.qty })),
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      const saved = await res.json();
      setOrder(saved);
      clearCart();
    } catch {
      setError("We couldn't place your order. Please check your details and try again.");
    } finally {
      setSending(false);
    }
  };

    if (order) {
    const ref = order.id.slice(-6).toUpperCase();
    return (
      <section className="cart-page">
        <div className="container">
          <div className="success">
            <span className="success__icon">
              <Check size={36} />
            </span>
            <h2>Order received!</h2>
            <p>
              Thank you, {order.customerName}. Your order <strong>#{ref}</strong> is saved
              and heading to the kitchen for {order.area}.
            </p>
            <div className="success__total">
              <span>Total to pay</span>
              <strong>{naira(order.total)}</strong>
            </div>

            {order.paymentMethod === "BANK_TRANSFER" ? (
              <>
                <p className="success__note">
                  Please transfer {naira(order.total)} to the account below, then send us
                  your payment proof on WhatsApp.
                </p>
                <BankDetails />
              </>
            ) : (
              <p className="success__note">Have your payment ready when the rider arrives.</p>
            )}

            <a
              className="btn btn-green wa-btn"
              href={orderToOwnerLink(order)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={20} /> Send order on WhatsApp
            </a>
            <p className="success__hint">
              Tap the button, then press send in WhatsApp so we can confirm your order faster.
            </p>
            <Link to="/menu" className="btn btn-outline">
              Order something else
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <div className="container">
          <div className="state">
            <ShoppingBag size={44} style={{ color: "var(--pepper)" }} />
            <h3 style={{ marginTop: 12 }}>Your cart is empty</h3>
            <p>Add some suya or jollof and come back here.</p>
            <Link to="/menu" className="btn btn-primary" style={{ marginTop: 20 }}>
              Browse the menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="container">
        <Link to="/menu" className="back-link">
          <ArrowLeft size={18} /> Keep shopping
        </Link>
        <h2 className="cart-title">
          Your <em>Cart</em>
        </h2>

        <div className="cart__grid">
          <div className="cart__left">
            <div className="panel">
              <h3>Your items</h3>
              {items.map((item) => (
                <div className="line" key={item.id}>
                  <div className="line__info">
                    <strong>{item.name}</strong>
                    <span>{naira(item.price)} each</span>
                  </div>
                  <div className="qty">
                    <button onClick={() => decrease(item.id)} aria-label="Remove one">
                      <Minus size={15} />
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => addItem(item)} aria-label="Add one">
                      <Plus size={15} />
                    </button>
                  </div>
                  <strong className="line__total">{naira(item.price * item.qty)}</strong>
                  <button
                    className="line__remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="panel">
              <h3>Delivery details</h3>
              <div className="form-grid">
                <label className="field">
                  <span>Full name</span>
                  <input value={form.name} onChange={set("name")} placeholder="e.g. Chinedu Okafor" />
                </label>
                <label className="field">
                  <span>Phone number</span>
                  <input
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="08012345678"
                    inputMode="tel"
                  />
                  {form.phone && !phoneOk(form.phone) && (
                    <small>Use an 11-digit number like 08012345678.</small>
                  )}
                </label>
                <label className="field field--full">
                  <span>Delivery area</span>
                  <select value={form.zoneId} onChange={set("zoneId")}>
                    <option value="">Select your area</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.area} · {naira(z.fee)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field field--full">
                  <span>Full address</span>
                  <input
                    value={form.address}
                    onChange={set("address")}
                    placeholder="House number, street, landmark"
                  />
                </label>
                <label className="field field--full">
                  <span>Note for the kitchen (optional)</span>
                  <input
                    value={form.note}
                    onChange={set("note")}
                    placeholder="Extra pepper, no onions..."
                  />
                </label>
              </div>
            </div>

            <div className="panel">
              <h3>How will you pay?</h3>
              <div className="pay-options">
                <button
                  type="button"
                  className={form.payment === "PAY_ON_DELIVERY" ? "pay is-active" : "pay"}
                  onClick={() => setForm({ ...form, payment: "PAY_ON_DELIVERY" })}
                >
                  <Banknote size={22} />
                  <span>
                    <strong>Pay on delivery</strong>
                    Cash or transfer to the rider
                  </span>
                </button>
                <button
                  type="button"
                  className={form.payment === "BANK_TRANSFER" ? "pay is-active" : "pay"}
                  onClick={() => setForm({ ...form, payment: "BANK_TRANSFER" })}
                >
                  <Landmark size={22} />
                  <span>
                    <strong>Bank transfer</strong>
                    We'll send you the account details
                  </span>
                </button>
              </div>
            </div>
          </div>

          <aside className="summary">
            <h3>Order summary</h3>
            <div className="summary__row">
              <span>Subtotal</span>
              <strong>{naira(subtotal)}</strong>
            </div>
            <div className="summary__row">
              <span>Delivery fee</span>
              <strong>{zone ? naira(fee) : "Pick your area"}</strong>
            </div>
            {zone && (
              <div className="summary__row">
                <span>Arrives in</span>
                <strong>~{zone.estimatedMinutes} mins</strong>
              </div>
            )}
            <div className="summary__total">
              <span>Total</span>
              <strong>{naira(total)}</strong>
            </div>

            {error && <p className="summary__error">{error}</p>}

            <button
              className="btn btn-primary summary__btn"
              disabled={!ready || sending}
              onClick={placeOrder}
            >
              {sending ? "Placing order..." : "Place order"}
            </button>
            {!ready && (
              <p className="summary__hint">
                Fill in your name, phone, area and address to continue.
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}