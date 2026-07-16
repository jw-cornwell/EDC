// Mid-fi Portfolio dashboard — polished landing page.
// Hover state on map → tooltip; click → drills into state with chip filter.
// Clickable KPIs. Pattern B chips. PAM "My sites" pre-filter.

const PORTFOLIO_KPIS = [
  { label: 'Total Sites',          value: '342',     sub: '28 states',          delta: '+6',     deltaUp: true,  clickable: true },
  { label: 'Total Clients',        value: '47',      sub: '4 verticals',        delta: '+2',     deltaUp: true,  clickable: true },
  { label: 'Peak Demand',          value: '618 MW',  sub: 'last fiscal year',   delta: '+4.2%',  deltaUp: true,  clickable: false },
  { label: 'Available MW',         value: '184.2',   sub: 'enrolled capacity',  delta: '+12.4',  deltaUp: true,  clickable: true, accent: true },
  { label: 'Active Enrollments',   value: '512',     sub: '38 programs',        delta: '+18',    deltaUp: true,  clickable: true },
  { label: 'Est. Annual Savings',  value: '$24.8M',  sub: 'gross · current FY', delta: '+8.1%',  deltaUp: true,  clickable: false },
];

// Interactive state on the map — hover tooltip
function InteractiveUSMap({ height = 360 }) {
  const [hover, setHover] = React.useState(null);
  const cells = [
    [22, 90, 60, 110, 'mid', 'CA', { sites: 67, mw: 42.4, savings: '$5.1M', iso: 'CAISO' }],
    [22, 60, 60, 30,  'mid', 'OR', { sites: 12, mw: 6.4, savings: '$0.6M', iso: 'CAISO' }],
    [22, 30, 60, 30,  'low', 'WA', { sites: 6, mw: 2.1, savings: '$0.2M', iso: 'CAISO' }],
    [86, 40, 70, 70,  'low', 'ID/MT', { sites: 4, mw: 1.4, savings: '$0.1M', iso: 'N/A' }],
    [86, 112, 70, 50, 'low', 'NV', { sites: 5, mw: 2.6, savings: '$0.3M', iso: 'CAISO' }],
    [86, 164, 70, 36, 'mid', 'AZ', { sites: 9, mw: 5.2, savings: '$0.5M', iso: 'N/A' }],
    [160, 40, 70, 80, 'low', 'WY/UT', { sites: 3, mw: 0.9, savings: '$0.1M', iso: 'N/A' }],
    [160, 124, 70, 76,'low', 'CO/NM', { sites: 8, mw: 3.8, savings: '$0.4M', iso: 'SPP' }],
    [234, 40, 80, 50, 'low', 'ND/SD', { sites: 2, mw: 0.4, savings: '<$0.1M', iso: 'MISO' }],
    [234, 92, 80, 50, 'low', 'NE/KS', { sites: 6, mw: 2.1, savings: '$0.2M', iso: 'SPP' }],
    [234, 144, 80, 56,'mid', 'OK', { sites: 11, mw: 6.8, savings: '$0.7M', iso: 'SPP' }],
    [234, 200, 110, 60, 'high', 'TX', { sites: 142, mw: 88.2, savings: '$8.2M', iso: 'ERCOT' }],
    [318, 40, 90, 70, 'mid', 'MN/WI', { sites: 18, mw: 9.4, savings: '$0.9M', iso: 'MISO' }],
    [318, 112, 90, 50, 'mid', 'IA/MO', { sites: 14, mw: 7.2, savings: '$0.8M', iso: 'MISO' }],
    [318, 164, 70, 36, 'mid', 'AR', { sites: 7, mw: 3.4, savings: '$0.3M', iso: 'MISO' }],
    [410, 40, 90, 50, 'mid', 'MI', { sites: 16, mw: 9.1, savings: '$0.9M', iso: 'MISO' }],
    [410, 92, 70, 50, 'high','IL/IN', { sites: 22, mw: 12.1, savings: '$1.4M', iso: 'PJM' }],
    [482, 92, 70, 50, 'mid', 'OH', { sites: 13, mw: 6.8, savings: '$0.7M', iso: 'PJM' }],
    [410, 144, 60, 50, 'mid', 'TN/KY', { sites: 9, mw: 4.4, savings: '$0.5M', iso: 'TVA' }],
    [472, 144, 80, 50, 'high','VA/NC', { sites: 14, mw: 7.3, savings: '$0.9M', iso: 'PJM' }],
    [388, 200, 80, 50, 'mid', 'MS/AL', { sites: 8, mw: 3.8, savings: '$0.4M', iso: 'TVA' }],
    [470, 200, 50, 50, 'high','GA', { sites: 18, mw: 9.8, savings: '$1.1M', iso: 'N/A' }],
    [522, 200, 50, 50, 'mid', 'FL', { sites: 13, mw: 6.4, savings: '$0.7M', iso: 'N/A' }],
    [522, 250, 50, 30, 'mid', 'FL-S', { sites: 8, mw: 4.1, savings: '$0.4M', iso: 'N/A' }],
    [554, 40, 50, 50, 'high','NY', { sites: 28, mw: 18.7, savings: '$2.1M', iso: 'NYISO' }],
    [604, 40, 30, 30, 'mid', 'VT/NH', { sites: 4, mw: 1.4, savings: '$0.2M', iso: 'ISONE' }],
    [604, 70, 30, 20, 'mid', 'MA', { sites: 11, mw: 4.8, savings: '$0.6M', iso: 'ISONE' }],
    [554, 92, 60, 30, 'high','PA', { sites: 19, mw: 10.4, savings: '$1.2M', iso: 'PJM' }],
    [614, 92, 30, 30, 'mid', 'NJ', { sites: 8, mw: 3.6, savings: '$0.4M', iso: 'PJM' }],
    [554, 124, 90, 30, 'mid', 'WV/MD/DE', { sites: 12, mw: 5.4, savings: '$0.6M', iso: 'PJM' }],
  ];
  const fillFor = (k) => k === 'high' ? 'rgba(85,127,127,0.55)' : k === 'mid' ? 'rgba(85,127,127,0.30)' : 'rgba(85,127,127,0.12)';
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 670 290" width="100%" height={height} style={{ display: 'block' }}>
        {cells.map(([x, y, w, h, k, label, data], i) => {
          const isHov = hover && hover.label === label;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={w} height={h}
                fill={isHov ? T.lime : fillFor(k)}
                stroke={isHov ? T.ocean : T.ink2} strokeWidth={isHov ? 1.5 : 0.7}
                style={{ cursor: 'pointer', transition: 'fill 120ms' }}
                onMouseEnter={(e) => {
                  const r = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                  const sr = e.currentTarget.getBoundingClientRect();
                  setHover({ label, data, x: sr.left - r.left + sr.width / 2, y: sr.top - r.top });
                }}
                onMouseLeave={() => setHover(null)}
              />
              <text x={x + w/2} y={y + h/2 + 3} textAnchor="middle"
                    fontFamily={sansT} fontSize="9" fontWeight="600" fill={isHov ? T.ocean : T.ink2}
                    style={{ pointerEvents: 'none' }}>{label}</text>
            </g>
          );
        })}
        {/* legend */}
        <g transform="translate(450, 268)">
          <rect width="14" height="8" fill="rgba(85,127,127,0.12)" stroke={T.ink2} strokeWidth="0.5"/>
          <rect x="14" width="14" height="8" fill="rgba(85,127,127,0.30)" stroke={T.ink2} strokeWidth="0.5"/>
          <rect x="28" width="14" height="8" fill="rgba(85,127,127,0.55)" stroke={T.ink2} strokeWidth="0.5"/>
          <text x="46" y="7" fontFamily={sansT} fontSize="9" fill={T.ink3}>1 MW</text>
          <text x="180" y="7" fontFamily={sansT} fontSize="9" fill={T.ink3} textAnchor="end">220 MW</text>
        </g>
      </svg>
      {/* tooltip */}
      {hover && (
        <div style={{
          position: 'absolute', left: `${(hover.x / 670) * 100}%`, top: `${(hover.y / 290) * height - 6}px`,
          transform: 'translate(-50%, -100%)',
          background: T.ocean, color: '#fff', padding: '10px 14px',
          borderRadius: 6, minWidth: 180, fontFamily: sansT,
          boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{hover.label}</span>
            <span style={{ fontSize: 10, color: T.lime, letterSpacing: '0.06em' }}>{hover.data.iso}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 12px', fontSize: 11 }}>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>Sites</span>
            <span style={{ fontFamily: monoT, fontWeight: 600 }}>{hover.data.sites}</span>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>Available MW</span>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.lime }}>{hover.data.mw}</span>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>YTD Savings</span>
            <span style={{ fontFamily: monoT, fontWeight: 600 }}>{hover.data.savings}</span>
          </div>
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
            click to drill in →
          </div>
          {/* tooltip arrow */}
          <div style={{ position: 'absolute', left: '50%', bottom: -6, transform: 'translateX(-50%) rotate(45deg)', width: 12, height: 12, background: T.ocean }} />
        </div>
      )}
    </div>
  );
}

// Top clients leaderboard
const TOP_CLIENTS = [
  ['Advocate Health', 'Healthcare', 42, '38.2 MW', '$3.4M'],
  ['HCA Houston',     'Healthcare', 31, '28.8 MW', '$2.7M'],
  ['Caltech',         'Higher Ed',  18, '22.1 MW', '$1.9M'],
  ['UT Austin',       'Higher Ed',  24, '19.6 MW', '$1.6M'],
  ['VA Pacific',      'Federal',    16, '14.2 MW', '$1.3M'],
  ['City of Plano',   'Municipal',  12, '11.4 MW', '$0.9M'],
];

const RECENT_EVENTS_DASH = [
  ['Aug 14', 'ERCOT 4CP',  '28.4 MW', 96.4, 'ok'],
  ['Aug 11', 'CAISO DSGS', '14.1 MW', 102.0,'ok'],
  ['Aug  7', 'PJM ELRP',   '11.6 MW', 88.7, 'warn'],
  ['Jul 30', 'NYISO SCR',  '8.2 MW',  94.1, 'ok'],
];

function MidFiPortfolio({ eventBanner, pamMode, showAnnotations }) {
  const chips = [];
  if (pamMode) chips.push({ label: 'My Sites', value: '12', accent: true });
  return (
    <MfFrame label="Portfolio · Mid-fi" w={1280} h={820} scale={0.5}>
      <MfHeader eventActive={eventBanner} breadcrumb={['Portfolio']} />
      <MfEventBanner on={eventBanner} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <MfSidebar active={pamMode ? 'mysites' : 'portfolio'} />
        <div style={{ flex: 1, overflow: 'auto', background: T.bg, position: 'relative' }}>
          <MfTitleStrip
            eyebrow={pamMode ? 'My Sites · S. Reyes' : 'Portfolio · All Clients'}
            title={pamMode ? 'My Demand Center' : 'Demand Center Overview'}
            sub={pamMode ? '12 sites assigned · 4 clients · 7 active enrollments' : '342 sites · 47 clients · 4 verticals'}
            freshness="Refreshed 4 min ago · auto every 5 min"
            live
            actions={<>
              <Btn>Export</Btn>
              <Btn icon="plus" kind="accent">Enroll Equipment</Btn>
            </>}
          />
          <MfFilterBar chips={chips} />
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
            {/* KPI strip — welded */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: T.border, borderRadius: 8, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                {(pamMode ? [
                  { label: 'My Sites',      value: '12',      sub: '4 clients',       delta: '',       deltaUp: true,  clickable: true, accent: true },
                  { label: 'My Buildings',  value: '78',      sub: '6 ISOs',          delta: '',       deltaUp: true,  clickable: true },
                  { label: 'Peak Demand',   value: '142 MW',  sub: 'across my sites', delta: '+2.1%',  deltaUp: true,  clickable: false },
                  { label: 'Available MW',  value: '38.4',    sub: 'my enrollments',  delta: '+4.2',   deltaUp: true,  clickable: true },
                  { label: 'Active Enroll.',value: '47',      sub: '6 programs',      delta: '+3',     deltaUp: true,  clickable: true },
                  { label: 'YTD Savings',   value: '$3.1M',   sub: 'gross',           delta: '+12.4%', deltaUp: true,  clickable: false },
                ] : PORTFOLIO_KPIS).map((k, i) => <KpiTile key={i} {...k} />)}
              </div>
              {showAnnotations && (
                <MfAnnot x={-8} y={-50} w={210} side="right">
                  <div style={{ fontWeight: 600, color: T.ocean, marginBottom: 2 }}>Welded KPI strip</div>
                  Clickable tiles drill into a list filtered to that metric. Trend deltas vs. prior period.
                </MfAnnot>
              )}
            </div>

            {/* Map + side rail */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, position: 'relative' }}>
              <Card
                eyebrow="Enrolled MW by State · click to filter"
                action={
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: T.ink3, marginRight: 6 }}>View</span>
                    {[['Choropleth', true], ['Pins', false], ['Both', false]].map(([l, on]) => (
                      <button key={l} style={{ padding: '4px 10px', border: `1px solid ${on ? T.ocean : T.border2}`, background: on ? T.ocean : T.paper, color: on ? '#fff' : T.ink2, borderRadius: 4, fontFamily: sansT, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>{l}</button>
                    ))}
                  </div>
                }
                padding={0}
              >
                <div style={{ padding: 12, background: T.bgAlt }}>
                  <InteractiveUSMap height={340} />
                </div>
              </Card>
              <Card eyebrow="Top Clients by Available MW" padding={0}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.4fr 0.7fr', padding: '8px 14px', borderBottom: `1px solid ${T.border}`, background: T.bgAlt }}>
                  {['Client', 'Vertical', 'Sites', 'MW'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
                </div>
                {TOP_CLIENTS.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.4fr 0.7fr', padding: '9px 14px', borderBottom: i < 5 ? `1px solid ${T.borderSoft}` : 'none', alignItems: 'center', fontSize: 12.5, fontFamily: sansT, color: T.ink, cursor: 'pointer' }}>
                    <span style={{ fontWeight: 600 }}>{r[0]}</span>
                    <VerticalChip vertical={r[1]} />
                    <span style={{ fontFamily: monoT, fontVariantNumeric: 'tabular-nums', color: T.ink3 }}>{r[2]}</span>
                    <span style={{ fontFamily: monoT, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: T.ocean }}>{r[3]}</span>
                  </div>
                ))}
              </Card>
              {showAnnotations && (
                <MfAnnot x={500} y={48} w={220} side="left">
                  <div style={{ fontWeight: 600, color: T.ocean, marginBottom: 2 }}>Hover map → tooltip</div>
                  Click a state to drill in (zoom + pin clusters; chip added to filter bar).
                </MfAnnot>
              )}
            </div>

            {/* Recent events */}
            <Card
              eyebrow="Recent Events"
              action={<Btn size="sm" kind="ghost">View all 64 →</Btn>}
              padding={0}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr 0.9fr 1.2fr 0.9fr', padding: '8px 14px', borderBottom: `1px solid ${T.border}`, background: T.bgAlt }}>
                {['Date', 'Program', 'Called', 'Performance', 'Status'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
              </div>
              {RECENT_EVENTS_DASH.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr 0.9fr 1.2fr 0.9fr', padding: '10px 14px', borderBottom: i < 3 ? `1px solid ${T.borderSoft}` : 'none', alignItems: 'center', fontSize: 13, fontFamily: sansT }}>
                  <span style={{ color: T.ink2 }}>{r[0]}</span>
                  <span style={{ fontWeight: 600, color: T.ink }}>{r[1]}</span>
                  <Num size={13}>{r[2]}</Num>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: T.borderSoft, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(r[3], 100)}%`, height: '100%', background: r[3] >= 95 ? T.lime : r[3] >= 90 ? T.steel : '#E8B4B4' }} />
                    </div>
                    <Num size={12}>{r[3]}%</Num>
                  </div>
                  <StatusPill kind={r[4]}>{r[3] >= 90 ? 'Completed' : 'Underperformed'}</StatusPill>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </MfFrame>
  );
}

Object.assign(window, { MidFiPortfolio });
