import { useEffect, useState } from "react";
import { Check, Clock, LifeBuoy, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { RESTAURANT } from "../config";

import { API } from "../api";
const naira = (n) => `₦${n.toLocaleString()}`;
const wa = (text) => `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(text)}`;

const emptyForm = { name: "", replyTo: "", subject: "", message: "" };

export default function Contact() {
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    fetch(`${API}/api/delivery-zones`)
      .then((res) => res.json())
      .then(setZones)
      .catch(() => setZones([]));
  }, []);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (status !== "idle") setStatus("idle");
  };

  const ready =
    form.name.trim() && form.replyTo.trim() && form.message.trim().length >= 5;

  const send = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setStatus("sending");
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          replyTo: form.replyTo.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setForm(emptyForm);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="contact">
      <div className="container">
        <header className="contact__head">
          <span className="story__icon">
            <MessageCircle size={24} />
          </span>
          <h2>
            Let's <em>Connect</em>
          </h2>
          <p>
            Questions about the menu, your order, or a party? We'd love to hear from you.
          </p>
        </header>

        <div className="contact__grid">
          <div className="contact__left">
            <a
              className="info-card"
              href={wa("Hello Pepper Dem Kitchen, I have a question.")}
              target="_blank"
              rel="noreferrer"
            >
              <span className="info-card__icon info-card__icon--green">
                <MessageCircle size={22} />
              </span>
              <div>
                <h4>WhatsApp us</h4>
                <p>Fastest way to reach us</p>
              </div>
            </a>

            <a className="info-card" href={`tel:${RESTAURANT.phone}`}>
              <span className="info-card__icon">
                <Phone size={22} />
              </span>
              <div>
                <h4>Call us</h4>
                <p>{RESTAURANT.phone}</p>
              </div>
            </a>

            <a className="info-card" href={`mailto:${RESTAURANT.email}`}>
              <span className="info-card__icon info-card__icon--gold">
                <Mail size={22} />
              </span>
              <div>
                <h4>Email us</h4>
                <p>{RESTAURANT.email}</p>
              </div>
            </a>

            <div className="info-card info-card--static">
              <span className="info-card__icon info-card__icon--gold">
                <Clock size={22} />
              </span>
              <div style={{ flex: 1 }}>
                <h4>Opening hours</h4>
                {RESTAURANT.hours.map((h) => (
                  <p className="hours" key={h.days}>
                    <span>{h.days}</span>
                    <b>{h.time}</b>
                  </p>
                ))}
              </div>
            </div>

            <div className="issue">
              <LifeBuoy size={26} />
              <h3>Problem with your order?</h3>
              <p>Message us on WhatsApp and we'll sort it out quickly.</p>
              <a
                className="btn issue__btn"
                href={wa("Hello Pepper Dem Kitchen, I have a problem with my order.")}
                target="_blank"
                rel="noreferrer"
              >
                Report an issue
              </a>
            </div>
          </div>

          <div className="contact__right">
            <div className="panel">
              <div className="areas__head">
                <MapPin size={20} />
                <h3>Where we deliver</h3>
              </div>
              {RESTAURANT.address && <p className="areas__address">{RESTAURANT.address}</p>}
              <div className="areas">
                {zones.map((z) => (
                  <span className="area-chip" key={z.id}>
                    {z.area} <b>{naira(z.fee)}</b>
                  </span>
                ))}
                {zones.length === 0 && (
                  <p className="areas__address">Delivery areas will show here.</p>
                )}
              </div>
            </div>

            <form className="panel" onSubmit={send}>
              <h3>Send us a message</h3>

              {status === "sent" ? (
                <div className="sent">
                  <span className="success__icon" style={{ width: 56, height: 56 }}>
                    <Check size={26} />
                  </span>
                  <h4>Message sent!</h4>
                  <p>Thank you. We'll get back to you as soon as we can.</p>
                  <button type="button" className="btn btn-outline" onClick={() => setStatus("idle")}>
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-grid">
                    <label className="field">
                      <span>Your name</span>
                      <input value={form.name} onChange={set("name")} placeholder="Your name" />
                    </label>
                    <label className="field">
                      <span>Phone or email</span>
                      <input
                        value={form.replyTo}
                        onChange={set("replyTo")}
                        placeholder="How can we reply?"
                      />
                    </label>
                    <label className="field field--full">
                      <span>Subject (optional)</span>
                      <input
                        value={form.subject}
                        onChange={set("subject")}
                        placeholder="How can we help you?"
                      />
                    </label>
                    <label className="field field--full">
                      <span>Message</span>
                      <textarea
                        value={form.message}
                        onChange={set("message")}
                        placeholder="Write your message here..."
                      />
                    </label>
                  </div>

                  {status === "error" && (
                    <p className="summary__error" style={{ color: "var(--pepper-dark)", background: "rgba(217,58,28,0.12)" }}>
                      We couldn't send your message. Please try again or message us on WhatsApp.
                    </p>
                  )}

                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={!ready || status === "sending"}
                    style={{ marginTop: 18 }}
                  >
                    <Send size={18} /> {status === "sending" ? "Sending..." : "Send message"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}