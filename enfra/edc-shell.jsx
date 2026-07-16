// EDC shell components — top header, filter bar, sidebar, breadcrumbs.
// Used by every wireframe variant; rendered inside SketchFrame.

const SHELL_W = 1280;

// ─── Top header (dark, ENFRA chrome) ──────────────────────────
function EdcHeader({ user = 'PAM · S. Reyes', title = 'ENFRA Demand Center', eventActive }) {
  return (
    <div style={{
      height: 56,
      background: SKETCH.ocean,
      borderBottom: `1.5px solid ${SKETCH.rule}`,
      display: 'flex', alignItems: 'center',
      padding: '0 22px',
      gap: 18,
      color: '#fff',
      fontFamily: handBody,
    }}>
      {/* logo lockup — mark + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 26, height: 26,
          background: SKETCH.lime,
          border: `1.5px solid ${SKETCH.lime}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: SKETCH.ocean, fontFamily: handDisplay, fontSize: 18,
        }}>E</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: handDisplay, fontSize: 20, color: '#fff' }}>ENFRA</span>
          <span style={{ fontFamily: handLabel, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: SKETCH.lime }}>Demand Center</span>
        </div>
      </div>
      {/* breadcrumb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, marginLeft: 28, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
        <SIcon kind="home" size={14} color="rgba(255,255,255,0.7)" />
        <span>Portfolio</span>
      </div>
      {eventActive && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 12px',
          background: 'rgba(214,239,75,0.18)',
          border: `1.25px solid ${SKETCH.lime}`,
          borderRadius: 4,
          fontSize: 12, color: SKETCH.lime, fontFamily: handBody,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: SKETCH.lime }} />
          1 EVENT ACTIVE — ERCOT
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
        <SIcon kind="search" size={15} color="rgba(255,255,255,0.7)" />
        <SIcon kind="gear" size={15} color="rgba(255,255,255,0.7)" />
        <div style={{
          width: 26, height: 26, borderRadius: 999,
          background: SKETCH.steel, border: `1.5px solid ${SKETCH.lime}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: handDisplay, fontSize: 13,
        }}>SR</div>
      </div>
    </div>
  );
}

// ─── Sidebar (collapsed rail with icons + labels) ─────────────
function EdcSidebar({ active = 'portfolio', collapsed }) {
  const items = [
    ['portfolio',  'home',     'Portfolio'],
    ['clients',    'building', 'Clients'],
    ['sites',      'pin',      'Sites'],
    ['equipment',  'bolt',     'Equipment'],
    ['events',     'event',    'DR Events'],
    ['enrollment', 'plus',     'Enrollment'],
    ['reports',    'list',     'Reports'],
  ];
  const w = collapsed ? 64 : 208;
  return (
    <div style={{
      width: w, flexShrink: 0,
      background: SKETCH.paper,
      borderRight: `1.5px solid ${SKETCH.rule}`,
      padding: '12px 0',
      fontFamily: handBody,
    }}>
      {items.map(([k, icon, label]) => {
        const on = k === active;
        return (
          <div key={k} style={{
            display: 'flex', alignItems: 'center',
            gap: 12, padding: collapsed ? '10px 0' : '10px 16px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderLeft: on ? `3px solid ${SKETCH.steel}` : '3px solid transparent',
            background: on ? 'rgba(85,127,127,0.10)' : 'transparent',
            color: on ? SKETCH.ocean : SKETCH.inkSoft,
            fontSize: 14,
          }}>
            <SIcon kind={icon} size={16} color={on ? SKETCH.ocean : SKETCH.inkSoft} />
            {!collapsed && <span style={{ fontFamily: handBody }}>{label}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Filter bar (primary pattern: row of dropdowns) ───────────
function EdcFilterBar({ scope = 'portfolio', filters = {}, search = true, dense, chips }) {
  const dd = [
    ['ISO', filters.iso || 'All'],
    ['Project Phase', filters.phase || 'All'],
    ['Equipment', filters.equipment || 'All'],
    ['State', filters.state || 'All'],
    ['Client Type', filters.clientType || 'All'],
    ['Utility', filters.utility || 'All'],
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: dense ? '8px 22px' : '12px 22px',
      borderBottom: `1.5px solid ${SKETCH.rule}`,
      background: SKETCH.paperAlt,
      flexWrap: 'wrap',
    }}>
      {search && (
        <div style={{
          flex: '1 1 320px', minWidth: 280, maxWidth: 420,
          display: 'flex', alignItems: 'center', gap: 8,
          border: `1.5px solid ${SKETCH.rule}`, borderRadius: 4,
          padding: '6px 10px', background: SKETCH.paper,
        }}>
          <SIcon kind="search" size={14} />
          <span style={{ fontFamily: handBody, fontSize: 13, color: SKETCH.inkMute }}>
            Search clients, sites, equipment, account #…
          </span>
        </div>
      )}
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {dd.map(([l, v]) => <SDropdown key={l} label={l} value={v} w={l === 'Project Phase' ? 160 : 130} />)}
      </div>
      {chips && (
        <div style={{ flexBasis: '100%', display: 'flex', gap: 6, marginTop: 6 }}>
          <SLabel eyebrow style={{ alignSelf: 'center', marginRight: 4 }}>Active:</SLabel>
          <SPill accent>ISO: ERCOT ×</SPill>
          <SPill>Phase: 1, 2 ×</SPill>
          <SPill>Equipment: BESS ×</SPill>
          <SPill>State: TX ×</SPill>
          <span style={{ alignSelf: 'center', fontFamily: handLabel, fontSize: 12, color: SKETCH.steel, marginLeft: 6, textDecoration: 'underline' }}>Clear all</span>
        </div>
      )}
    </div>
  );
}

// ─── Compact page title strip (sits above filter bar in some variants) ─
function EdcTitleStrip({ title, sub, eyebrow, actions }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '16px 22px 12px',
      borderBottom: `1px dashed ${SKETCH.ruleSoft}`,
    }}>
      <div>
        {eyebrow && <SLabel eyebrow style={{ marginBottom: 4 }}>{eyebrow}</SLabel>}
        <SHeading size={28}>{title}</SHeading>
        {sub && <SLabel style={{ color: SKETCH.inkSoft, marginTop: 2 }}>{sub}</SLabel>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {actions || <>
          <SBtn ghost>Export</SBtn>
          <SBtn accent><SIcon kind="plus" size={12} color={SKETCH.ocean} /> Enroll Equipment</SBtn>
        </>}
      </div>
    </div>
  );
}

// ─── Breadcrumb scope-trail (used in drilldown variants) ──────
function EdcScopeTrail({ trail }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 22px',
      borderBottom: `1px dashed ${SKETCH.ruleSoft}`,
      fontFamily: handBody, fontSize: 13, color: SKETCH.inkSoft,
    }}>
      {trail.map((seg, i) => (
        <React.Fragment key={i}>
          {i > 0 && <SIcon kind="chevron" size={11} color={SKETCH.inkMute} />}
          <span style={{ color: i === trail.length - 1 ? SKETCH.ocean : SKETCH.inkSoft }}>
            <SLabel eyebrow style={{ display: 'inline', marginRight: 4 }}>{seg.kind}</SLabel>
            {seg.name}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Event banner (live event called) ─────────────────────────
function EdcEventBanner({ on }) {
  if (!on) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '10px 22px',
      background: SKETCH.lime,
      borderBottom: `1.5px solid ${SKETCH.ocean}`,
      fontFamily: handBody,
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: handLabel, fontSize: 11, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: SKETCH.ocean,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: SKETCH.ocean }} />
        Live Event
      </span>
      <span style={{ fontSize: 14, color: SKETCH.ocean }}>
        ERCOT 4CP · 14 sites · 28.4 MW called · started 14:02 CT · ends ~17:00 CT
      </span>
      <div style={{ flex: 1 }} />
      <span style={{ fontFamily: handBody, fontSize: 13, color: SKETCH.ocean }}>
        Performance:&nbsp;
        <span style={{ fontFamily: handDisplay, fontSize: 18 }}>96.4%</span>
      </span>
      <SBtn>Open Event →</SBtn>
    </div>
  );
}

Object.assign(window, {
  EdcHeader, EdcSidebar, EdcFilterBar, EdcTitleStrip,
  EdcScopeTrail, EdcEventBanner, SHELL_W,
});
