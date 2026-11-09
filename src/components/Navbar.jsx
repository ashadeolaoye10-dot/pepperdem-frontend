import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Flame, Menu, ShoppingBag, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ cartCount = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__icon">
            <Flame size={20} />
          </span>
          <span>
            Pepper Dem <b>Kitchen</b>
          </span>
        </Link>

        <nav className={`nav__links ${open ? "is-open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-btn__count">{cartCount}</span>}
          </Link>
          <Link to="/menu" className="btn btn-primary nav__order">
            Order Now
          </Link>
          <button
            className="nav__toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}