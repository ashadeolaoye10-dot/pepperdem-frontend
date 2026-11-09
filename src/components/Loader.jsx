import { Flame } from "lucide-react";

export default function Loader({ hidden }) {
  return (
    <div className={`loader ${hidden ? "loader--hidden" : ""}`} aria-hidden={hidden}>
      <div className="loader__badge">
        <Flame size={42} />
      </div>
      <h1 className="loader__title">
        Pepper Dem <span>Kitchen</span>
      </h1>
      <p className="loader__tag">Firing up the grill...</p>
      <div className="loader__bar">
        <span />
      </div>
    </div>
  );
}