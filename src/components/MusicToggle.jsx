import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const TRACK = "frontend/audio/naija-vibes.mp3";
const VOLUME = 0.18; // low and gentle (0 is silent, 1 is full volume)
//https://play.mdundo.com/artist/643199/MENENAP-BEATS#autoplay-6282754
export default function MusicToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [hint, setHint] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = VOLUME;
    const timer = setTimeout(() => setHint(false), 9000);
    return () => clearTimeout(timer);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    setHint(false);
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setMissing(true);
    }
  };

  return (
    <div className="music">
      {hint && !playing && !missing && (
        <span className="music__hint">Tap for Naija vibes</span>
      )}
      {missing && import.meta.env.DEV && (
        <span className="music__hint music__hint--warn">
          Add public/audio/naija-vibes.mp3
        </span>
      )}
      {playing && (
        <span className="eq" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
      <button
        className={playing ? "music__btn is-on" : "music__btn"}
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </button>
      <audio ref={audioRef} src={TRACK} loop preload="none" onError={() => setMissing(true)} />
    </div>
  );
}