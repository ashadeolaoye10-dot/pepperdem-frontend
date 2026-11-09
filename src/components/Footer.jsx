import { Link } from "react-router-dom";
import { Bike, Clock, Flame, Mail, MapPin, MessageCircle, Phone, Wallet } from "lucide-react";
import { RESTAURANT } from "../config";

const features = [
  { icon: Bike, title: "Honest delivery fees", text: "See the fee before you order" },
  { icon: Flame, title: "Cooked fresh", text: "Grilled when you order" },
  { icon: Wallet, title: "Budget Mode", text: "Eat within what you have" },
  { icon: MessageCircle, title: "WhatsApp support", text: "We reply fast" },
];

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const social = Object.entries(RESTAURANT.social || {}).filter(([, url]) => url);

  return (
    <footer className="footer">
      <div className="footer__features">
        <div className="container footer__features-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <div className="feature" key={title}>
              <span className="feature__icon">
                <Icon size={20} />
              </span>
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container footer__main">
        <div className="footer__brand">
          <Link to="/" className="brand brand--light">
            <span className="brand__icon">
              <Flame size={20} />
            </span>
            <span>
              Pepper Dem <b>Kitchen</b>
            </span>
          </Link>
          <p>
            Proper Naija street food, cooked fresh and delivered to your door, with the
            delivery fee shown upfront.
          </p>
          {social.length > 0 && (
            <div className="social">
              {social.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noreferrer">
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4>Explore</h4>
          <ul className="footer__list">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Contact us</h4>
          <ul className="footer__list footer__list--icons">
            <li>
              <Phone size={16} />
              <a href={`tel:${RESTAURANT.phone}`}>{RESTAURANT.phone}</a>
            </li>
            <li>
              <Mail size={16} />
              <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>
            </li>
            <li>
              <MapPin size={16} />
              <span>{RESTAURANT.address}</span>
            </li>
            <li className="footer__hours">
              <Clock size={16} />
              <div>
                {RESTAURANT.hours.map((h) => (
                  <span key={h.days}>
                    {h.days}: {h.time}
                  </span>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>
          © {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.
        </span>
        <a
          className="btn btn-primary footer__wa"
          href={`https://wa.me/${RESTAURANT.whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} /> Order on WhatsApp
        </a>
      </div>
    </footer>
  );
}