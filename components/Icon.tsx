/* Line icons in the Lucide style (24px grid, 1.75 stroke), drawn inline so
   the site ships no icon font. Brand marks are simplified glyphs. */

const P: Record<string, React.ReactNode> = {
  user: (<><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>),
  bag: (<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /><path d="M5 12h14" /></>),
  brush: (<><path d="M9.5 14.5 19 5a2 2 0 0 0-3-3l-9.5 9.5" /><path d="M7 13c-2 0-3 1.5-3 3 0 1.7-1 2.5-2 3 1.5 1 6 1.5 7.5-.5 1-1.3.8-3.3-.5-4.5L7 13Z" /></>),
  book: (<><path d="M3 5.5C5.5 4 9 4 12 6c3-2 6.5-2 9-.5V19c-2.5-1.5-6-1.5-9 .5-3-2-6.5-2-9-.5V5.5Z" /><path d="M12 6v13.5" /></>),
  briefcase: (<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2M3 12h18" /></>),
  monitor: (<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>),
  phone: (<><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></>),
  folder: (<><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  sparkles: (<><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>),
  grid: (<><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>),
  rocket: (<><path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.8-.9.7-2.3-.1-3.1-.8-.8-2.1-.8-2.9.1Z" /><path d="M12 15 9 12a17 17 0 0 1 10-9c0 3-1 7.5-9 12Z" /><path d="M9 12H5l2-4h5M12 15v4l4-2v-5" /></>),
  arrow: (<><path d="M5 12h14M13 6l6 6-6 6" /></>),
  arrowUpRight: (<><path d="M7 17 17 7M8 7h9v9" /></>),
  left: (<><path d="m15 18-6-6 6-6" /></>),
  right: (<><path d="m9 18 6-6-6-6" /></>),
  plus: (<><path d="M12 5v14M5 12h14" /></>),
  x: (<><path d="M6 6l12 12M18 6 6 18" /></>),
  menu: (<><path d="M4 7h16M4 12h16M4 17h16" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>),
  call: (<><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></>),
  star: (<><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor" /></>),
  home: (<><path d="M4 11 12 4l8 7v9H4v-9Z" /><path d="M10 20v-5h4v5" /></>),
  image: (<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>),
  inbox: (<><path d="M3 13h5l1.5 3h5L16 13h5" /><path d="M5 5h14l2 8v6H3v-6l2-8Z" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>),
  quote: (<><path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6" /></>),
  list: (<><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></>),
  help: (<><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01" /></>),
  wrench: (<><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 0-5-5l2.6 2.6-2.1 2.1L9.6 5.8a4 4 0 0 0 5.1.5Z" /></>),
  logout: (<><path d="M15 17l5-5-5-5M20 12H9M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /></>),
  external: (<><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>),
  refresh: (<><path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.6M20 4v4.6h-4.6" /></>),
  trash: (<><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></>),
  eye: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>),
  eyeOff: (<><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.4-1" /></>),
  up: (<><path d="m6 15 6-6 6 6" /></>),
  down: (<><path d="m6 9 6 6 6-6" /></>),
  check: (<><path d="m5 12 5 5 9-10" /></>),

  /* socials */
  instagram: (<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></>),
  linkedin: (<><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></>),
  whatsapp: (<><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2L9 9.5Z" /></>),
  email: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>),
  xtwitter: (<><path d="M4 4l16 16M20 4 4 20" /></>),
  behance: (<><path d="M3 6h5a3 3 0 0 1 0 6H3V6Zm0 6h6a3 3 0 0 1 0 6H3v-6ZM15 7h5M14 15a3.5 3.5 0 0 1 7 0h-7a3.5 3.5 0 0 0 6.5 1.8" /></>),
  dribbble: (<><circle cx="12" cy="12" r="9" /><path d="M8 4.5C12 9 14 14 15 20.5M3.5 10.5c5 .5 11-.5 15-4M6 18.5c3-4.5 8-6.5 14.5-5" /></>),
  tiktok: (<><path d="M14 3v11a4 4 0 1 1-4-4M14 3a5 5 0 0 0 5 5" /></>),

  /* tool glyphs */
  figma: (<><path d="M9 3h3v6H9a3 3 0 0 1 0-6ZM12 3h3a3 3 0 0 1 0 6h-3V3ZM9 9h3v6H9a3 3 0 0 1 0-6ZM15 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM9 15h3v3a3 3 0 1 1-3-3Z" /></>),
  framer: (<><path d="M6 3h12v6h-6l6 6h-6v6l-6-6V9h6L6 3Z" fill="currentColor" stroke="none" /></>),
  canva: (<><circle cx="12" cy="12" r="9" /><path d="M15.5 9.2A4 4 0 1 0 15.8 15" /></>),
  capcut: (<><circle cx="6.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /><path d="M8.3 15.7 17 5M15.7 15.7 7 5" /></>),
};

export function Icon({ name, size = 18, className = "", stroke = 1.75 }: { name: string; size?: number; className?: string; stroke?: number }) {
  const glyph = P[name];
  if (!glyph) {
    /* Unknown names render as a two-letter monogram: "Ps", "Ai", "Ae"... */
    return (
      <span className={`inline-flex items-center justify-center font-bold leading-none ${className}`} style={{ fontSize: size * 0.72 }}>
        {name.slice(0, 2)}
      </span>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {glyph}
    </svg>
  );
}

export const ICON_NAMES = Object.keys(P);
