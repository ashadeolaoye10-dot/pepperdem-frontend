import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Flame,
  Heart,
  MapPin,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To serve proper Naija street food, with all the smoke, pepper and flavour, in a way that is clean, fair and easy to order.",
  },
  {
    icon: Heart,
    title: "Our Passion",
    text: "We grew up on suya at night, jollof at parties and puff puff on weekends. Every plate is made the way we would want it served to our own family.",
  },
  {
    icon: Users,
    title: "Our Community",
    text: "We buy from local suppliers, hire from our neighbourhood and listen to every customer. Your feedback shapes our menu.",
    accent: true,
  },
];

// CHANGE THESE to your real story (years, places, events)
const journey = [
  {
    year: "The Beginning",
    title: "One grill, one dream",
    text: "It started with a small grill and a family suya recipe passed down through generations.",
  },
  {
    year: "Growing Fast",
    title: "Word spread",
    text: "Neighbours told friends, friends told colleagues, and the orders kept coming.",
  },
  {
    year: "The Menu Grows",
    title: "Beyond the grill",
    text: "Jollof, ofada, small chops and cold drinks joined the menu, so there was something for everyone.",
  },
  {
    year: "Today",
    title: "Pepper Dem Kitchen online",
    text: "Now you can order from your phone, see your exact delivery fee, and plan your meal around your budget.",
  },
];

const promises = [
  {
    icon: MapPin,
    title: "Honest delivery fees",
    text: "Pick your area and see the exact fee before you order. No surprises at the door.",
  },
  {
    icon: Wallet,
    title: "Eat within your budget",
    text: "Tell us how much you have and how many people are eating. We suggest meals that fit.",
  },
  {
    icon: Flame,
    title: "Cooked fresh, every time",
    text: "Your food is grilled and packed when you order. It is never left sitting.",
  },
  {
    icon: Clock,
    title: "On time, or we tell you",
    text: "We show you an estimated arrival time for your area, and we call if there is a delay.",
  },
];

export default function About() {
  return (
    <section className="story">
      <div className="container">
        <header className="story__head">
          <span className="story__icon">
            <Heart size={24} />
          </span>
          <h2>
            Our <em>Story</em>
          </h2>
          <p>
            From a small grill and a big love for street food to your phone screen. This is
            how Pepper Dem Kitchen came to life.
          </p>
        </header>

        <div className="pillars">
          {pillars.map(({ icon: Icon, title, text, accent }) => (
            <article key={title} className={accent ? "pillar pillar--accent" : "pillar"}>
              <span className="pillar__icon">
                <Icon size={22} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="story__title">
          <TrendingUp size={22} />
          <h3>Our Journey</h3>
        </div>

        <div className="timeline">
          {journey.map((step) => (
            <div className="tl-step" key={step.title}>
              <div className="tl-card">
                <span className="tl-year">{step.year}</span>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="story__title">
          <Flame size={22} />
          <h3>Our Promises</h3>
        </div>

        <div className="promises">
          {promises.map(({ icon: Icon, title, text }) => (
            <article className="promise" key={title}>
              <span className="promise__icon">
                <Icon size={22} />
              </span>
              <h4>{title}</h4>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="cta-band">
          <div>
            <h3>Hungry yet?</h3>
            <p>Your suya is already on the grill.</p>
          </div>
          <Link to="/menu" className="btn btn-primary">
            See the menu <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}