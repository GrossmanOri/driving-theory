// Simple inline-SVG road signs for the seed dataset.
// Each function returns a data-URI usable directly in <img src>.
// When the official question bank is imported, real image URLs replace these.

const enc = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const wrap = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">${inner}</svg>`;

// Red triangle warning sign with a glyph
const triangle = (glyph: string) =>
  wrap(
    `<polygon points="100,15 185,175 15,175" fill="#fff" stroke="#d32f2f" stroke-width="12" stroke-linejoin="round"/>` +
      `<text x="100" y="150" font-size="80" text-anchor="middle">${glyph}</text>`,
  );

// Red circle prohibition sign
const prohibition = (inner: string) =>
  wrap(
    `<circle cx="100" cy="100" r="85" fill="#fff" stroke="#d32f2f" stroke-width="14"/>` + inner,
  );

// Blue round mandatory sign
const mandatory = (glyph: string) =>
  wrap(
    `<circle cx="100" cy="100" r="90" fill="#1565c0"/>` +
      `<text x="100" y="130" font-size="90" text-anchor="middle" fill="#fff">${glyph}</text>`,
  );

export const SIGNS = {
  stop: enc(
    wrap(
      `<polygon points="60,15 140,15 185,60 185,140 140,185 60,185 15,140 15,60" fill="#d32f2f"/>` +
        `<text x="100" y="125" font-size="48" font-weight="bold" text-anchor="middle" fill="#fff">STOP</text>`,
    ),
  ),
  giveWay: enc(
    wrap(
      `<polygon points="100,180 15,25 185,25" fill="#fff" stroke="#d32f2f" stroke-width="14" stroke-linejoin="round"/>`,
    ),
  ),
  speed50: enc(
    prohibition(
      `<text x="100" y="135" font-size="80" font-weight="bold" text-anchor="middle" fill="#111">50</text>`,
    ),
  ),
  speed30: enc(
    prohibition(
      `<text x="100" y="135" font-size="80" font-weight="bold" text-anchor="middle" fill="#111">30</text>`,
    ),
  ),
  noEntry: enc(
    prohibition(`<rect x="45" y="88" width="110" height="24" fill="#d32f2f"/>`),
  ),
  noParking: enc(
    wrap(
      `<circle cx="100" cy="100" r="85" fill="#1565c0" stroke="#d32f2f" stroke-width="14"/>` +
        `<line x1="40" y1="40" x2="160" y2="160" stroke="#d32f2f" stroke-width="14"/>`,
    ),
  ),
  children: enc(triangle('🧒')),
  pedestrianCrossing: enc(triangle('🚶')),
  slippery: enc(triangle('🌀')),
  trafficLight: enc(triangle('🚦')),
  roundabout: enc(mandatory('↻')),
  keepRight: enc(mandatory('↱')),
  pedestrianZebra: enc(
    wrap(
      `<rect x="20" y="20" width="160" height="160" rx="14" fill="#1565c0"/>` +
        `<text x="100" y="135" font-size="90" text-anchor="middle" fill="#fff">🚶</text>`,
    ),
  ),
} as const;
