// HeroScene — תיאו the mascot car drives (right → left, RTL forward) toward
// the finish flag. Progress-bound via `pct` (0-100). Self-contained animated
// SVG; day/night parity through Tailwind `dark:` on SVG groups.

// A single cartoon wheel: dark tire + light hubcap with 3 spokes, spinning.
function Wheel({ cx, cy }) {
  return (
    <g className="hero-wheel">
      <circle cx={cx} cy={cy} r="13" fill="#1e293b" />
      <circle cx={cx} cy={cy} r="12" fill="none" stroke="#334155" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="6" fill="#cbd5e1" />
      <g stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round">
        <line x1={cx} y1={cy - 5.5} x2={cx} y2={cy + 5.5} />
        <line x1={cx - 4.8} y1={cy + 2.8} x2={cx + 4.8} y2={cy - 2.8} />
        <line x1={cx - 4.8} y1={cy - 2.8} x2={cx + 4.8} y2={cy + 2.8} />
      </g>
    </g>
  );
}

// The mascot car, drawn in local SVG units with wheels resting on the road.
// Front of the car faces LEFT (driving direction). Bob lives on an inner group
// so it never fights the outer translateX that binds position to progress.
function Car() {
  return (
    <g className="hero-bob">
      {/* Night headlight beam — a soft cone in front (left) of the car */}
      <g className="hidden dark:block">
        <path d="M9 138 L-34 151 L-30 126 Z" fill="#fcd34d" opacity="0.28" />
        <circle cx="9" cy="139" r="3" fill="#fef3c7" />
      </g>

      {/* Wheels first so the body overlaps their tops */}
      <Wheel cx="24" cy="148" />
      <Wheel cx="66" cy="148" />

      {/* Lower body */}
      <rect x="6" y="123" width="78" height="27" rx="11" fill="#0ea5e9" />
      {/* Bottom shading */}
      <path
        d="M8 141 h74 v3 a9 9 0 0 1 -9 6 H17 a9 9 0 0 1 -9 -6 Z"
        fill="#0284c7"
      />
      {/* Cabin — sits on the body (overlaps, never floats) */}
      <path
        d="M27 126 L31 106 a7 7 0 0 1 6 -4 h18 a7 7 0 0 1 6 4 L63 126 Z"
        fill="#38bdf8"
      />
      {/* Windshield glass */}
      <path
        d="M33 123 L36 109 a4 4 0 0 1 3.5 -2.6 h13 a4 4 0 0 1 3.5 2.6 L59 123 Z"
        fill="#e0f2fe"
      />

      {/* Friendly eyes, looking left toward the road; they blink together */}
      <g className="hero-blink">
        <circle cx="40" cy="115" r="5.2" fill="#ffffff" />
        <circle cx="52" cy="115" r="5.2" fill="#ffffff" />
        <circle cx="38" cy="115" r="2.7" fill="#0f172a" />
        <circle cx="50" cy="115" r="2.7" fill="#0f172a" />
        <circle cx="37.2" cy="113.8" r="0.9" fill="#ffffff" />
        <circle cx="49.2" cy="113.8" r="0.9" fill="#ffffff" />
      </g>

      {/* Little smile on the front bumper */}
      <path
        d="M13 141 Q19 147 25 141"
        fill="none"
        stroke="#0369a1"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Headlight lamp (day) */}
      <circle cx="9" cy="139" r="3" fill="#fde68a" className="dark:hidden" />
    </g>
  );
}

export function HeroScene({ pct = 0 }) {
  const clamped = Math.max(0, Math.min(100, pct));
  // Car travels from x=655 (start, right) to x=90 (near the flag, left).
  const carX = 655 - (565 * clamped) / 100;

  return (
    <div className="aspect-[4/1] w-full overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700">
      <svg
        viewBox="0 0 800 200"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label="תיאו נוסע לעבר קו הסיום"
      >
        {/* 1 · SKY */}
        <rect x="0" y="0" width="800" height="200" className="fill-sky-100 dark:hidden" />
        <rect x="0" y="0" width="800" height="200" fill="#1e293b" className="hidden dark:block" />

        {/* 2 · SUN (day) */}
        <g className="dark:hidden">
          <g className="hero-sun-rays">
            <g stroke="#fbbf24" strokeWidth="4" strokeLinecap="round">
              <line x1="110" y1="8" x2="110" y2="20" />
              <line x1="110" y1="70" x2="110" y2="82" />
              <line x1="48" y1="45" x2="60" y2="45" />
              <line x1="160" y1="45" x2="172" y2="45" />
              <line x1="66" y1="1" x2="75" y2="10" />
              <line x1="145" y1="80" x2="154" y2="89" />
              <line x1="66" y1="89" x2="75" y2="80" />
              <line x1="145" y1="10" x2="154" y2="1" />
            </g>
          </g>
          <circle cx="110" cy="45" r="22" fill="#fcd34d" />
          <circle cx="110" cy="45" r="22" fill="none" stroke="#fbbf24" strokeWidth="2" />
        </g>

        {/* 2 · MOON + STARS (night) */}
        <g className="hidden dark:block">
          <path
            d="M120 27 a20 20 0 1 0 0 40 a15 15 0 0 1 0 -40 Z"
            fill="#e2e8f0"
          />
          <circle cx="220" cy="30" r="1.6" fill="#ffffff" className="hero-twinkle" />
          <circle cx="300" cy="55" r="1.3" fill="#ffffff" />
          <circle cx="380" cy="26" r="1.7" fill="#ffffff" className="hero-twinkle-slow" />
          <circle cx="470" cy="48" r="1.3" fill="#ffffff" />
          <circle cx="560" cy="30" r="1.6" fill="#ffffff" />
          <circle cx="650" cy="52" r="1.4" fill="#ffffff" className="hero-twinkle" />
        </g>

        {/* 3 · CLOUDS */}
        <g className="fill-white dark:fill-slate-600">
          <g className="hero-cloud-1" transform="translate(190 44)">
            <ellipse cx="0" cy="0" rx="26" ry="15" />
            <ellipse cx="24" cy="4" rx="20" ry="13" />
            <ellipse cx="-22" cy="5" rx="18" ry="12" />
          </g>
          <g className="hero-cloud-2" transform="translate(470 34)">
            <ellipse cx="0" cy="0" rx="22" ry="13" />
            <ellipse cx="20" cy="3" rx="16" ry="10" />
            <ellipse cx="-18" cy="4" rx="15" ry="10" />
          </g>
          <g className="hero-cloud-3" transform="translate(650 58)">
            <ellipse cx="0" cy="0" rx="24" ry="14" />
            <ellipse cx="22" cy="4" rx="17" ry="11" />
            <ellipse cx="-20" cy="4" rx="16" ry="11" />
          </g>
        </g>

        {/* 4 · HILLS */}
        <path
          d="M0 138 Q200 96 400 128 T800 120 L800 200 L0 200 Z"
          className="fill-emerald-200 dark:fill-emerald-900"
        />
        <path
          d="M0 162 Q170 132 360 156 Q560 178 800 150 L800 200 L0 200 Z"
          className="fill-emerald-300 dark:fill-emerald-800"
        />

        {/* 5 · ROAD */}
        <rect x="0" y="150" width="800" height="50" fill="#475569" className="dark:hidden" />
        <rect x="0" y="150" width="800" height="50" fill="#334155" className="hidden dark:block" />
        <line
          x1="0"
          y1="176"
          x2="800"
          y2="176"
          stroke="#ffffff"
          strokeOpacity="0.8"
          strokeWidth="3"
          strokeDasharray="26 18"
          className="hero-dash dark:stroke-slate-400"
        />

        {/* 6 · FINISH FLAG — far left, planted at the road edge */}
        <g>
          <rect x="42" y="98" width="3" height="54" fill="#64748b" />
          <g>
            <rect x="45" y="98" width="12" height="8" fill="#f1f5f9" />
            <rect x="57" y="98" width="12" height="8" fill="#1e293b" />
            <rect x="45" y="106" width="12" height="8" fill="#1e293b" />
            <rect x="57" y="106" width="12" height="8" fill="#f1f5f9" />
            <rect x="45" y="114" width="12" height="8" fill="#f1f5f9" />
            <rect x="57" y="114" width="12" height="8" fill="#1e293b" />
          </g>
        </g>

        {/* 8 · roadside warning sign (right) */}
        <g>
          <rect x="734" y="132" width="3" height="24" fill="#94a3b8" />
          <path d="M735.5 108 L748 130 L723 130 Z" fill="#fef2f2" stroke="#dc2626" strokeWidth="3" strokeLinejoin="round" />
          <rect x="734" y="118" width="3" height="8" rx="1.5" fill="#dc2626" />
          <circle cx="735.5" cy="128" r="1.6" fill="#dc2626" />
        </g>

        {/* 7 · תיאו THE CAR — position bound to progress */}
        <g style={{ transform: `translateX(${carX}px)`, transition: 'transform 1s ease-out' }}>
          <Car />
        </g>
      </svg>
    </div>
  );
}
