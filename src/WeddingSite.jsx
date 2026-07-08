import React, { useState, useEffect, useRef } from "react";

/**
 * Ravi Teja & Shruthi — Wedding Site  (hosted at dureddy.com)
 * Single-file React component. All bespoke styling scoped below.
 *
 * ── RSVP backend: Web3Forms ──────────────────────────────────────────────
 * 1. Create a free account at https://web3forms.com
 *    - Form name:  Dureddy Wedding RSVP
 *    - Domain:     dureddy.com   (use localhost only while testing locally)
 * 2. Paste your access key into WEB3FORMS_ACCESS_KEY below.
 * 3. Each RSVP emails you instantly + shows in the dashboard (30-day free
 *    storage — treat the emails as the permanent record).
 *
 * ── Photos ───────────────────────────────────────────────────────────────
 * Event visuals are hand-illustrated scenes, so the page looks finished with
 * zero photos. Add a URL to any `photo` field and it layers over the scene;
 * a broken/missing photo falls back to the illustration automatically.
 */

const WEB3FORMS_ACCESS_KEY = "bad36740-22b4-4245-90a9-eecf1df52fd1"; // public key — safe in client code

const COUNTDOWN_TARGET = new Date("2026-08-28T09:00:00-05:00"); // Haldi

const mapUrl = (q) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

// Timeline = chronological
const TIMELINE = [
  {
    key: "haldi",
    name: "Haldi Ceremony",
    date: "Friday, August 28, 2026",
    time: "9:00 AM",
    venue: "Cloud 9 Ranch @ Custer",
    address: "5083 Co Rd 126, Celina, TX 75009",
    dress: "Yellow & Pastels",
    dressColors: [
      { c: "#EBB94A", n: "Yellow" },
      { c: "#F3D9A0", n: "Pastel gold" },
      { c: "#E8C4C4", n: "Blush" },
      { c: "#BFD6C4", n: "Sage" },
    ],
    photo: "",
  },
  {
    key: "mehendi",
    name: "Mehendi & Cocktail Night",
    date: "Friday, August 28, 2026",
    time: "6:00 PM",
    venue: "Cloud 9 Ranch @ Custer",
    address: "5083 Co Rd 126, Celina, TX 75009",
    dress: "Modern Indian Chic — Cocktail Sarees, Lehengas, Indo-Western",
    dressColors: [
      { c: "#7A2330", n: "Maroon" },
      { c: "#0F4D46", n: "Emerald" },
      { c: "#C7A56D", n: "Gold" },
      { c: "#3A2140", n: "Plum" },
    ],
    photo: "",
  },
  {
    key: "wedding",
    name: "Wedding Ceremony",
    date: "Sunday, August 30, 2026",
    time: "Muhurtam · 11:48 AM",
    venue: "Bella Cavalli Events",
    address: "1651 W Sherman Dr, Aubrey, TX 76227",
    dress: "Traditional Indian Attire or Business Casual",
    dressColors: [
      { c: "#0F4D46", n: "Emerald" },
      { c: "#C7A56D", n: "Gold" },
      { c: "#7A2330", n: "Maroon" },
      { c: "#F6E7B4", n: "Ivory gold" },
    ],
    photo: "",
  },
];

// RSVP order = priority (Wedding first)
const RSVP_EVENTS = [
  { key: "wedding", label: "Wedding Ceremony", sub: "Aug 30 · Bella Cavalli, Aubrey" },
  { key: "haldi", label: "Haldi Ceremony", sub: "Aug 28 · 9:00 AM · Cloud 9 Ranch" },
  { key: "mehendi", label: "Mehendi & Cocktail", sub: "Aug 28 · 6:00 PM · Cloud 9 Ranch" },
];

const MOMENTS = [
  { key: "wed", title: "Two families, one beginning", note: "Hyderabad · Dallas", grad: "linear-gradient(135deg,#0F4D46,#0c302b)", motif: "kalash" },
  { key: "haldi", title: "A morning of marigolds", note: "Haldi", grad: "linear-gradient(135deg,#EBB94A,#C98A34)", motif: "marigold" },
  { key: "meh", title: "Henna, music, colour", note: "Mehendi & Cocktails", grad: "linear-gradient(135deg,#5A1A26,#2b2540)", motif: "paisley" },
  { key: "peacock", title: "Celebration in full colour", note: "The weekend awaits", grad: "linear-gradient(135deg,#12433C,#1E6E64)", motif: "peacock" },
];

// ── Reusable SVG motifs ──────────────────────────────────────────────────────
const Marigold = ({ cx, cy, s = 1, c = "#F59E0B" }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      return <circle key={i} cx={14 * Math.cos(a)} cy={14 * Math.sin(a)} r="7" fill={c} />;
    })}
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI) / 4;
      return <circle key={"b" + i} cx={8 * Math.cos(a)} cy={8 * Math.sin(a)} r="6" fill={c} opacity="0.85" />;
    })}
    <circle r="6" fill="#B45309" />
  </g>
);

const Paisley = ({ cx, cy, s = 1, c = "#C7A56D", o = 1 }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`} opacity={o} fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round">
    <path d="M0 0 C 20 -4 24 -30 6 -38 C -10 -44 -20 -26 -10 -18" />
    <path d="M-2 -6 C 10 -8 14 -24 4 -30 C -4 -33 -10 -22 -4 -18" />
    <circle cx="3" cy="-32" r="1.6" fill={c} stroke="none" />
    {[[-6, -10], [8, -14], [0, -22]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="1" fill={c} stroke="none" />
    ))}
  </g>
);

const Kalash = ({ cx, cy, s = 1 }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <path d="M-26 0 Q-30 40 0 46 Q30 40 26 0 Z" fill="#C7A56D" />
    <rect x="-28" y="-8" width="56" height="10" rx="4" fill="#B8924B" />
    <circle cx="0" cy="-20" r="10" fill="#8B5E34" />
    <path d="M-8 -16 Q-24 -30 -30 -48" stroke="#7FBF9A" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M8 -16 Q24 -30 30 -48" stroke="#7FBF9A" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M0 -18 Q0 -40 0 -52" stroke="#7FBF9A" strokeWidth="3" fill="none" strokeLinecap="round" />
  </g>
);

const Peacock = ({ cx, cy, s = 1 }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    {Array.from({ length: 10 }).map((_, i) => (
      <line key={i} x1="0" y1={44 + i * 7} x2={i % 2 ? 14 : -14} y2={38 + i * 7} stroke="#3E8E82" strokeWidth="1" />
    ))}
    <line x1="0" y1="40" x2="0" y2="120" stroke="#1E6E64" strokeWidth="2" />
    <ellipse cx="0" cy="0" rx="26" ry="40" fill="#0F4D46" />
    <ellipse cx="0" cy="6" rx="18" ry="26" fill="#1E6E64" />
    <ellipse cx="0" cy="10" rx="11" ry="16" fill="#C7A56D" />
    <circle cx="0" cy="12" r="6" fill="#7A2330" />
  </g>
);

const Lotus = ({ color = "#C7A56D", w = 46 }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 100 50" aria-hidden="true">
    <g fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
      <path d="M50 46 C50 22 50 10 50 6 C50 10 50 22 50 46" />
      <path d="M50 46 C40 26 30 18 24 14 C30 24 36 36 50 46" />
      <path d="M50 46 C60 26 70 18 76 14 C70 24 64 36 50 46" />
      <path d="M50 46 C34 32 18 30 8 30 C22 40 36 44 50 46" />
      <path d="M50 46 C66 32 82 30 92 30 C78 40 64 44 50 46" />
    </g>
  </svg>
);

const Mandala = ({ size = 320, color = "#C7A56D", opacity = 0.15 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ opacity }} aria-hidden="true">
    <g fill="none" stroke={color} strokeWidth="0.8">
      <circle cx="100" cy="100" r="90" /><circle cx="100" cy="100" r="70" />
      <circle cx="100" cy="100" r="48" /><circle cx="100" cy="100" r="26" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI) / 12;
        return <line key={i} x1={100 + 26 * Math.cos(a)} y1={100 + 26 * Math.sin(a)} x2={100 + 90 * Math.cos(a)} y2={100 + 90 * Math.sin(a)} />;
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        return <ellipse key={i} cx={100 + 59 * Math.cos(a)} cy={100 + 59 * Math.sin(a)} rx="10" ry="4" transform={`rotate(${(a * 180) / Math.PI} ${100 + 59 * Math.cos(a)} ${100 + 59 * Math.sin(a)})`} />;
      })}
    </g>
  </svg>
);

const Om = ({ color = "#C7A56D", w = 40 }) => (
  <svg width={w} height={w} viewBox="0 0 100 100" aria-hidden="true">
    <text x="50" y="72" textAnchor="middle" fontSize="70" fill={color} fontFamily="'Noto Sans Devanagari','Cormorant Garamond',serif">ॐ</text>
  </svg>
);

const Divider = () => (
  <div className="rw-divider" role="presentation">
    <span className="rw-divline" /><Lotus color="#C7A56D" /><span className="rw-divline rw-divline-r" />
  </div>
);

// ── Illustrated event scenes ─────────────────────────────────────────────────
const SceneHaldi = () => (
  <svg className="rw-scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="haldiBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FBE08A" /><stop offset="0.55" stopColor="#EBB94A" /><stop offset="1" stopColor="#C98A34" />
      </linearGradient>
      <radialGradient id="haldiSun" cx="0.78" cy="0.16" r="0.55">
        <stop offset="0" stopColor="#FFF6D0" stopOpacity="0.95" /><stop offset="1" stopColor="#FFF6D0" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="300" fill="url(#haldiBg)" />
    <circle cx="312" cy="48" r="130" fill="url(#haldiSun)" />
    <g className="rw-sway" style={{ transformOrigin: "200px 10px" }}>
      <path d="M-10 26 Q200 78 410 26" fill="none" stroke="#B45309" strokeWidth="2" opacity="0.45" />
      <Marigold cx={40} cy={42} s={0.7} c="#F59E0B" /><Marigold cx={120} cy={60} s={0.6} c="#FB923C" />
      <Marigold cx={200} cy={66} s={0.7} c="#F59E0B" /><Marigold cx={280} cy={60} s={0.6} c="#FBBF24" />
      <Marigold cx={360} cy={42} s={0.7} c="#FB923C" />
    </g>
    <Marigold cx={60} cy={252} s={1.1} c="#F59E0B" /><Marigold cx={110} cy={278} s={0.8} c="#FBBF24" />
    <Marigold cx={332} cy={256} s={1.0} c="#FB923C" /><Marigold cx={372} cy={282} s={0.7} c="#F59E0B" />
    {[[150, 120], [232, 150], [190, 200], [300, 178], [92, 162]].map(([x, y], i) => (
      <circle key={i} className="rw-float" style={{ animationDelay: `${i * 0.6}s`, transformOrigin: `${x}px ${y}px` }} cx={x} cy={y} r="4" fill="#FDE68A" opacity="0.85" />
    ))}
  </svg>
);

const SceneMehendi = () => (
  <svg className="rw-scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="mehBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5A1A26" /><stop offset="0.55" stopColor="#3A2140" /><stop offset="1" stopColor="#0F4D46" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#mehBg)" />
    <g><circle cx="322" cy="58" r="26" fill="#F6E7B4" /><circle cx="332" cy="52" r="24" fill="#3A2140" /></g>
    {[[40, 40], [100, 74], [360, 120], [70, 112], [300, 30], [200, 26]].map(([x, y], i) => (
      <circle key={i} className="rw-twinkle" style={{ animationDelay: `${i * 0.5}s` }} cx={x} cy={y} r="1.6" fill="#F6E7B4" />
    ))}
    <path d="M0 34 Q200 92 400 34" fill="none" stroke="#C7A56D" strokeWidth="1" opacity="0.5" />
    {[30, 90, 150, 210, 270, 330].map((x, i) => {
      const y = 34 + Math.sin((x / 400) * Math.PI) * 54;
      return <circle key={i} className="rw-twinkle" style={{ animationDelay: `${i * 0.4}s` }} cx={x} cy={y + 4} r="3" fill="#FCD34D" />;
    })}
    <Paisley cx={80} cy={232} s={1.5} c="#C7A56D" />
    <Paisley cx={205} cy={252} s={1.2} c="#8FB8A0" o={0.95} />
    <Paisley cx={330} cy={228} s={1.4} c="#E8B84B" o={0.9} />
  </svg>
);

const SceneWedding = () => (
  <svg className="rw-scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="wedBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#12433C" /><stop offset="1" stopColor="#0C302B" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#wedBg)" />
    <g opacity="0.14" stroke="#C7A56D" fill="none" strokeWidth="0.8" transform="translate(200 150)">
      <circle r="120" /><circle r="95" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI) / 12;
        return <line key={i} x1={95 * Math.cos(a)} y1={95 * Math.sin(a)} x2={120 * Math.cos(a)} y2={120 * Math.sin(a)} />;
      })}
    </g>
    <g stroke="#C7A56D" strokeWidth="4" fill="none">
      <line x1="90" y1="300" x2="90" y2="120" /><line x1="310" y1="300" x2="310" y2="120" />
      <path d="M90 120 Q200 40 310 120" />
    </g>
    <circle cx="90" cy="116" r="8" fill="#C7A56D" /><circle cx="310" cy="116" r="8" fill="#C7A56D" />
    <path d="M186 72 Q200 52 214 72" fill="#C7A56D" />
    <Kalash cx={200} cy={206} s={1.05} />
    <g transform="translate(200 270)"><Lotus color="#C7A56D" w={72} /></g>
  </svg>
);

const SCENES = { haldi: SceneHaldi, mehendi: SceneMehendi, wedding: SceneWedding };

const EventVisual = ({ ev }) => {
  const [imgOk, setImgOk] = useState(!!ev.photo);
  const S = SCENES[ev.key];
  return (
    <div className="rw-tl-photo rw-scene-wrap">
      {S && <S />}
      {ev.photo && imgOk && (
        <img src={ev.photo} alt={ev.name} loading="lazy" className="rw-scene-photo" onError={() => setImgOk(false)} />
      )}
    </div>
  );
};

const MomentMotif = ({ motif }) => (
  <svg className="rw-mom-svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    {motif === "marigold" && (
      <g>{[[80, 90, 1.4], [205, 70, 1.1], [150, 185, 1.7], [58, 205, 1.0], [235, 210, 1.2]].map(([x, y, s], i) => (
        <Marigold key={i} cx={x} cy={y} s={s} c={i % 2 ? "#FB923C" : "#F59E0B"} />
      ))}</g>
    )}
    {motif === "paisley" && (
      <g>{[[95, 110, 2.0, "#C7A56D"], [195, 145, 1.6, "#8FB8A0"], [140, 215, 2.3, "#E8B84B"]].map(([x, y, s, c], i) => (
        <Paisley key={i} cx={x} cy={y} s={s} c={c} />
      ))}</g>
    )}
    {motif === "kalash" && (
      <g><g opacity="0.16" stroke="#C7A56D" fill="none"><circle cx="150" cy="150" r="112" /><circle cx="150" cy="150" r="86" /></g><Kalash cx={150} cy={185} s={2.1} /></g>
    )}
    {motif === "peacock" && <Peacock cx={150} cy={92} s={1.7} />}
  </svg>
);

// ── Hooks ────────────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rw-reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("rw-in")); return; }
    const io = new IntersectionObserver((es) => es.forEach((en) => en.isIntersecting && en.target.classList.add("rw-in")), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function useCountdown(target) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60), s: Math.floor((diff / 1000) % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

const Petals = () => {
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return null;
  return (
    <div className="rw-petals" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className="rw-petal" style={{ left: `${(i * 11 + 5) % 100}%`, animationDelay: `${(i * 1.7) % 12}s`, animationDuration: `${11 + (i % 5) * 2}s`, background: i % 2 ? "#E8B84B" : "#C7A56D" }} />
      ))}
    </div>
  );
};

// ── RSVP ─────────────────────────────────────────────────────────────────────
function Rsvp() {
  const [family, setFamily] = useState("Dureddy Family");
  const [guest, setGuest] = useState("");
  const [diet, setDiet] = useState("");
  const [resp, setResp] = useState(RSVP_EVENTS.reduce((a, e) => ({ ...a, [e.key]: { going: null, count: 1 } }), {}));
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  const setGoing = (k, v) => setResp((r) => ({ ...r, [k]: { ...r[k], going: v, count: v ? Math.max(1, r[k].count) : 0 } }));
  const setCount = (k, d) => setResp((r) => ({ ...r, [k]: { ...r[k], count: Math.min(20, Math.max(1, r[k].count + d)) } }));

  const submit = async () => {
    if (!guest.trim()) { setErrMsg("Please add your name so we know who's coming."); setStatus("error"); return; }
    if (RSVP_EVENTS.every((e) => resp[e.key].going === null)) { setErrMsg("Let us know yes or no for at least one event."); setStatus("error"); return; }
    setStatus("sending"); setErrMsg("");

    const fmt = (k) => {
      const r = resp[k];
      if (r.going === null) return "—";
      if (!r.going) return "No";
      return `Yes · ${r.count} guest${r.count > 1 ? "s" : ""}`;
    };
    const summary = RSVP_EVENTS.map((e) => `${e.label}: ${fmt(e.key)}`).join("\n");

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Wedding RSVP — ${guest} (${family})`,
      from_name: "Ravi Teja & Sruthi Wedding Site",
      "Family Name": family,
      "Contact Name": guest,
      "Wedding Ceremony (Aug 30)": fmt("wedding"),
      "Haldi (Aug 28, 9AM)": fmt("haldi"),
      "Mehendi & Cocktail (Aug 28, 6PM)": fmt("mehendi"),
      "Dietary Restrictions": diet || "None noted",
      Summary: summary,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) setStatus("done");
      else { setErrMsg(data.message || "Something went wrong. Please try again."); setStatus("error"); }
    } catch {
      setErrMsg("Couldn't reach the server. Check your connection and try again."); setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rw-rsvp-card rw-thanks rw-reveal">
        <Om w={54} />
        <h3 className="rw-serif" style={{ fontSize: "2rem", margin: "0.4rem 0 0.2rem" }}>Thank you</h3>
        <p style={{ color: "var(--charcoal)", opacity: 0.75, maxWidth: 420, margin: "0 auto" }}>
          Your response is in, {guest.split(" ")[0]}. We can't wait to celebrate with you.
        </p>
      </div>
    );
  }

  return (
    <div className="rw-rsvp-card rw-reveal">
      <p className="rw-rsvp-hint">One name for your group and a headcount per event is all we need.</p>
      <label className="rw-field"><span>Family</span>
        <input value={family} onChange={(e) => setFamily(e.target.value)} placeholder="Family name" />
      </label>
      <label className="rw-field"><span>Your name</span>
        <input value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="First & last name" />
      </label>

      <div className="rw-events">
        {RSVP_EVENTS.map((e) => {
          const r = resp[e.key];
          return (
            <div key={e.key} className="rw-event-row">
              <div className="rw-event-meta">
                <div className="rw-event-name">{e.label}</div>
                <div className="rw-event-sub">{e.sub}</div>
              </div>
              <div className="rw-yn">
                <button type="button" className={`rw-pill ${r.going === true ? "on" : ""}`} onClick={() => setGoing(e.key, true)}>Yes</button>
                <button type="button" className={`rw-pill ${r.going === false ? "off" : ""}`} onClick={() => setGoing(e.key, false)}>No</button>
              </div>
              {r.going && (
                <div className="rw-count">
                  <span className="rw-count-lbl">How many in your group?</span>
                  <div className="rw-count-ctrl">
                    <button type="button" onClick={() => setCount(e.key, -1)} aria-label="Fewer guests">–</button>
                    <span>{r.count}</span>
                    <button type="button" onClick={() => setCount(e.key, 1)} aria-label="More guests">+</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <label className="rw-field"><span>Dietary notes <em>(optional)</em></span>
        <input value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="Allergies, veg/jain, etc." />
      </label>

      {status === "error" && <p className="rw-err">{errMsg}</p>}
      <button type="button" className="rw-submit rw-shimmer" onClick={submit} disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Submit RSVP"}
      </button>
      <p className="rw-fineprint">Takes about 30 seconds</p>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function WeddingSite() {
  useReveal();
  const cd = useCountdown(COUNTDOWN_TARGET);
  const rsvpRef = useRef(null);
  const scrollToRsvp = () => rsvpRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Cinzel:wght@400;500;600&family=Poppins:wght@300;400;500;600&family=Noto+Sans+Devanagari:wght@400;600&display=swap";
    document.head.appendChild(l);
    return () => { document.head.removeChild(l); };
  }, []);

  return (
    <div className="rw-root">
      <style>{CSS}</style>
      <Petals />

      <header className="rw-hero">
        <div className="rw-hero-bg" />
        <div className="rw-hero-mandala"><Mandala size={620} opacity={0.12} /></div>
        <div className="rw-hero-inner rw-reveal">
          <p className="rw-eyebrow">Together with their families</p>
          <h1 className="rw-names">Ravi Teja <span className="rw-amp">&amp;</span> Sruthi</h1>
          <Divider />
          <p className="rw-hero-meta">August 28–30, 2026 · Dallas, Texas</p>
          <p className="rw-hero-sub">Hyderabad to Dallas</p>
          <button className="rw-cta rw-shimmer" onClick={scrollToRsvp}>RSVP Now</button>
        </div>
        <div className="rw-scroll-cue" aria-hidden="true"><span /></div>
      </header>

      <section className="rw-countdown">
        <div className="rw-reveal">
          <p className="rw-section-eyebrow">The celebration begins in</p>
          <div className="rw-cd-grid">
            {[["Days", cd.d], ["Hours", cd.h], ["Minutes", cd.m], ["Seconds", cd.s]].map(([lab, v]) => (
              <div key={lab} className="rw-cd-cell">
                <span className="rw-cd-num">{String(v).padStart(2, "0")}</span>
                <span className="rw-cd-lab">{lab}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rw-section rw-families">
        <div className="rw-reveal">
          <h2 className="rw-section-title">With the Blessings Of</h2>
          <Divider />
          <div className="rw-fam-grid">
            <div className="rw-fam-card">
              <Om w={38} /><p className="rw-fam-role">Groom's Family</p>
              <p className="rw-fam-house">Dureddy Family</p>
              <p className="rw-fam-parents">Satya Reddy Dureddy &amp; Vijaya Jyothi Gaddam</p>
            </div>
            <div className="rw-fam-card">
              <Om w={38} /><p className="rw-fam-role">Bride's Family</p>
              <p className="rw-fam-house">Kandhala Family</p>
              <p className="rw-fam-parents">Surender Reddy Kandhala &amp; Saritha</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rw-section rw-timeline">
        <div className="rw-reveal"><h2 className="rw-section-title">The Wedding Weekend</h2><Divider /></div>
        <div className="rw-tl-list">
          {TIMELINE.map((ev, i) => (
            <article key={ev.key} className="rw-tl-card rw-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <EventVisual ev={ev} />
              <div className="rw-tl-body">
                <span className="rw-tl-index">0{i + 1}</span>
                <h3 className="rw-tl-name">{ev.name}</h3>
                <p className="rw-tl-when">{ev.date}{ev.time ? ` · ${ev.time}` : ""}</p>
                <p className="rw-tl-venue">{ev.venue}</p>
                <p className="rw-tl-addr">{ev.address}</p>
                <div className="rw-dress">
                  <span className="rw-dress-lbl">Dress code</span>
                  <div className="rw-swatches">
                    {ev.dressColors.map((d, k) => (
                      <span key={k} className="rw-swatch" style={{ background: d.c }} title={d.n} />
                    ))}
                  </div>
                  <p className="rw-dress-text">{ev.dress}</p>
                </div>
                <a className="rw-map-btn" href={mapUrl(`${ev.venue} ${ev.address}`)} target="_blank" rel="noreferrer">View on Map</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rw-section rw-rsvp" ref={rsvpRef}>
        <div className="rw-reveal">
          <h2 className="rw-section-title">RSVP</h2><Divider />
          <p className="rw-rsvp-lede">Kindly respond by August 1, 2026. We'd love to know which celebrations you'll join.</p>
        </div>
        <Rsvp />
      </section>

      <footer className="rw-footer">
        <Om w={56} />
        <p className="rw-footer-line">We look forward to celebrating with you</p>
        <p className="rw-footer-names rw-serif">Ravi Teja &amp; Sruthi</p>
        <p className="rw-footer-date">August 2026 · Dallas, Texas</p>
      </footer>

      <button className="rw-sticky-rsvp rw-shimmer" onClick={scrollToRsvp}>RSVP</button>
    </div>
  );
}

const CSS = `
:root{--ivory:#F9F6F1;--gold:#C7A56D;--gold-deep:#A8864F;--emerald:#0F4D46;--maroon:#7A2330;--charcoal:#2E2E2E;
--serif:'Cormorant Garamond',Georgia,serif;--display:'Cinzel',serif;--body:'Poppins',system-ui,sans-serif;}
.rw-root{background:var(--ivory);color:var(--charcoal);font-family:var(--body);-webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative;}
.rw-root *{box-sizing:border-box;}
.rw-serif{font-family:var(--serif);}
.rw-reveal{opacity:0;transform:translateY(22px);transition:opacity .9s ease,transform .9s ease;}
.rw-reveal.rw-in{opacity:1;transform:none;}
.rw-divider{display:flex;align-items:center;justify-content:center;gap:14px;margin:18px auto;max-width:340px;}
.rw-divline{height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--gold));}
.rw-divline-r{background:linear-gradient(90deg,var(--gold),transparent);}
.rw-petals{position:fixed;inset:0;pointer-events:none;z-index:40;}
.rw-petal{position:absolute;top:-20px;width:9px;height:9px;border-radius:0 60% 60% 60%;opacity:.55;transform:rotate(45deg);animation:rw-fall linear infinite;}
@keyframes rw-fall{0%{transform:translateY(-20px) rotate(0);opacity:0;}10%{opacity:.55;}100%{transform:translateY(105vh) rotate(320deg);opacity:0;}}
.rw-shimmer{position:relative;overflow:hidden;}
.rw-shimmer::after{content:"";position:absolute;top:0;left:-120%;width:60%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.5),transparent);transform:skewX(-20deg);animation:rw-shine 4.5s ease-in-out infinite;}
@keyframes rw-shine{0%,60%{left:-120%;}80%,100%{left:140%;}}
@keyframes rw-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
@keyframes rw-twinkle{0%,100%{opacity:.3;}50%{opacity:1;}}
@keyframes rw-sway{0%,100%{transform:rotate(-1.6deg);}50%{transform:rotate(1.6deg);}}
.rw-float{animation:rw-float 5s ease-in-out infinite;}
.rw-twinkle{animation:rw-twinkle 3s ease-in-out infinite;}
.rw-sway{animation:rw-sway 6s ease-in-out infinite;}

.rw-hero{position:relative;min-height:100svh;display:flex;align-items:center;justify-content:center;text-align:center;padding:64px 22px;color:#fff;overflow:hidden;}
.rw-hero-bg{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 0%,rgba(15,77,70,.55),transparent 60%),linear-gradient(160deg,#0c3d38 0%,#0F4D46 40%,#7A2330 130%);}
.rw-hero-bg::before{content:"";position:absolute;inset:0;background:radial-gradient(80% 60% at 50% 45%,transparent,rgba(0,0,0,.45));}
.rw-hero-mandala{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
.rw-hero-inner{position:relative;z-index:2;max-width:760px;}
.rw-eyebrow{font-family:var(--display);letter-spacing:.34em;text-transform:uppercase;font-size:.66rem;color:var(--gold);margin:0 0 18px;}
.rw-names{font-family:var(--serif);font-weight:500;line-height:1.02;margin:0;font-size:clamp(3.1rem,13vw,6.4rem);letter-spacing:.01em;text-shadow:0 2px 30px rgba(0,0,0,.35);}
.rw-amp{color:var(--gold);font-style:italic;font-weight:400;display:inline-block;padding:0 .12em;}
.rw-hero-meta{font-family:var(--display);letter-spacing:.14em;font-size:clamp(.82rem,3.6vw,1.05rem);margin:6px 0 4px;color:#fff;}
.rw-hero-sub{font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;opacity:.8;margin:0 0 30px;}
.rw-cta{font-family:var(--display);letter-spacing:.16em;text-transform:uppercase;font-size:.78rem;color:var(--emerald);background:linear-gradient(180deg,#e3c98f,var(--gold));border:none;padding:17px 42px;border-radius:40px;cursor:pointer;font-weight:600;box-shadow:0 12px 30px rgba(199,165,109,.4);transition:transform .25s,box-shadow .25s;}
.rw-cta:hover{transform:translateY(-2px);box-shadow:0 16px 38px rgba(199,165,109,.55);}
.rw-scroll-cue{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);width:22px;height:34px;border:1.5px solid rgba(199,165,109,.7);border-radius:12px;z-index:2;}
.rw-scroll-cue span{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:3px;height:7px;border-radius:2px;background:var(--gold);animation:rw-cue 1.8s ease-in-out infinite;}
@keyframes rw-cue{0%{opacity:0;top:7px;}40%{opacity:1;}100%{opacity:0;top:18px;}}

.rw-section{padding:76px 22px;max-width:1080px;margin:0 auto;}
.rw-section-title{font-family:var(--display);text-align:center;font-weight:500;font-size:clamp(1.5rem,6vw,2.3rem);letter-spacing:.12em;color:var(--emerald);margin:0;}
.rw-countdown{background:linear-gradient(160deg,#0F4D46,#0c3d38);color:#fff;padding:56px 22px;text-align:center;}
.rw-section-eyebrow{font-family:var(--display);letter-spacing:.22em;text-transform:uppercase;font-size:.66rem;color:var(--gold);margin:0 0 26px;}
.rw-cd-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:520px;margin:0 auto;}
.rw-cd-cell{background:rgba(199,165,109,.08);border:1px solid rgba(199,165,109,.28);border-radius:14px;padding:18px 6px;}
.rw-cd-num{display:block;font-family:var(--serif);font-size:clamp(1.9rem,8vw,3rem);color:var(--gold);line-height:1;font-weight:600;}
.rw-cd-lab{display:block;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;margin-top:8px;opacity:.75;}

.rw-fam-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:34px;}
.rw-fam-card{background:#fff;border:1px solid rgba(199,165,109,.35);border-radius:18px;padding:38px 26px;text-align:center;box-shadow:0 14px 40px rgba(15,77,70,.06);}
.rw-fam-role{font-family:var(--display);letter-spacing:.18em;text-transform:uppercase;font-size:.6rem;color:var(--gold-deep);margin:12px 0 16px;}
.rw-fam-names{font-family:var(--serif);font-size:1.5rem;color:var(--charcoal);margin:2px 0;line-height:1.2;}
.rw-fam-amp{font-family:var(--serif);font-style:italic;color:var(--gold);margin:2px 0;}
.rw-fam-house{font-family:var(--serif);font-size:1.8rem;color:var(--emerald);margin:2px 0 10px;line-height:1.15;}
.rw-fam-parents{font-size:.92rem;color:var(--charcoal);opacity:.8;margin:0;line-height:1.5;}

.rw-tl-list{display:flex;flex-direction:column;gap:30px;margin-top:40px;}
.rw-tl-card{display:grid;grid-template-columns:0.9fr 1.1fr;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(199,165,109,.28);box-shadow:0 16px 44px rgba(15,77,70,.07);}
.rw-scene-wrap{position:relative;min-height:240px;}
.rw-scene{position:absolute;inset:0;width:100%;height:100%;display:block;}
.rw-scene-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.rw-tl-body{padding:32px 30px;position:relative;}
.rw-tl-index{font-family:var(--serif);font-size:2.4rem;color:rgba(199,165,109,.4);position:absolute;top:18px;right:24px;line-height:1;}
.rw-tl-name{font-family:var(--serif);font-size:1.75rem;color:var(--emerald);margin:0 0 6px;}
.rw-tl-when{font-family:var(--display);letter-spacing:.06em;font-size:.82rem;color:var(--maroon);margin:0 0 12px;}
.rw-tl-venue{font-weight:600;margin:0 0 2px;font-size:.98rem;}
.rw-tl-addr{color:var(--charcoal);opacity:.65;font-size:.86rem;margin:0 0 16px;}
.rw-dress{margin:0 0 20px;}
.rw-dress-lbl{font-family:var(--display);font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-deep);display:block;margin-bottom:8px;}
.rw-swatches{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.rw-swatch{width:20px;height:20px;border-radius:50%;border:1.5px solid rgba(255,255,255,.85);box-shadow:0 1px 5px rgba(0,0,0,.18);cursor:default;transition:transform .2s;}
.rw-swatch:hover{transform:scale(1.3);}
.rw-dress-text{font-size:.84rem;line-height:1.5;margin:0;opacity:.85;}
.rw-map-btn{display:inline-block;font-family:var(--display);letter-spacing:.12em;text-transform:uppercase;font-size:.66rem;color:var(--emerald);border:1.4px solid var(--gold);border-radius:30px;padding:11px 26px;text-decoration:none;transition:background .25s,color .25s;}
.rw-map-btn:hover{background:var(--emerald);color:#fff;border-color:var(--emerald);}

.rw-moments{padding:76px 22px;max-width:1100px;margin:0 auto;}
.rw-mom-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:40px;}
.rw-mom-tile{position:relative;border-radius:20px;overflow:hidden;min-height:260px;display:flex;align-items:flex-end;cursor:pointer;border:1px solid rgba(199,165,109,.3);transition:transform .35s,box-shadow .35s;}
.rw-mom-tile:hover{transform:translateY(-6px);box-shadow:0 22px 50px rgba(15,77,70,.16);}
.rw-mom-motif{position:absolute;inset:0;transition:transform .6s ease;z-index:0;}
.rw-mom-svg{position:absolute;inset:0;width:100%;height:100%;}
.rw-mom-tile:hover .rw-mom-motif{transform:scale(1.08) rotate(3deg);}
.rw-mom-tile::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(10,35,32,.72),transparent 62%);z-index:1;}
.rw-mom-cap{position:relative;z-index:2;padding:26px 24px;color:#fff;}
.rw-mom-cap h3{font-family:var(--serif);font-size:1.55rem;margin:0;font-weight:500;line-height:1.15;}
.rw-mom-cap p{margin:4px 0 0;font-size:.68rem;letter-spacing:.14em;color:var(--gold);text-transform:uppercase;}

.rw-rsvp{max-width:640px;}
.rw-rsvp-lede{text-align:center;color:var(--charcoal);opacity:.72;font-size:.94rem;max-width:460px;margin:14px auto 0;line-height:1.6;}
.rw-rsvp-card{background:#fff;border:1px solid rgba(199,165,109,.3);border-radius:22px;padding:30px 26px;margin-top:34px;box-shadow:0 20px 50px rgba(15,77,70,.08);}
.rw-rsvp-hint{font-size:.82rem;color:var(--gold-deep);text-align:center;margin:0 0 22px;line-height:1.5;}
.rw-party-hint{font-size:.76rem;opacity:.6;margin:-2px 0 12px;line-height:1.4;}
.rw-party-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.rw-party-row input{flex:1;border:none;border-bottom:1.5px solid rgba(199,165,109,.5);background:transparent;padding:9px 2px;font-family:var(--body);font-size:.96rem;color:var(--charcoal);outline:none;transition:border-color .25s;}
.rw-party-row input:focus{border-color:var(--emerald);}
.rw-guest-x{width:30px;height:30px;flex:0 0 30px;border-radius:50%;border:1.5px solid rgba(122,35,48,.4);background:#fff;color:var(--maroon);font-size:1.1rem;line-height:1;cursor:pointer;transition:background .2s,color .2s;}
.rw-guest-x:hover{background:var(--maroon);color:#fff;border-color:var(--maroon);}
.rw-add-guest{margin-top:4px;font-family:var(--display);letter-spacing:.1em;text-transform:uppercase;font-size:.64rem;color:var(--emerald);background:transparent;border:1.4px dashed rgba(199,165,109,.7);border-radius:30px;padding:10px 22px;cursor:pointer;transition:background .2s,border-color .2s;}
.rw-add-guest:hover{background:rgba(199,165,109,.12);border-color:var(--gold);border-style:solid;}
.rw-party-count{font-family:var(--display);letter-spacing:.14em;text-transform:uppercase;font-size:.62rem;color:var(--gold-deep);margin:12px 0 0;}
.rw-field{display:block;margin-bottom:18px;}
.rw-field span{display:block;font-family:var(--display);font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:8px;}
.rw-field em{font-style:normal;opacity:.6;text-transform:none;letter-spacing:0;}
.rw-field input{width:100%;border:none;border-bottom:1.5px solid rgba(199,165,109,.5);background:transparent;padding:11px 2px;font-family:var(--body);font-size:1rem;color:var(--charcoal);outline:none;transition:border-color .25s;}
.rw-field input:focus{border-color:var(--emerald);}
.rw-events{margin:6px 0 22px;border-top:1px solid rgba(199,165,109,.22);}
.rw-event-row{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:18px 0;border-bottom:1px solid rgba(199,165,109,.22);}
.rw-event-meta{flex:1;min-width:150px;}
.rw-event-name{font-family:var(--serif);font-size:1.28rem;color:var(--emerald);line-height:1.2;}
.rw-event-sub{font-size:.74rem;opacity:.6;margin-top:2px;}
.rw-yn{display:flex;gap:8px;}
.rw-pill{font-family:var(--display);letter-spacing:.08em;font-size:.7rem;text-transform:uppercase;border:1.5px solid rgba(199,165,109,.6);background:transparent;color:var(--charcoal);padding:10px 20px;border-radius:24px;cursor:pointer;transition:all .2s;min-width:64px;}
.rw-pill.on{background:var(--emerald);border-color:var(--emerald);color:#fff;}
.rw-pill.off{background:var(--maroon);border-color:var(--maroon);color:#fff;}
.rw-count{display:flex;align-items:center;gap:12px;width:100%;justify-content:flex-end;}
.rw-count-lbl{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-deep);font-family:var(--display);}
.rw-count-ctrl{display:flex;align-items:center;gap:14px;}
.rw-count-ctrl button{width:34px;height:34px;border-radius:50%;border:1.5px solid var(--gold);background:#fff;color:var(--emerald);font-size:1.2rem;line-height:1;cursor:pointer;}
.rw-count-ctrl span{font-size:1rem;min-width:22px;text-align:center;color:var(--charcoal);}
.rw-err{color:var(--maroon);font-size:.82rem;text-align:center;margin:4px 0 12px;}
.rw-submit{width:100%;font-family:var(--display);letter-spacing:.14em;text-transform:uppercase;font-size:.8rem;font-weight:600;color:var(--emerald);border:none;cursor:pointer;background:linear-gradient(180deg,#e3c98f,var(--gold));padding:18px;border-radius:40px;box-shadow:0 12px 30px rgba(199,165,109,.38);transition:transform .25s;margin-top:8px;}
.rw-submit:hover:not(:disabled){transform:translateY(-2px);}
.rw-submit:disabled{opacity:.7;cursor:default;}
.rw-fineprint{text-align:center;font-size:.7rem;opacity:.55;margin:14px 0 0;letter-spacing:.04em;}
.rw-thanks{text-align:center;padding:52px 26px;}

.rw-footer{background:linear-gradient(160deg,#0F4D46,#0c3d38);color:#fff;text-align:center;padding:66px 22px 96px;}
.rw-footer-line{font-size:.86rem;letter-spacing:.08em;opacity:.82;margin:16px 0 20px;}
.rw-footer-names{font-size:2.2rem;color:var(--gold);margin:0;font-weight:500;}
.rw-footer-date{font-family:var(--display);letter-spacing:.14em;font-size:.66rem;opacity:.6;margin:10px 0 0;}

.rw-sticky-rsvp{display:none;position:fixed;left:16px;right:16px;bottom:16px;z-index:50;font-family:var(--display);letter-spacing:.18em;text-transform:uppercase;font-size:.82rem;font-weight:600;color:var(--emerald);background:linear-gradient(180deg,#e3c98f,var(--gold));border:none;padding:17px;border-radius:40px;box-shadow:0 12px 30px rgba(12,40,36,.4);cursor:pointer;}

@media(max-width:760px){
.rw-fam-grid{grid-template-columns:1fr;}
.rw-tl-card{grid-template-columns:1fr;}
.rw-scene-wrap{min-height:190px;}
.rw-tl-index{font-size:1.9rem;top:14px;right:18px;}
.rw-mom-grid{grid-template-columns:1fr;}
.rw-sticky-rsvp{display:block;}
.rw-footer{padding-bottom:104px;}
.rw-count{justify-content:space-between;}
}
@media(prefers-reduced-motion:reduce){
.rw-reveal{opacity:1;transform:none;transition:none;}
.rw-float,.rw-twinkle,.rw-sway,.rw-shimmer::after,.rw-scroll-cue span{animation:none;}
}
`;
