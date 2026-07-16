// Mid-fi shared primitives. Tokens, header, sidebar, filter bar (Pattern B),
// title strip, KPI tile, event banner. Used by every mid-fi screen.

const T = {
  paper: '#FFFFFF', bg: '#F9FAFB', bgAlt: '#F0F5F5',
  ink: '#111827', ink2: '#374151', ink3: '#6B7280', ink4: '#9CA3AF',
  border: '#E5E7EB', border2: '#D1D5DB', borderSoft: '#F3F4F6',
  ocean: '#092B24', steel: '#557F7F', iced: '#D3E7E0', icedSoft:'#F0F5F5',
  lime: '#D6EF4B', limeHv: '#C5DE3A',
  ok: '#166534', okBg: '#DCFCE7',
  warn:'#92400E', warnBg:'#FEF3C7',
  err: '#991B1B', errBg:'#FEE2E2',
  info:'#1E40AF', infoBg:'#DBEAFE',
};
const sansT = '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const monoT = '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const Eyebrow = ({ children, style }) => (
  <div style={{ fontFamily: sansT, fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: T.ink3, ...style }}>{children}</div>
);
const Num = ({ children, size = 24, color, style }) => (
  <span style={{ fontFamily: monoT, fontWeight: 600, fontSize: size, lineHeight: 1.05, color: color || T.ocean, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', ...style }}>{children}</span>
);

// Status pill
const StatusPill = ({ kind = 'neutral', children, style }) => {
  const map = {
    ok: [T.okBg, T.ok], warn: [T.warnBg, T.warn], err: [T.errBg, T.err],
    info: [T.infoBg, T.info], neutral: [T.borderSoft, T.ink2],
    accent: [T.lime, T.ocean],
  };
  const [bg, fg] = map[kind] || map.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999,
      background: bg, color: fg,
      fontFamily: sansT, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.02em',
      ...style,
    }}>{children}</span>
  );
};

// Vertical chip (federal/healthcare/highered/municipal)
const VerticalChip = ({ vertical }) => {
  const map = {
    Federal:    [T.iced, T.ocean],
    Healthcare: ['rgba(214,239,75,0.30)', T.ocean],
    'Higher Ed':['rgba(85,127,127,0.14)', T.steel],
    Municipal:  ['rgba(211,204,196,0.55)', T.ocean],
  };
  const [bg, fg] = map[vertical] || [T.borderSoft, T.ink2];
  return (
    <span style={{
      padding: '1px 8px', borderRadius: 999, background: bg, color: fg,
      fontFamily: sansT, fontSize: 11, fontWeight: 600,
    }}>{vertical}</span>
  );
};

// ─── Header ───────────────────────────────────────────────────
const MfHeader = ({ eventActive, breadcrumb }) => (
  <div style={{ height: 56, background: T.ocean, color: '#fff', display: 'flex', alignItems: 'center', padding: '0 22px', gap: 18, fontFamily: sansT, flexShrink: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 26, height: 26, background: T.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ocean, fontWeight: 800, fontSize: 14, borderRadius: 3 }}>E</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' }}>ENFRA</span>
        <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.lime, fontWeight: 600 }}>Demand Center</span>
      </div>
    </div>
    {/* Breadcrumb */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 28, fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>
      {(breadcrumb || ['Portfolio']).map((s, i, a) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>}
          <span style={{ color: i === a.length - 1 ? '#fff' : 'rgba(255,255,255,0.72)' }}>{s}</span>
        </React.Fragment>
      ))}
    </div>
    <div style={{ flex: 1 }} />
    {eventActive && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'rgba(214,239,75,0.16)', border: `1px solid ${T.lime}`, borderRadius: 4, fontSize: 11, color: T.lime, fontWeight: 600, letterSpacing: '0.06em' }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: T.lime, boxShadow: '0 0 0 3px rgba(214,239,75,0.25)' }} />
        1 EVENT ACTIVE · ERCOT
      </div>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,0.85)' }}>
      <SIcon kind="search" size={15} color="rgba(255,255,255,0.7)" />
      <SIcon kind="gear" size={15} color="rgba(255,255,255,0.7)" />
      <div style={{ width: 28, height: 28, borderRadius: 999, background: T.steel, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>SR</div>
    </div>
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────
const MfSidebar = ({ active }) => {
  const items = [
    ['portfolio',  'Portfolio',  'home'],
    ['mysites',    'My Sites',   'pin'],
    ['clients',    'Clients',    'building'],
    ['sites',      'Sites',      'pin'],
    ['equipment',  'Equipment',  'bolt'],
    ['events',     'DR Events',  'event'],
    ['enrollment', 'Enrollment', 'plus'],
    ['reports',    'Reports',    'list'],
  ];
  return (
    <div style={{ width: 208, background: T.paper, borderRight: `1px solid ${T.border}`, padding: '12px 0', flexShrink: 0 }}>
      {items.map(([k, l, ic]) => {
        const on = k === active;
        return (
          <div key={k} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px',
            borderLeft: on ? `3px solid ${T.steel}` : '3px solid transparent',
            background: on ? 'rgba(85,127,127,0.08)' : 'transparent',
            color: on ? T.ocean : T.ink3,
            fontFamily: sansT, fontSize: 13.5, fontWeight: on ? 600 : 500,
            cursor: 'pointer',
          }}>
            <SIcon kind={ic} size={16} color={on ? T.ocean : T.ink3} />
            <span>{l}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Event banner (compact, scoped) ───────────────────────────
const MfEventBanner = ({ on }) => {
  if (!on) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '9px 22px', background: T.lime, borderBottom: `1px solid ${T.ocean}`, fontFamily: sansT, flexShrink: 0 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.ocean }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: T.ocean, boxShadow: '0 0 0 3px rgba(9,43,36,0.18)' }} />
        Live Event
      </span>
      <span style={{ fontSize: 13, color: T.ocean }}>
        ERCOT 4CP · 14 sites · <span style={{ fontFamily: monoT, fontWeight: 700 }}>28.4 MW</span> called · started 14:02 CT · ends ~17:00 CT
      </span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 12, color: T.ocean, display: 'flex', alignItems: 'center', gap: 8 }}>
        Performance
        <span style={{ fontFamily: monoT, fontWeight: 700, fontSize: 18 }}>96.4%</span>
      </span>
      <button style={{ padding: '6px 14px', background: T.ocean, color: '#fff', border: 'none', borderRadius: 4, fontFamily: sansT, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Open Event →</button>
    </div>
  );
};

// ─── Filter bar (Pattern B: dropdowns + chips + URL hint) ─────
const MfFilterBar = ({ chips = [], showSearch = true, onClear }) => {
  const dd = [
    ['ISO', 'All ISOs', 110],
    ['Project Phase', 'All phases', 130],
    ['Equipment', 'All types', 120],
    ['State', 'All states', 110],
    ['Client Type', 'All verticals', 130],
    ['Utility', 'All utilities', 130],
  ];
  const visible = chips.slice(0, 5);
  const hidden = chips.length - visible.length;
  return (
    <div style={{ background: T.paper, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: 8, padding: '11px 22px', alignItems: 'center' }}>
        {showSearch && (
          <div style={{
            flex: '1 1 280px', maxWidth: 340,
            display: 'flex', alignItems: 'center', gap: 8,
            border: `1px solid ${T.border2}`, borderRadius: 4, padding: '6px 10px', background: T.paper,
          }}>
            <SIcon kind="search" size={14} color={T.ink4} />
            <span style={{ fontFamily: sansT, fontSize: 13, color: T.ink4 }}>Search clients, sites, equipment…</span>
            <span style={{ marginLeft: 'auto', fontFamily: monoT, fontSize: 10, color: T.ink4, border: `1px solid ${T.border}`, borderRadius: 3, padding: '1px 5px' }}>⌘K</span>
          </div>
        )}
        {dd.map(([l, v, w]) => (
          <button key={l} style={{
            width: w, padding: '5px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
            border: `1px solid ${T.border2}`, borderRadius: 4, background: T.paper,
            fontFamily: sansT, fontSize: 13, color: T.ink, cursor: 'pointer',
          }}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: T.ink3 }}>{l}</span>
              <span style={{ fontSize: 12 }}>{v}</span>
            </span>
            <span style={{ fontSize: 9, color: T.ink3 }}>▾</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', fontFamily: sansT, fontSize: 12, color: T.steel, fontWeight: 600, cursor: 'pointer' }}>
          <SIcon kind="map" size={13} color={T.steel} /> Share view
        </button>
      </div>
      {chips.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 22px 11px', flexWrap: 'wrap' }}>
          <Eyebrow style={{ marginRight: 4 }}>Filters</Eyebrow>
          {visible.map((c, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 4px 3px 10px', borderRadius: 999,
              background: c.accent ? T.lime : T.icedSoft, color: T.ocean,
              border: `1px solid ${c.accent ? T.ocean : T.border}`,
              fontFamily: sansT, fontSize: 11, fontWeight: 600,
            }}>
              <span style={{ color: T.ink3, fontWeight: 500 }}>{c.label}:</span>
              <span>{c.value}</span>
              {c.count > 1 && <span style={{ color: T.ink3, fontWeight: 500 }}>({c.count})</span>}
              <span style={{
                width: 16, height: 16, borderRadius: 999,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: T.ink3, cursor: 'pointer', fontSize: 11,
              }}>×</span>
            </span>
          ))}
          {hidden > 0 && (
            <span style={{ padding: '3px 10px', borderRadius: 999, background: T.borderSoft, color: T.ink2, fontFamily: sansT, fontSize: 11, fontWeight: 600 }}>+{hidden} more</span>
          )}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: sansT, fontSize: 11, color: T.steel, textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }} onClick={onClear}>Clear all</span>
        </div>
      )}
    </div>
  );
};

// ─── Title strip with freshness + actions ─────────────────────
const MfTitleStrip = ({ eyebrow, title, sub, freshness, live, actions }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '18px 24px 14px', background: T.paper, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
    <div>
      {eyebrow && <Eyebrow style={{ marginBottom: 4 }}>{eyebrow}</Eyebrow>}
      <h1 style={{ margin: 0, fontFamily: sansT, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', color: T.ink }}>{title}</h1>
      {sub && <div style={{ fontSize: 12, color: T.ink3, marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>{sub}</span>
        {freshness && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: T.ink3 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: T.steel }} />
          {freshness}
        </span>}
        {live && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: T.steel, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: T.steel, boxShadow: '0 0 0 2px rgba(85,127,127,0.25)' }} />
          Live · SkySpark
        </span>}
      </div>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
  </div>
);

// ─── Buttons ──────────────────────────────────────────────────
const Btn = ({ children, kind = 'default', size = 'md', icon, onClick, style }) => {
  const sty = {
    default: { background: T.paper, color: T.ink2, border: `1px solid ${T.border2}` },
    primary: { background: T.ocean, color: '#fff', border: `1px solid ${T.ocean}` },
    accent:  { background: T.lime, color: T.ocean, border: `1px solid ${T.ocean}` },
    ghost:   { background: 'transparent', color: T.ink2, border: '1px solid transparent' },
    danger:  { background: T.paper, color: T.err, border: `1px solid ${T.border2}` },
  }[kind];
  const pad = size === 'sm' ? '5px 10px' : '7px 14px';
  const fs = size === 'sm' ? 12 : 12.5;
  return (
    <button onClick={onClick} style={{
      padding: pad, borderRadius: 4, fontFamily: sansT, fontSize: fs, fontWeight: 600,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, ...sty, ...style,
    }}>
      {icon && <SIcon kind={icon} size={fs} color={kind === 'primary' ? '#fff' : (kind === 'accent' ? T.ocean : T.ink2)} />}
      {children}
    </button>
  );
};

// ─── KPI tile (clickable variant supported) ───────────────────
const KpiTile = ({ label, value, sub, accent, delta, deltaUp, clickable }) => (
  <div style={{
    padding: '14px 16px', background: T.paper, position: 'relative',
    borderLeft: accent ? `3px solid ${T.lime}` : '3px solid transparent',
    cursor: clickable ? 'pointer' : 'default',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {delta && (
          <span style={{ fontFamily: monoT, fontSize: 10, color: deltaUp ? T.ok : T.ink3, fontWeight: 600 }}>
            {deltaUp ? '↑' : '↓'} {delta}
          </span>
        )}
        {clickable && <SIcon kind="chevron" size={11} color={T.ink4} />}
      </div>
    </div>
    <div style={{ marginTop: 2 }}>
      <Num size={26}>{value}</Num>
    </div>
    <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3, marginTop: 2 }}>{sub}</div>
  </div>
);

// Card shell
const Card = ({ title, eyebrow, action, children, style, padding = 16 }) => (
  <div style={{ background: T.paper, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', ...style }}>
    {(title || eyebrow) && (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${T.border}` }}>
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {title && <div style={{ fontFamily: sansT, fontSize: 13, fontWeight: 600, color: T.ink }}>{title}</div>}
        </div>
        {action}
      </div>
    )}
    <div style={{ padding }}>{children}</div>
  </div>
);

// Annotation overlay (kept on mid-fi for stakeholder review)
const MfAnnot = ({ x, y, w = 220, side = 'right', children }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w,
    fontFamily: sansT, fontSize: 11, lineHeight: 1.4,
    color: T.steel, pointerEvents: 'none', zIndex: 5,
  }}>
    <div style={{
      borderLeft: side === 'right' ? `2px solid ${T.lime}` : 'none',
      borderRight: side === 'left' ? `2px solid ${T.lime}` : 'none',
      paddingLeft: side === 'right' ? 8 : 0,
      paddingRight: side === 'left' ? 8 : 0,
      textAlign: side,
      background: 'rgba(255,255,255,0.92)',
      borderRadius: 2,
      padding: '4px 8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>{children}</div>
  </div>
);

// Frame for mid-fi screens (matches design canvas artboard size)
const MfFrame = ({ children, label, w = 1280, h = 820, scale = 0.5 }) => (
  <div style={{
    position: 'relative', width: w * scale, height: h * scale,
    fontFamily: sansT, background: T.bg,
    border: `1px solid ${T.border2}`, borderRadius: 6, overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  }}>
    <div style={{
      width: w, height: h,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      display: 'flex', flexDirection: 'column',
    }}>
      {children}
    </div>
    {label && (
      <div style={{
        position: 'absolute', top: -22, left: 4,
        fontFamily: sansT, fontSize: 12, fontWeight: 600,
        color: T.ink2, letterSpacing: '0.04em',
      }}>{label}</div>
    )}
  </div>
);

Object.assign(window, {
  T, sansT, monoT, Eyebrow, Num, StatusPill, VerticalChip,
  MfHeader, MfSidebar, MfEventBanner, MfFilterBar, MfTitleStrip,
  Btn, KpiTile, Card, MfAnnot, MfFrame,
});
