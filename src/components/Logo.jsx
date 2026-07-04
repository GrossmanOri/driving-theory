// Brand mark: a clean steering-wheel glyph (rim + hub + three spokes) in white
// on a solid sky-600 rounded tile. No gradients, no emoji. The same geometry is
// mirrored in public/favicon.svg and public/icon.svg.

// The white glyph, drawn in a 24×24 box. currentColor so it can be recolored.
function SteeringWheelGlyph({ px }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8.6" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <path d="M12 14.4V20.6" />
      <path d="M14.4 12h6.2" />
      <path d="M3.4 12h6.2" />
    </svg>
  );
}

export function LogoMark({ size = 40 }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <SteeringWheelGlyph px={Math.round(size * 0.62)} />
    </span>
  );
}

export function Logo({ size = 40 }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="font-bold text-slate-900 dark:text-slate-100">
        לומדים תיאוריה
      </span>
    </span>
  );
}
