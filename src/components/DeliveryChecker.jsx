import { useEffect, useState } from "react";
import { Bike, Clock, MapPin } from "lucide-react";

import { API } from "../api";

export default function DeliveryChecker() {
  const [zones, setZones] = useState([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/delivery-zones`)
      .then((res) => res.json())
      .then(setZones)
      .catch(() => setError(true));
  }, []);

  const zone = zones.find((z) => z.id === selected);

  return (
    <div className="checker">
      <div className="checker__head">
        <Bike size={20} />
        <h3>Check your delivery fee</h3>
      </div>

      <label className="checker__field">
        <MapPin size={18} />
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select your area</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.area}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="checker__note">Can't reach the kitchen right now. Please try again.</p>}

      {zone ? (
        <div className="checker__result">
          <div>
            <span>Delivery fee</span>
            <strong>₦{zone.fee.toLocaleString()}</strong>
          </div>
          <div>
            <span>
              <Clock size={14} /> Arrives in
            </span>
            <strong>~{zone.estimatedMinutes} mins</strong>
          </div>
        </div>
      ) : (
        <p className="checker__note">No hidden charges. See the exact fee before you order.</p>
      )}
    </div>
  );
}