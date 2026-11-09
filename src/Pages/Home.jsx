import { Link } from "react-router-dom";
import { ArrowRight, Flame, Star } from "lucide-react";
import DeliveryChecker from "../components/DeliveryChecker";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero__blob hero__blob--one" />
      <div className="hero__blob hero__blob--two" />

      <div className="container hero__grid">
        <div className="hero__text">
          <span className="pill">
            <Flame size={14} /> Open daily · Delivering across Lagos
          </span>
          <h2 className="hero__title">
            Naija street food, <em>hot</em> off the fire.
          </h2>
          <p className="hero__sub">
            Smoky suya, party jollof, peppered asun and ice-cold chapman, made fresh
            and delivered to your door with the fee shown upfront.
          </p>

          <div className="hero__cta">
            <Link to="/menu" className="btn btn-primary">
              View Menu <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-outline">
              Our Story
            </Link>
          </div>

          <div className="hero__stats">
            <div>
              <strong>30 min</strong>
              <span>Average delivery</span>
            </div>
            <div>
              <strong>8 areas</strong>
              <span>And growing</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Made fresh daily</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__photo">
            <img
              src="https://media.istockphoto.com/id/2213435920/photo/bowl-of-suya.webp?a=1&b=1&s=612x612&w=0&k=20&c=weQFWVlDkiOLxcVyEX4goLpAV-B_tVS4WZjf3fjeKFA="
              alt="Grilled suya skewers"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
          <div className="float-card float-card--top">
            <Star size={16} fill="currentColor" />
            <div>
              <strong>4.9</strong>
              <span>Customer rating</span>
            </div>
          </div>
          <div className="float-card float-card--bottom">
            <div>
              <strong>Beef Suya</strong>
              <span>₦3,500 · Most ordered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container hero__checker">
        <DeliveryChecker />
      </div>
    </section>
  );
}