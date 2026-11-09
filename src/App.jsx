import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MusicToggle from "./components/MusicToggle";
import Home from "./Pages/Home";
import Menu from "./Pages/Menu";
import Cart from "./Pages/Cart";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Admin from "./Pages/Admin";
import { useCart } from "./context/CartContext";

function NotFound() {
  return (
    <div className="container" style={{ padding: "120px 0", textAlign: "center" }}>
      <h2>Page not found</h2>
      <p style={{ color: "var(--muted)", marginTop: 12 }}>
        That page doesn't exist. Try the menu instead.
      </p>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const { count } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Loader hidden={!loading} />
      <Navbar cartCount={count} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/musictoggle" element={<MusicToggle />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <MusicToggle />
    </>
  );
}