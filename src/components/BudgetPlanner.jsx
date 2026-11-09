import { useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Wallet } from "lucide-react";
import { useCart } from "../context/CartContext";

const naira = (n) => `₦${n.toLocaleString()}`;
const QUICK = [2000, 5000, 10000, 20000];

function buildCombos(items, perPerson) {
  const mains = items.filter((i) => i.category === "Grills" || i.category === "Rice");
  const snacks = items.filter((i) => i.category === "Snacks");
  const drinks = items.filter((i) => i.category === "Drinks");

  const all = [];
  for (const m of [null, ...mains]) {
    for (const s of [null, ...snacks]) {
      for (const d of [null, ...drinks]) {
        const list = [m, s, d].filter(Boolean);
        if (list.length === 0) continue;
        const total = list.reduce((sum, i) => sum + i.price, 0);
        if (total > perPerson) continue;
        const rating = list.reduce((sum, i) => sum + i.rating, 0) / list.length;
        all.push({ list, total, rating, key: list.map((i) => i.id).join("-") });
      }
    }
  }
  if (all.length === 0) return [];

  const used = new Set();
  const pick = (label, compare) => {
    const next = all.filter((c) => !used.has(c.key)).sort(compare)[0];
    if (!next) return null;
    used.add(next.key);
    return { ...next, label };
  };

  const value = (c) => c.list.length * 2 + c.rating + (c.total / perPerson) * 3;

  return [
    pick("Best pick", (a, b) => value(b) - value(a)),
    pick("Fills your budget", (a, b) => b.total - a.total || b.list.length - a.list.length),
    pick("Crowd favourite", (a, b) => b.rating - a.rating || b.total - a.total),
  ].filter(Boolean);
}

export default function BudgetPlanner({ items }) {
  const { addItem } = useCart();
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState(1);
  const [added, setAdded] = useState(null);

  const amount = Number(budget) || 0;
  const perPerson = Math.floor(amount / people);
  const cheapest = items.length ? Math.min(...items.map((i) => i.price)) : 0;

  const combos = useMemo(
    () => (amount > 0 ? buildCombos(items, perPerson) : []),
    [items, amount, perPerson]
  );

  const addCombo = (combo, index) => {
    combo.list.forEach((item) => {
      for (let n = 0; n < people; n++) addItem(item);
    });
    setAdded(index);
    setTimeout(() => setAdded(null), 2200);
  };

  return (
    <div className="budget">
      <div className="budget__head">
        <span className="budget__icon">
          <Wallet size={22} />
        </span>
        <div>
          <h3>Budget Mode</h3>
          <p>Tell us what you have. We'll show what you can eat.</p>
        </div>
      </div>

      <div className="budget__form">
        <label className="budget__input">
          <span>₦</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="How much do you have?"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </label>

        <div className="people">
          <span>People</span>
          <button onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Fewer people">
            <Minus size={16} />
          </button>
          <strong>{people}</strong>
          <button onClick={() => setPeople(Math.min(20, people + 1))} aria-label="More people">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="chips">
        {QUICK.map((q) => (
          <button key={q} className="chip" onClick={() => setBudget(String(q))}>
            {naira(q)}
          </button>
        ))}
      </div>

      {amount > 0 && combos.length === 0 && (
        <p className="budget__note">
          {naira(amount)} for {people} {people === 1 ? "person" : "people"} is {naira(perPerson)} each.
          Our cheapest item is {naira(cheapest)}, so try a little more.
        </p>
      )}

      {combos.length > 0 && (
        <>
          <p className="budget__note">
            About <strong>{naira(perPerson)}</strong> each. Here's what fits:
          </p>
          <div className="combos">
            {combos.map((combo, index) => {
              const total = combo.total * people;
              return (
                <div className="combo" key={combo.key}>
                  <span className="combo__label">{combo.label}</span>
                  <ul>
                    {combo.list.map((item) => (
                      <li key={item.id}>
                        <span>{item.name}</span>
                        <b>{naira(item.price)}</b>
                      </li>
                    ))}
                  </ul>
                  <div className="combo__sum">
                    <div>
                      <span>Total for {people}</span>
                      <strong>{naira(total)}</strong>
                    </div>
                    <div>
                      <span>Left over</span>
                      <strong>{naira(amount - total)}</strong>
                    </div>
                  </div>
                  <button
                    className={added === index ? "btn btn-green combo__btn" : "btn btn-primary combo__btn"}
                    onClick={() => addCombo(combo, index)}
                  >
                    {added === index ? (
                      <>
                        <Check size={18} /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} /> Add all to cart
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}