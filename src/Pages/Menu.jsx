import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import MenuCard from "../components/MenuCard";
import { useCart } from "../context/CartContext";
import BudgetPlanner from "../components/BudgetPlanner";

import { API } from "../api";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const { count, subtotal } = useCart();

  useEffect(() => {
    fetch(`${API}/api/menu`)
      .then((res) => {
        if (!res.ok) throw new Error("Bad response");
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(items.map((i) => i.category))],
    [items]
  );

  const visible = items.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="menu-page">
      <div className="container">
        <div className="menu-head">
          <span className="pill">Fresh · Hot · Naija</span>
          <h2>
            Our <em>Menu</em>
          </h2>
          <p>Pick your favourites. We'll show your exact delivery fee at checkout.</p>
        </div>

        {status === "ready" && <BudgetPlanner items={items} />}

        <div className="menu-controls">
          <div className="tabs">
            {categories.map((c) => (
              <button
                key={c}
                className={c === category ? "tab is-active" : "tab"}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search the menu"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        {status === "loading" && (
          <div className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="state">
            <h3>The kitchen is not answering</h3>
            <p>Make sure the backend is running, then refresh the page.</p>
          </div>
        )}

        {status === "ready" && visible.length === 0 && (
          <div className="state">
            <h3>Nothing found</h3>
            <p>Try another name or category.</p>
          </div>
        )}

        {status === "ready" && visible.length > 0 && (
          <div className="grid">
            {visible.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {count > 0 && (
        <Link to="/cart" className="cart-bar">
          <span>
            <ShoppingBag size={20} /> {count} {count === 1 ? "item" : "items"}
          </span>
          <strong>View cart · ₦{subtotal.toLocaleString()}</strong>
        </Link>
      )}
    </section>
  );
}