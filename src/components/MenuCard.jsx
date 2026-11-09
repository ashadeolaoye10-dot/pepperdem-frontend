import { useState } from "react";
import { Beef, Cookie, Flame, GlassWater, Minus, Plus, Soup, Star, UtensilsCrossed } from "lucide-react";
import { useCart } from "../context/CartContext";

const icons = {
  Grills: Beef,
  Rice: Soup,
  Snacks: Cookie,
  Drinks: GlassWater,
};

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function MenuCard({ item }) {
  const { items, addItem, decrease } = useCart();
  const [imgFailed, setImgFailed] = useState(false);
  const inCart = items.find((i) => i.id === item.id);
  const Icon = icons[item.category] || UtensilsCrossed;
  const images = {
  "Beef Suya": "https://www.chilipeppermadness.com/wp-content/uploads/2025/09/Suya-Recipe3.jpg",
  "Asun": "https://images.pexels.com/photos/27604412/pexels-photo-27604412.jpeg",
  "Grilled Chicken & Dodo": "https://images.pexels.com/photos/28635476/pexels-photo-28635476.jpeg",
  "Party Jollof & Chicken": "https://media.istockphoto.com/id/688602284/photo/jollof-rice-with-chicken-and-plantains.jpg?b=1&s=612x612&w=0&k=20&c=xfEBZF42nnWl4TU-uNhPBINyS5iGszaY5U4ZfonhntY=",
  "Ofada Rice & Sauce": "https://images.pexels.com/photos/5333327/pexels-photo-5333327.jpeg",
  "Fried Rice & Turkey": "https://images.unsplash.com/photo-1672856399675-8c099efbe0e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "Puff Puff": "https://images.unsplash.com/photo-1664993085274-80c6ba725ccc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "Moi Moi": "https://images.pexels.com/photos/36035418/pexels-photo-36035418.jpeg",
  "Small Chops Platter": "https://images.pexels.com/photos/40290196/pexels-photo-40290196.png",
  "Chapman": "https://images.unsplash.com/photo-1557935260-03ada3026d41?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "Zobo": "https://images.pexels.com/photos/38644455/pexels-photo-38644455.jpeg",
  "Kunu": "https://images.pexels.com/photos/5652184/pexels-photo-5652184.jpeg",
};
  const src = item.imageUrl || images[item.name] || `/images/menu/${slug(item.name)}.jpg`;

  return (
    <article className="card">
      <div className={`card__media media--${item.category.toLowerCase()}`}>
        <Icon size={56} strokeWidth={1.5} />
        {!imgFailed && (
          <img
            src={src}
            alt={item.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}

        <div className="card__badges">
          {item.popular && <span className="badge badge--gold">Popular</span>}
          {item.spicy && (
            <span className="badge badge--red">
              <Flame size={12} /> Spicy
            </span>
          )}
        </div>

        <span className="card__rating">
          <Star size={13} fill="currentColor" /> {item.rating.toFixed(1)}
        </span>
      </div>

      <div className="card__body">
        <div className="card__top">
          <h3>{item.name}</h3>
          <strong className="card__price">₦{item.price.toLocaleString()}</strong>
        </div>
        <p>{item.description}</p>

        {inCart ? (
          <div className="stepper">
            <button onClick={() => decrease(item.id)} aria-label="Remove one">
              <Minus size={18} />
            </button>
            <span>{inCart.qty}</span>
            <button onClick={() => addItem(item)} aria-label="Add one">
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <button className="btn btn-primary card__add" onClick={() => addItem(item)}>
            <Plus size={18} /> Add to cart
          </button>
        )}
      </div>
    </article>
  );
}