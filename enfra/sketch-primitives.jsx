// Sketch primitives — hand-drawn-ish UI atoms for low-fi wireframes.
// "Sketchy vibe": hand-feel font, thin charcoal strokes on cream paper,
// a single lime accent, dashed placeholders for imagery/data.
//
// Mid-fi mode (variant === 'midfi') swaps to clean ENFRA system styling.

const SKETCH = {
  paper:    '#FBF8F1',
  paperAlt: '#F5F0E4',
  ink:      '#1F2937',
  inkSoft:  '#4B5563',
  inkMute:  '#9CA3AF',
  rule:     '#374151',
  ruleSoft: '#9CA3AF',
  lime:     '#D6EF4B',
  steel:    '#557F7F',
  ocean:    '#092B24',
  iced:     '#D3E7E0',
};

// "Hand" font stack — Caveat for headings, Architects Daughter for labels,
// Patrick Hand for body. Loaded via Google Fonts in the host page.
const handDisplay = `"Caveat", "Patrick Hand", "Comic Sans MS", cursive`;
const handLabel   = `"Architects Daughter", "Caveat", cursive`;
const handBody    = `"Patrick Hand", "Caveat", "Comic Sans MS", cursive`;

// ─── Sketch Frame ──────────────────────────────────────────────
// A "page" frame: cream paper, charcoal border with a tiny offset
// "shadow line" behind it for the hand-drawn feel.
function SketchFrame({ children, label, w = 1280, h = 820, scale = 0.5 }) {
  return (
    <div style={{
      position: 'relative',
      width: w * scale,
      height: h * scale,
      fontFamily: handBody,
    }}>
      {/* offset shadow line */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: 'translate(4px, 5px)',
        border: `1.5px solid ${SKETCH.ruleSoft}`,
        borderRadius: 6,
        background: 'transparent',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: SKETCH.paper,
        border: `1.75px solid ${SKETCH.rule}`,
        borderRadius: 6,
        overflow: 'hidden',
      }}>
        <div style={{
          width: w, height: h,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}>
          {children}
        </div>
      </div>
      {label && (
        <div style={{
          position: 'absolute', top: -22, left: 4,
          fontFamily: handLabel,
          fontSize: 13, color: SKETCH.inkSoft,
          letterSpacing: '0.04em',
        }}>{label}</div>
      )}
    </div>
  );
}

// ─── Box / Tile / Card primitives ──────────────────────────────
function SBox({ children, style, dashed, accent, soft, ...rest }) {
  const border = dashed
    ? `1.5px dashed ${SKETCH.ruleSoft}`
    : `1.5px solid ${SKETCH.rule}`;
  const bg = accent ? SKETCH.lime
        : soft ? SKETCH.paperAlt
        : 'transparent';
  return (
    <div {...rest} style={{
      border, background: bg, borderRadius: 4,
      ...style,
    }}>{children}</div>
  );
}

function SLabel({ children, style, eyebrow }) {
  return (
    <div style={{
      fontFamily: handLabel,
      fontSize: eyebrow ? 11 : 14,
      letterSpacing: eyebrow ? '0.12em' : 0,
      textTransform: eyebrow ? 'uppercase' : 'none',
      color: eyebrow ? SKETCH.inkSoft : SKETCH.ink,
      ...style,
    }}>{children}</div>
  );
}

function SHeading({ children, style, size = 28 }) {
  return (
    <div style={{
      fontFamily: handDisplay,
      fontSize: size,
      lineHeight: 1.05,
      color: SKETCH.ink,
      ...style,
    }}>{children}</div>
  );
}

// ─── Numeric placeholder — a wavy "data" slug ──────────────────
function SNum({ children, big, accent, style }) {
  return (
    <div style={{
      fontFamily: handDisplay,
      fontSize: big ? 44 : 28,
      lineHeight: 1,
      color: accent ? SKETCH.ocean : SKETCH.ink,
      ...style,
    }}>{children}</div>
  );
}

// ─── KPI tile ──────────────────────────────────────────────────
function SKpi({ label, value, sub, accent, dense }) {
  return (
    <SBox style={{
      padding: dense ? '10px 14px' : '14px 18px',
      flex: 1, minHeight: dense ? 64 : 88,
      background: accent ? 'rgba(214,239,75,0.18)' : SKETCH.paper,
      borderColor: accent ? SKETCH.ocean : SKETCH.rule,
    }}>
      <SLabel eyebrow>{label}</SLabel>
      <SNum big={!dense} style={{ marginTop: dense ? 4 : 8 }}>{value}</SNum>
      {sub && <SLabel style={{ fontSize: 12, color: SKETCH.inkSoft, marginTop: 4 }}>{sub}</SLabel>}
    </SBox>
  );
}

// ─── Dropdown / pill / chip ────────────────────────────────────
function SDropdown({ label, value, w = 140 }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      border: `1.5px solid ${SKETCH.rule}`,
      borderRadius: 4,
      padding: '6px 10px',
      background: SKETCH.paper,
      width: w,
      fontFamily: handBody,
      fontSize: 14,
      justifyContent: 'space-between',
    }}>
      <span style={{ color: SKETCH.inkSoft, fontFamily: handLabel, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ color: SKETCH.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{value}</span>
        <span style={{ fontSize: 10 }}>▾</span>
      </span>
    </div>
  );
}

function SPill({ children, accent, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px',
      border: `1.5px solid ${accent ? SKETCH.ocean : SKETCH.rule}`,
      borderRadius: 999,
      background: accent ? SKETCH.lime : SKETCH.paper,
      fontFamily: handBody, fontSize: 12,
      color: SKETCH.ink,
      ...style,
    }}>{children}</span>
  );
}

// ─── Squiggle line — for placeholder text ──────────────────────
function SSquiggle({ w = 80, opacity = 0.55 }) {
  return (
    <svg width={w} height={8} viewBox={`0 0 ${w} 8`} style={{ display: 'block', opacity }}>
      <path d={`M 2 4 Q 8 1, 14 4 T 26 4 T 38 4 T 50 4 T 62 4 T 74 4 T ${w-2} 4`}
            fill="none" stroke={SKETCH.inkSoft} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

// Filler "lorem-ipsum" of horizontal lines
function SLines({ count = 3, widths }) {
  const ws = widths || Array.from({length: count}, (_,i) => [180, 220, 140, 200, 160][i % 5]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {ws.map((w, i) => (
        <div key={i} style={{ height: 6, width: w, background: SKETCH.ruleSoft, opacity: 0.55, borderRadius: 2 }} />
      ))}
    </div>
  );
}

// ─── Button ────────────────────────────────────────────────────
function SBtn({ children, accent, ghost, size = 'md', style }) {
  const pad = size === 'sm' ? '5px 12px' : '8px 16px';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad,
      border: `1.5px solid ${SKETCH.ocean}`,
      borderRadius: 4,
      background: accent ? SKETCH.lime : (ghost ? 'transparent' : SKETCH.paper),
      fontFamily: handBody,
      fontSize: size === 'sm' ? 13 : 14,
      color: SKETCH.ocean,
      ...style,
    }}>{children}</span>
  );
}

// ─── Icon placeholder — a tiny outlined glyph using SVG ────────
function SIcon({ kind = 'box', size = 14, color }) {
  const c = color || SKETCH.inkSoft;
  const s = { width: size, height: size, display: 'inline-block', verticalAlign: 'middle' };
  if (kind === 'pin') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <path d="M12 2 C7 2 4 6 4 10 C4 16 12 22 12 22 C12 22 20 16 20 10 C20 6 17 2 12 2 Z"/>
      <circle cx="12" cy="10" r="2.5"/>
    </svg>
  );
  if (kind === 'bolt') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <path d="M13 2 L4 14 H11 L9 22 L20 9 H13 Z"/>
    </svg>
  );
  if (kind === 'plus') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 5 V19 M5 12 H19"/>
    </svg>
  );
  if (kind === 'search') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <circle cx="11" cy="11" r="6"/>
      <path d="M16 16 L21 21" strokeLinecap="round"/>
    </svg>
  );
  if (kind === 'chevron') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 6 L15 12 L9 18"/>
    </svg>
  );
  if (kind === 'home') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <path d="M3 11 L12 3 L21 11 V21 H14 V14 H10 V21 H3 Z"/>
    </svg>
  );
  if (kind === 'building') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <rect x="4" y="3" width="16" height="18" rx="1"/>
      <path d="M8 7 H10 M14 7 H16 M8 11 H10 M14 11 H16 M8 15 H10 M14 15 H16"/>
    </svg>
  );
  if (kind === 'event') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <path d="M12 2 L4 14 H11 L9 22 L20 9 H13 Z"/>
      <circle cx="20" cy="4" r="3" fill={SKETCH.lime} stroke="none"/>
    </svg>
  );
  if (kind === 'list') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 6 H20 M4 12 H20 M4 18 H20"/>
    </svg>
  );
  if (kind === 'grid') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
  if (kind === 'map') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <path d="M3 6 L9 4 L15 6 L21 4 V18 L15 20 L9 18 L3 20 Z"/>
      <path d="M9 4 V18 M15 6 V20"/>
    </svg>
  );
  if (kind === 'gear') return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22 M5 5 L7 7 M17 17 L19 19 M5 19 L7 17 M17 7 L19 5"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none" stroke={c} strokeWidth="1.6">
      <rect x="4" y="4" width="16" height="16" rx="1"/>
    </svg>
  );
}

// ─── Sketchy US map ────────────────────────────────────────────
// A simplified outline of CONUS — hand-rendered feel via slightly wobbled path.
// Used inside the dashboards.
function SketchUSMap({ height = 360, choropleth = true, pins = true, highlightedState }) {
  // Simplified rectangles per "region" approximating state clusters.
  // We don't draw all 50 — just enough to read as the US.
  // Each entry: [x, y, w, h, fill, label]
  const cells = [
    // West coast
    [22, 90, 60, 110, 'mid', 'CA'],
    [22, 60, 60, 30,  'mid', 'OR'],
    [22, 30, 60, 30,  'low', 'WA'],
    // Mountain
    [86, 40, 70, 70,  'low', 'ID/MT'],
    [86, 112, 70, 50, 'low', 'NV'],
    [86, 164, 70, 36, 'mid', 'AZ'],
    [160, 40, 70, 80, 'low', 'WY/UT'],
    [160, 124, 70, 76,'low', 'CO/NM'],
    // Plains
    [234, 40, 80, 50, 'low', 'ND/SD'],
    [234, 92, 80, 50, 'low', 'NE/KS'],
    [234, 144, 80, 56,'mid', 'OK'],
    // Texas — big highlighted cell
    [234, 200, 110, 60, 'high', 'TX'],
    // Midwest
    [318, 40, 90, 70, 'mid', 'MN/WI'],
    [318, 112, 90, 50, 'mid', 'IA/MO'],
    [318, 164, 70, 36, 'mid', 'AR'],
    // Great Lakes / Northeast inner
    [410, 40, 90, 50, 'mid', 'MI'],
    [410, 92, 70, 50, 'high','IL/IN'],
    [482, 92, 70, 50, 'mid', 'OH'],
    [410, 144, 60, 50, 'mid', 'TN/KY'],
    [472, 144, 80, 50, 'high','VA/NC'],
    // Southeast
    [388, 200, 80, 50, 'mid', 'MS/AL'],
    [470, 200, 50, 50, 'high','GA'],
    [522, 200, 50, 50, 'mid', 'FL'],
    [522, 250, 50, 30, 'mid', 'FL-S'],
    // Northeast cluster
    [554, 40, 50, 50, 'high','NY'],
    [604, 40, 30, 30, 'mid', 'VT/NH'],
    [604, 70, 30, 20, 'mid', 'MA'],
    [554, 92, 60, 30, 'high','PA'],
    [614, 92, 30, 30, 'mid', 'NJ'],
    [554, 124, 90, 30, 'mid', 'WV/MD/DE'],
  ];
  const pinDots = pins ? [
    // California cluster
    [40, 130], [50, 145], [35, 165], [55, 160], [45, 180], [38, 110], [52, 120],
    // Texas cluster
    [270, 220], [290, 230], [310, 215], [285, 240], [325, 235], [260, 240],
    // Midwest
    [350, 105], [375, 130], [395, 95], [430, 115], [455, 105], [430, 75],
    // Northeast
    [575, 60], [595, 75], [580, 105], [610, 110], [625, 50],
    // Southeast
    [490, 215], [510, 235], [475, 220], [535, 225], [500, 175], [495, 155],
    // Pacific NW
    [40, 50], [55, 75], [30, 78],
    // Plains
    [255, 105], [280, 60], [270, 165], [295, 175],
  ] : [];

  const fillFor = (k) => {
    if (!choropleth) return SKETCH.paperAlt;
    if (k === 'high') return 'rgba(85,127,127,0.55)';   // steel
    if (k === 'mid')  return 'rgba(85,127,127,0.30)';
    return 'rgba(85,127,127,0.12)';
  };

  return (
    <svg viewBox="0 0 670 290" width="100%" height={height} style={{ display: 'block' }}>
      {/* outer wobbly border for "drawn map" feel */}
      <rect x="4" y="4" width="662" height="282" rx="6"
            fill="none" stroke={SKETCH.ruleSoft} strokeWidth="1.2" strokeDasharray="3,3" opacity="0.5"/>
      {cells.map(([x, y, w, h, k, label], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h}
                fill={highlightedState === label ? SKETCH.lime : fillFor(k)}
                stroke={SKETCH.rule} strokeWidth="1"
                strokeLinejoin="round"
                style={{ opacity: 0.95 }}/>
          <text x={x + w/2} y={y + h/2 + 3} textAnchor="middle"
                fontFamily={handLabel} fontSize="9" fill={SKETCH.inkSoft}
                style={{ pointerEvents: 'none' }}>{label}</text>
        </g>
      ))}
      {/* pin dots */}
      {pinDots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3"
                fill={SKETCH.lime} stroke={SKETCH.ocean} strokeWidth="0.8"/>
      ))}
      {/* legend */}
      <g transform="translate(450, 262)">
        <rect width="14" height="8" fill="rgba(85,127,127,0.12)" stroke={SKETCH.rule} strokeWidth="0.6"/>
        <rect x="14" width="14" height="8" fill="rgba(85,127,127,0.30)" stroke={SKETCH.rule} strokeWidth="0.6"/>
        <rect x="28" width="14" height="8" fill="rgba(85,127,127,0.55)" stroke={SKETCH.rule} strokeWidth="0.6"/>
        <text x="46" y="7" fontFamily={handBody} fontSize="9" fill={SKETCH.inkSoft}>1 MW</text>
        <text x="180" y="7" fontFamily={handBody} fontSize="9" fill={SKETCH.inkSoft} textAnchor="end">220 MW</text>
      </g>
    </svg>
  );
}

// Annotation callout — used to label design intent on a wireframe.
function SAnnot({ x, y, w = 200, children, side = 'right' }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w,
      fontFamily: handLabel, fontSize: 12, lineHeight: 1.3,
      color: SKETCH.steel,
      pointerEvents: 'none',
    }}>
      <div style={{
        borderLeft: side === 'right' ? `2px solid ${SKETCH.steel}` : 'none',
        borderRight: side === 'left' ? `2px solid ${SKETCH.steel}` : 'none',
        paddingLeft: side === 'right' ? 8 : 0,
        paddingRight: side === 'left' ? 8 : 0,
        textAlign: side,
      }}>{children}</div>
    </div>
  );
}

Object.assign(window, {
  SKETCH, handDisplay, handLabel, handBody,
  SketchFrame, SBox, SLabel, SHeading, SNum, SKpi,
  SDropdown, SPill, SSquiggle, SLines, SBtn, SIcon,
  SketchUSMap, SAnnot,
});
