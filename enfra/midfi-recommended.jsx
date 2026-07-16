// Mid-fi recommended portfolio dashboard — clean ENFRA system styling.
// Same content as Variant A, but rendered with real type, color, and density
// per the EaaS design system. This is the "if we build one direction" pick.

const M = {
  paper:  '#FFFFFF',
  bg:     '#F9FAFB',
  bgAlt:  '#F0F5F5',
  ink:    '#111827',
  ink2:   '#374151',
  ink3:   '#6B7280',
  ink4:   '#9CA3AF',
  border: '#E5E7EB',
  border2:'#D1D5DB',
  ocean:  '#092B24',
  steel:  '#557F7F',
  iced:   '#D3E7E0',
  lime:   '#D6EF4B',
  limeHv: '#C5DE3A',
};
const sansM  = '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const monoM  = '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

function MidEyebrow({ children, style }) {
  return <div style={{ fontFamily: sansM, fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: M.ink3, ...style }}>{children}</div>;
}
function MidNum({ children, size = 28, color }) {
  return <div style={{ fontFamily: monoM, fontWeight: 600, fontSize: size, lineHeight: 1.05, color: color || M.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{children}</div>;
}

function MidHeader({ eventActive }) {
  return (
    <div style={{ height: 56, background: M.ocean, color:'#fff', display:'flex', alignItems:'center', padding: '0 22px', gap: 18, fontFamily: sansM }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{ width: 26, height: 26, background: M.lime, display:'flex', alignItems:'center', justifyContent:'center', color: M.ocean, fontWeight: 800, fontSize: 14, borderRadius: 3 }}>E</div>
        <div style={{ display:'flex', alignItems:'baseline', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' }}>ENFRA</span>
          <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform:'uppercase', color: M.lime, fontWeight: 600 }}>Demand Center</span>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap: 8, marginLeft: 28, fontSize: 13, color:'rgba(255,255,255,0.7)' }}>
        <span>Portfolio</span>
      </div>
      <div style={{ flex: 1 }} />
      {eventActive && (
        <div style={{ display:'flex', alignItems:'center', gap: 8, padding: '5px 12px', background:'rgba(214,239,75,0.16)', border: `1px solid ${M.lime}`, borderRadius: 4, fontSize: 11, color: M.lime, fontWeight: 600, letterSpacing: '0.06em' }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: M.lime, boxShadow: '0 0 0 3px rgba(214,239,75,0.25)' }} />
          1 EVENT ACTIVE · ERCOT
        </div>
      )}
      <div style={{ display:'flex', alignItems:'center', gap: 14, color:'rgba(255,255,255,0.85)' }}>
        <SIcon kind="search" size={15} color="rgba(255,255,255,0.7)" />
        <SIcon kind="gear" size={15} color="rgba(255,255,255,0.7)" />
        <div style={{ width: 28, height: 28, borderRadius: 999, background: M.steel, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 11, fontWeight: 600 }}>SR</div>
      </div>
    </div>
  );
}

function MidSidebar() {
  const items = [
    ['Portfolio',   'home',     true],
    ['Clients',     'building', false],
    ['Sites',       'pin',      false],
    ['Equipment',   'bolt',     false],
    ['DR Events',   'event',    false],
    ['Enrollment',  'plus',     false],
    ['Reports',     'list',     false],
  ];
  return (
    <div style={{ width: 208, background: M.paper, borderRight: `1px solid ${M.border}`, padding: '12px 0' }}>
      {items.map(([l, ic, on])=>(
        <div key={l} style={{
          display:'flex', alignItems:'center', gap: 12,
          padding:'9px 16px',
          borderLeft: on ? `3px solid ${M.steel}` : '3px solid transparent',
          background: on ? 'rgba(85,127,127,0.08)' : 'transparent',
          color: on ? M.ocean : M.ink3,
          fontFamily: sansM, fontSize: 13.5, fontWeight: on ? 600 : 500,
        }}>
          <SIcon kind={ic} size={16} color={on ? M.ocean : M.ink3} />
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}

function MidEventBanner({ on }) {
  if (!on) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 16, padding: '10px 22px', background: M.lime, borderBottom: `1px solid ${M.ocean}`, fontFamily: sansM }}>
      <span style={{ display:'inline-flex', alignItems:'center', gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform:'uppercase', color: M.ocean }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: M.ocean, boxShadow: '0 0 0 3px rgba(9,43,36,0.18)' }} />
        Live Event
      </span>
      <span style={{ fontSize: 13, color: M.ocean }}>
        ERCOT 4CP · 14 sites · <span style={{ fontFamily: monoM, fontWeight: 700 }}>28.4 MW</span> called · started 14:02 CT · ends ~17:00 CT
      </span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 12, color: M.ocean, display:'flex', alignItems:'center', gap: 8 }}>
        Performance
        <span style={{ fontFamily: monoM, fontWeight: 700, fontSize: 18 }}>96.4%</span>
      </span>
      <button style={{ padding: '6px 14px', background: M.ocean, color:'#fff', border:'none', borderRadius: 4, fontFamily: sansM, fontSize: 12, fontWeight: 600, cursor:'pointer' }}>Open Event →</button>
    </div>
  );
}

function MidFilterBar() {
  const dd = [
    ['ISO', 'All ISOs', 130],
    ['Project Phase', 'All phases', 150],
    ['Equipment', 'All types', 140],
    ['State', 'All states', 130],
    ['Client Type', 'All verticals', 150],
    ['Utility', 'All utilities', 150],
  ];
  return (
    <div style={{ display:'flex', gap: 8, padding: '12px 22px', borderBottom: `1px solid ${M.border}`, background: M.paper, alignItems:'center' }}>
      <div style={{
        flex: '1 1 320px', maxWidth: 380,
        display:'flex', alignItems:'center', gap: 8,
        border: `1px solid ${M.border2}`, borderRadius: 4, padding: '6px 10px', background: M.paper,
      }}>
        <SIcon kind="search" size={14} color={M.ink4} />
        <span style={{ fontFamily: sansM, fontSize: 13, color: M.ink4 }}>Search clients, sites, equipment, account #…</span>
        <span style={{ marginLeft: 'auto', fontFamily: monoM, fontSize: 11, color: M.ink4, border: `1px solid ${M.border}`, borderRadius: 3, padding: '1px 5px' }}>⌘K</span>
      </div>
      {dd.map(([l, v, w])=>(
        <button key={l} style={{
          width: w, padding: '7px 10px',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap: 6,
          border: `1px solid ${M.border2}`, borderRadius: 4, background: M.paper,
          fontFamily: sansM, fontSize: 13, color: M.ink, cursor:'pointer',
        }}>
          <span style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', lineHeight: 1.2 }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.10em', textTransform:'uppercase', color: M.ink3 }}>{l}</span>
            <span style={{ fontSize: 12.5 }}>{v}</span>
          </span>
          <span style={{ fontSize: 9, color: M.ink3 }}>▾</span>
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <button style={{ padding: '7px 12px', border:'none', background:'transparent', fontFamily: sansM, fontSize: 12, color: M.steel, fontWeight: 600 }}>Save view</button>
    </div>
  );
}

function MidKpiTile({ label, value, sub, accent, deltaUp, delta }) {
  return (
    <div style={{
      padding: '14px 16px', background: M.paper, position:'relative',
      borderLeft: accent ? `3px solid ${M.lime}` : 'none',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <MidEyebrow>{label}</MidEyebrow>
        {delta && (
          <span style={{ fontFamily: monoM, fontSize: 10, color: deltaUp ? '#166534' : M.ink3 }}>
            {deltaUp ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
      <MidNum size={28} color={M.ocean}>{value}</MidNum>
      <div style={{ fontFamily: sansM, fontSize: 11, color: M.ink3, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function MidRecommendedDashboard({ eventBanner }) {
  return (
    <SketchFrame label="MID-FI · Recommended direction (Variant A polished, ENFRA system)" w={1280} h={820} scale={0.5}>
      <div style={{ background: M.bg, height: '100%', fontFamily: sansM, color: M.ink }}>
        <MidHeader eventActive={eventBanner} />
        <MidEventBanner on={eventBanner} />
        <div style={{ display:'flex', height: `calc(100% - 56px${eventBanner ? ' - 41px' : ''})` }}>
          <MidSidebar />
          <div style={{ flex: 1, overflow:'hidden', background: M.bg }}>
            {/* title strip */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', padding:'18px 24px 14px', background: M.paper, borderBottom: `1px solid ${M.border}` }}>
              <div>
                <MidEyebrow style={{ marginBottom: 4 }}>Portfolio · All Clients</MidEyebrow>
                <h1 style={{ margin: 0, fontFamily: sansM, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', color: M.ink }}>Demand Center Overview</h1>
                <div style={{ fontSize: 12, color: M.ink3, marginTop: 4 }}>342 sites · 47 clients · last refreshed 4 min ago</div>
              </div>
              <div style={{ display:'flex', gap: 8 }}>
                <button style={{ padding:'7px 14px', border:`1px solid ${M.border2}`, background: M.paper, borderRadius: 4, fontFamily: sansM, fontSize: 12.5, fontWeight: 500, color: M.ink2 }}>Export</button>
                <button style={{ padding:'7px 14px', border:`1px solid ${M.ocean}`, background: M.lime, borderRadius: 4, fontFamily: sansM, fontSize: 12.5, fontWeight: 600, color: M.ocean, display:'flex', alignItems:'center', gap: 5 }}>
                  <SIcon kind="plus" size={11} color={M.ocean} /> Enroll Equipment
                </button>
              </div>
            </div>
            <MidFilterBar />
            <div style={{ padding: 24, display:'flex', flexDirection:'column', gap: 16 }}>
              {/* KPI strip — welded look (gap-px on dark border bg) */}
              <div style={{ display:'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: M.border, borderRadius: 8, overflow:'hidden', border: `1px solid ${M.border}` }}>
                <MidKpiTile label="Total Sites"        value="342"    sub="28 states"            delta="+6" deltaUp />
                <MidKpiTile label="Total Clients"      value="47"     sub="4 verticals"          delta="+2" deltaUp />
                <MidKpiTile label="Peak Demand"        value="618"    sub="MW · last fiscal yr"  delta="+4.2%" deltaUp />
                <MidKpiTile label="Available MW"       value="184.2"  sub="enrolled capacity"    delta="+12.4 MW" deltaUp accent />
                <MidKpiTile label="Active Enrollments" value="512"    sub="across 38 programs"   delta="+18" deltaUp />
                <MidKpiTile label="Est. Annual Savings" value="$24.8M" sub="gross · current FY"  delta="+8.1%" deltaUp />
              </div>
              {/* Map card */}
              <div style={{ background: M.paper, border: `1px solid ${M.border}`, borderRadius: 8, overflow:'hidden' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 16px', borderBottom: `1px solid ${M.border}` }}>
                  <MidEyebrow>Enrolled MW by State · click to filter</MidEyebrow>
                  <div style={{ display:'flex', gap: 4, alignItems:'center' }}>
                    <span style={{ fontSize: 11, color: M.ink3, marginRight: 6 }}>View</span>
                    {[['Choropleth', true], ['Pins', false], ['Both', false]].map(([l, on])=>(
                      <button key={l} style={{ padding: '4px 10px', border: `1px solid ${on ? M.ocean : M.border2}`, background: on ? M.ocean : M.paper, color: on ? '#fff' : M.ink2, borderRadius: 4, fontFamily: sansM, fontSize: 11, fontWeight: 500 }}>{l}</button>
                    ))}
                  </div>
                </div>
                <div style={{ padding: 12, background: M.bgAlt }}>
                  <SketchUSMap height={320} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

Object.assign(window, { MidRecommendedDashboard });
