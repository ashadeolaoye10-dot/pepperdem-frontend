import { useCallback, useEffect, useState } from "react";
import { Lock, LogOut, MessageCircle, Phone, RefreshCw } from "lucide-react";
import { RESTAURANT } from "../config";
import { toIntl } from "../utils/whatsapp";

import { API } from "../api";
const naira = (n) => `₦${n.toLocaleString()}`;

const STATUSES = [
  { value: "PENDING", label: "New" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "OUT_FOR_DELIVERY", label: "On the way" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const labelOf = (value) => STATUSES.find((s) => s.value === value)?.label ?? value;
const toDate = (value) => new Date(typeof value === "number" ? value * 1000 : value);

function customerMessage(order) {
  const ref = order.id.slice(-6).toUpperCase();
  const lines = {
    CONFIRMED: `we have confirmed your order #${ref}.`,
    PREPARING: `your order #${ref} is being prepared.`,
    OUT_FOR_DELIVERY: `your order #${ref} is on its way to you.`,
    DELIVERED: `your order #${ref} has been delivered. Enjoy your meal!`,
    CANCELLED: `we are sorry, your order #${ref} has been cancelled.`,
  };
  const body = lines[order.status] ?? `we received your order #${ref}.`;
  return `Hello ${order.customerName}, ${RESTAURANT.name} here: ${body}`;
}

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem("pdk-admin") || "");
  const [input, setInput] = useState("");
  const [state, setState] = useState(key ? "loading" : "login");
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");

  const load = useCallback(async (adminKey) => {
    try {
      const res = await fetch(`${API}/api/admin/orders`, {
        headers: { "X-Admin-Key": adminKey },
      });
      if (res.status === 401) {
        sessionStorage.removeItem("pdk-admin");
        setKey("");
        setState("login");
        setError("Wrong admin key. Please try again.");
        return;
      }
      if (!res.ok) throw new Error("Could not load orders.");
      setOrders(await res.json());
      setState("ready");
      setError("");
    } catch {
      setState((s) => (s === "ready" ? s : "login"));
      setError("Can't reach the backend. Is it running?");
    }
  }, []);

  useEffect(() => {
    if (!key) return;
    load(key);
    const timer = setInterval(() => load(key), 30000);
    return () => clearInterval(timer);
  }, [key, load]);

  const signIn = (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    sessionStorage.setItem("pdk-admin", value);
    setError("");
    setState("loading");
    setKey(value);
  };

  const signOut = () => {
    sessionStorage.removeItem("pdk-admin");
    setKey("");
    setInput("");
    setOrders([]);
    setState("login");
  };

  const changeStatus = async (order, status) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    try {
      const res = await fetch(
        `${API}/api/admin/orders/${order.id}/status?status=${status}`,
        { method: "PATCH", headers: { "X-Admin-Key": key } }
      );
      if (!res.ok) throw new Error();
    } catch {
      setError("Couldn't update that order. Please try again.");
      load(key);
    }
  };

  if (state === "login") {
    return (
      <section className="admin">
        <div className="container">
          <form className="login" onSubmit={signIn}>
            <span className="login__icon">
              <Lock size={26} />
            </span>
            <h2>Kitchen login</h2>
            <p>Enter your admin key to see incoming orders.</p>
            <input
              type="password"
              placeholder="Admin key"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            {error && <small>{error}</small>}
            <button className="btn btn-primary" type="submit">
              Open orders
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (state === "loading") {
    return (
      <section className="admin">
        <div className="container">
          <div className="state">
            <h3>Loading orders...</h3>
          </div>
        </div>
      </section>
    );
  }

  const today = new Date().toDateString();
  const todays = orders.filter((o) => toDate(o.createdAt).toDateString() === today);
  const sales = todays
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);
  const newCount = orders.filter((o) => o.status === "PENDING").length;
  const visible = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <section className="admin">
      <div className="container">
        <div className="admin__bar">
          <div>
            <h2>
              Incoming <em>Orders</em>
            </h2>
            <p>Updates every 30 seconds.</p>
          </div>
          <div className="admin__actions">
            <button className="btn btn-outline" onClick={() => load(key)}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button className="btn btn-outline" onClick={signOut}>
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>

        <div className="stats">
          <div className="stat stat--hot">
            <span>New orders</span>
            <strong>{newCount}</strong>
          </div>
          <div className="stat">
            <span>Orders today</span>
            <strong>{todays.length}</strong>
          </div>
          <div className="stat">
            <span>Sales today</span>
            <strong>{naira(sales)}</strong>
          </div>
          <div className="stat">
            <span>All orders</span>
            <strong>{orders.length}</strong>
          </div>
        </div>

        {error && <p className="admin__error">{error}</p>}

        <div className="tabs" style={{ marginBottom: 22 }}>
          {[{ value: "ALL", label: "All" }, ...STATUSES].map((s) => (
            <button
              key={s.value}
              className={filter === s.value ? "tab is-active" : "tab"}
              onClick={() => setFilter(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="state">
            <h3>No orders here yet</h3>
            <p>New orders will show up as soon as customers place them.</p>
          </div>
        ) : (
          <div className="orders">
            {visible.map((order) => {
              const ref = order.id.slice(-6).toUpperCase();
              return (
                <article className="order" key={order.id}>
                  <div className="order__head">
                    <div>
                      <strong className="order__ref">#{ref}</strong>
                      <span>
                        {toDate(order.createdAt).toLocaleString("en-NG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <span className={`status status--${order.status.toLowerCase()}`}>
                      {labelOf(order.status)}
                    </span>
                  </div>

                  <div className="order__grid">
                    <div>
                      <h4>Customer</h4>
                      <p>
                        <strong>{order.customerName}</strong>
                      </p>
                      <p>{order.phone}</p>
                      <p>
                        {order.address}, {order.area}
                      </p>
                      {order.note && <p className="order__note">Note: {order.note}</p>}
                    </div>

                    <div>
                      <h4>Items</h4>
                      <ul>
                        {order.items.map((i) => (
                          <li key={i.menuItemId}>
                            <span>
                              {i.qty} × {i.name}
                            </span>
                            <b>{naira(i.price * i.qty)}</b>
                          </li>
                        ))}
                        <li>
                          <span>Delivery ({order.area})</span>
                          <b>{naira(order.deliveryFee)}</b>
                        </li>
                        <li className="order__total">
                          <span>Total</span>
                          <b>{naira(order.total)}</b>
                        </li>
                      </ul>
                      <p className="order__pay">
                        {order.paymentMethod === "BANK_TRANSFER"
                          ? "Bank transfer"
                          : "Pay on delivery"}
                      </p>
                    </div>
                  </div>

                  <div className="order__foot">
                    <select
                      value={order.status}
                      onChange={(e) => changeStatus(order, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <a className="btn btn-outline" href={`tel:${order.phone}`}>
                      <Phone size={16} /> Call
                    </a>
                    <a
                      className="btn btn-green"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://wa.me/${toIntl(order.phone)}?text=${encodeURIComponent(
                        customerMessage(order)
                      )}`}
                    >
                      <MessageCircle size={16} /> WhatsApp customer
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}