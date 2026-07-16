// Mid-fi drilldown — Site detail with all 5 tabs available via prop.
// Tabs: Overview · Equipment · Enrollments · Events · Performance

const SITE_HEADER_KPIS = [
  { label: 'Building Sq Ft',     value: '847k',  sub: 'across 6 buildings' },
  { label: 'Peak Demand',        value: '18.4 MW', sub: 'last 12 months' },
  { label: 'Available MW',       value: '4.6',   sub: 'enrolled', accent: true },
  { label: 'Active Enrollments', value: '7',     sub: '3 programs' },
  { label: 'YTD Savings',        value: '$486k', sub: 'gross' },
];

const EQUIPMENT_ROWS = [
  ['CH-01', 'Chiller', 'Trane CVHF-1500', 'Bldg A · MEP-2', '1500 ton', '850 kW', 'Enrolled', 'ERCOT 4CP', 'ok'],
  ['CH-02', 'Chiller', 'Trane CVHF-1500', 'Bldg A · MEP-2', '1500 ton', '850 kW', 'Enrolled', 'ERCOT 4CP', 'ok'],
  ['BESS-01','BESS',   'Tesla Megapack 2XL','Bldg B · Yard',   '3.9 MWh', '1.9 MW', 'Enrolled', 'ERCOT 4CP · ECRS','accent'],
  ['GEN-01','Genset', 'Cummins QSK60-G6', 'Bldg C · Yard',   '2.0 MW',  '2.0 MW', 'Pending',  '—', 'warn'],
  ['AHU-12','AHU',    'York YK 30K',     'Bldg A · L4',     '30k cfm', '120 kW', 'Curtailable','ERCOT 4CP','info'],
  ['BLR-01','Boiler', 'Cleaver-Brooks',  'Bldg B · MEP-1',  '800 BHP', '—',      'Not enrolled','—', 'neutral'],
];

// ─── Shared header chrome (KPIs + tabs) ──────────────────────
function SiteHeader({ currentTab }) {
  const tabs = [
    ['overview', 'Overview'],
    ['equipment', `Equipment · ${EQUIPMENT_ROWS.length}`],
    ['enrollments', 'Enrollments · 7'],
    ['events', 'Events · 12'],
    ['performance', 'Performance'],
  ];
  return (
    <>
      <MfTitleStrip
        eyebrow="Site · Healthcare · Oak Lawn, IL"
        title="Christ Medical Center"
        sub="Advocate Health · 6 buildings · 847,000 sq ft"
        freshness="SkySpark synced 2 min ago"
        live
        actions={<>
          <Btn>Map</Btn>
          <Btn>Export</Btn>
          <Btn icon="plus" kind="accent">Enroll Equipment</Btn>
        </>}
      />
      <MfFilterBar chips={[
        { label: 'Client', value: 'Advocate Health' },
        { label: 'Site', value: 'Christ Medical Center', accent: true },
      ]} />
      <div style={{ padding: '16px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          {SITE_HEADER_KPIS.map((k, i) => <KpiTile key={i} {...k} />)}
        </div>
      </div>
      <div style={{ padding: '16px 24px 0', borderBottom: `1px solid ${T.border}`, marginTop: 16, background: T.paper }}>
        <div style={{ display: 'flex', gap: 28 }}>
          {tabs.map(([k, l]) => {
            const on = k === currentTab;
            return (
              <div key={k} style={{
                padding: '10px 0',
                fontFamily: sansT, fontSize: 13.5, fontWeight: on ? 600 : 500,
                color: on ? T.ocean : T.ink3,
                borderBottom: on ? `2px solid ${T.ocean}` : '2px solid transparent',
                cursor: 'pointer', marginBottom: -1,
              }}>{l}</div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Tab: Overview ───────────────────────────────────────────
function TabOverview() {
  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card eyebrow="Site Layout · 6 buildings" action={<Btn size="sm">Open in Maps</Btn>}>
          {/* Stylized site plan */}
          <svg viewBox="0 0 600 240" width="100%" style={{ display: 'block' }}>
            <rect width="600" height="240" fill={T.bgAlt} />
            {/* "buildings" */}
            {[
              [40, 30, 160, 90, 'Bldg A', 'Acute Care', T.iced],
              [220, 30, 110, 90, 'Bldg B', 'Cardiac', 'rgba(85,127,127,0.30)'],
              [350, 30, 130, 60, 'Bldg C', 'Imaging', T.iced],
              [350, 100, 80, 60, 'Bldg D', 'Outpatient', 'rgba(85,127,127,0.20)'],
              [40, 140, 110, 70, 'Bldg E', 'Energy Plant', T.lime],
              [170, 140, 220, 70, 'Bldg F', 'Logistics', 'rgba(85,127,127,0.15)'],
            ].map(([x, y, w, h, label, type, fill], i) => (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h} fill={fill} stroke={T.ocean} strokeWidth="1.2" rx="2" />
                <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fontFamily={sansT} fontSize="12" fontWeight="700" fill={T.ocean}>{label}</text>
                <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontFamily={sansT} fontSize="9" fill={T.ink2}>{type}</text>
              </g>
            ))}
            {/* equipment pins */}
            {[
              [110, 75, 'BESS-01'],
              [275, 75, 'CH-01'],
              [285, 95, 'CH-02'],
              [415, 60, 'AHU-12'],
              [95, 175, 'GEN-01'],
            ].map(([cx, cy, l], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="6" fill={T.lime} stroke={T.ocean} strokeWidth="1.2" />
                <text x={cx + 10} y={cy + 3} fontFamily={monoT} fontSize="9" fontWeight="600" fill={T.ocean}>{l}</text>
              </g>
            ))}
          </svg>
        </Card>

        <Card eyebrow="Demand Profile · Last 7 Days" action={<Btn size="sm">14d ▾</Btn>}>
          {/* Synthetic 7-day load curve */}
          <svg viewBox="0 0 720 160" width="100%" style={{ display: 'block' }}>
            {[40, 80, 120].map(y => <line key={y} x1="40" x2="700" y1={y} y2={y} stroke={T.borderSoft} strokeWidth="1" />)}
            {[
              [40, 'Mon'], [134, 'Tue'], [228, 'Wed'], [322, 'Thu'], [416, 'Fri'], [510, 'Sat'], [604, 'Sun'],
            ].map(([x, l], i) => <text key={l} x={x} y={155} fontFamily={monoT} fontSize="9" fill={T.ink3}>{l}</text>)}
            <text x="34" y="44" textAnchor="end" fontFamily={monoT} fontSize="9" fill={T.ink3}>20</text>
            <text x="34" y="84" textAnchor="end" fontFamily={monoT} fontSize="9" fill={T.ink3}>14</text>
            <text x="34" y="124" textAnchor="end" fontFamily={monoT} fontSize="9" fill={T.ink3}>8 MW</text>
            {/* demand line — 168 hourly points */}
            {(() => {
              const pts = Array.from({ length: 168 }, (_, i) => {
                const day = i / 24;
                const hr = i % 24;
                const base = 10 + 6 * Math.max(0, Math.sin((hr - 5) / 24 * Math.PI * 2));
                const wknd = (Math.floor(day) >= 5) ? -3 : 0;
                return base + wknd + Math.sin(i / 7) * 0.6;
              });
              const xs = (i) => 40 + (660 * i) / 167;
              const ys = (v) => 140 - (v - 4) / (20 - 4) * 120;
              const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ');
              const fill = d + ` L ${xs(167)} 140 L ${xs(0)} 140 Z`;
              return <>
                <path d={fill} fill={T.iced} opacity="0.6" />
                <path d={d} fill="none" stroke={T.ocean} strokeWidth="1.6" />
              </>;
            })()}
            {/* event markers */}
            <circle cx="370" cy="40" r="4" fill={T.lime} stroke={T.ocean} strokeWidth="1.2" />
            <text x="376" y="36" fontFamily={sansT} fontSize="9" fontWeight="600" fill={T.ocean}>Aug 14 · ERCOT 4CP</text>
          </svg>
        </Card>

        <Card eyebrow="Enrollment Mix" padding={0}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: `1px solid ${T.borderSoft}` }}>
            {[
              ['ERCOT 4CP', '3.7 MW', '4 assets', T.lime],
              ['ERCOT ECRS', '0.6 MW', '1 asset',  T.iced],
              ['Curtailable', '0.3 MW', '2 assets', T.borderSoft],
            ].map(([n, mw, c, bg], i) => (
              <div key={i} style={{ padding: 14, borderRight: i < 2 ? `1px solid ${T.borderSoft}` : 'none' }}>
                <div style={{ height: 6, background: bg, borderRadius: 3, marginBottom: 8 }} />
                <div style={{ fontFamily: sansT, fontSize: 12, fontWeight: 600, color: T.ink }}>{n}</div>
                <div style={{ fontFamily: monoT, fontSize: 18, fontWeight: 600, color: T.ocean, marginTop: 2 }}>{mw}</div>
                <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3 }}>{c}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right rail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card eyebrow="Site Details">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontFamily: sansT, fontSize: 12 }}>
            {[
              ['Client', 'Advocate Health'],
              ['Vertical', <VerticalChip vertical="Healthcare" />],
              ['Address', '4440 W 95th St, Oak Lawn, IL'],
              ['ISO', 'PJM (ComEd zone)'],
              ['Utility', 'ComEd'],
              ['Tariff', 'Rate 6L · large load'],
              ['PAM', 'S. Reyes'],
              ['Onboarded', 'Mar 2024'],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 7 ? `1px solid ${T.borderSoft}` : 'none', paddingBottom: 8 }}>
                <span style={{ color: T.ink3 }}>{k}</span>
                <span style={{ fontWeight: 500, color: T.ink }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card eyebrow="Recent Activity">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: sansT, fontSize: 11.5 }}>
            {[
              ['2h ago', 'BESS-01 firmware updated to 24.32', T.steel],
              ['1d ago', 'GEN-01 enrollment moved to financials', T.ocean],
              ['3d ago', 'AHU-12 added to ERCOT 4CP', T.ocean],
              ['8d ago', 'CH-01 quarterly maintenance complete', T.ink3],
            ].map(([t, msg, c], i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: c, marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ color: T.ink2 }}>{msg}</div>
                  <div style={{ color: T.ink4, fontSize: 10.5, marginTop: 1 }}>{t}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Tab: Equipment (existing) ──────────────────────────────
function TabEquipment() {
  return (
    <div style={{ padding: 24 }}>
      <Card padding={0}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${T.border2}`, borderRadius: 4, padding: '4px 10px', width: 220 }}>
              <SIcon kind="search" size={12} color={T.ink4} />
              <span style={{ fontFamily: sansT, fontSize: 12, color: T.ink4 }}>Filter equipment…</span>
            </div>
            <Btn size="sm">Type ▾</Btn>
            <Btn size="sm">Status ▾</Btn>
            <Btn size="sm">Building ▾</Btn>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: T.ink3 }}>{EQUIPMENT_ROWS.length} of {EQUIPMENT_ROWS.length}</span>
            <Btn size="sm">Columns</Btn>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 0.7fr 1.4fr 1.2fr 0.7fr 0.6fr 0.9fr 1.2fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
          {['Tag', 'Type', 'Make/Model', 'Location', 'Capacity', 'kW', 'Enrollment', 'Programs'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
        </div>
        {EQUIPMENT_ROWS.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '0.5fr 0.7fr 1.4fr 1.2fr 0.7fr 0.6fr 0.9fr 1.2fr',
            padding: '11px 14px', borderBottom: i < EQUIPMENT_ROWS.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
            alignItems: 'center', fontSize: 12.5, fontFamily: sansT, color: T.ink, cursor: 'pointer',
          }}>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.ocean }}>{r[0]}</span>
            <span style={{ color: T.ink2 }}>{r[1]}</span>
            <span style={{ color: T.ink, fontWeight: 500 }}>{r[2]}</span>
            <span style={{ color: T.ink3, fontFamily: monoT, fontSize: 11 }}>{r[3]}</span>
            <span style={{ fontFamily: monoT, color: T.ink2 }}>{r[4]}</span>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.ocean }}>{r[5]}</span>
            <StatusPill kind={r[8]}>{r[6]}</StatusPill>
            <span style={{ color: T.ink3, fontSize: 11 }}>{r[7]}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Tab: Enrollments ───────────────────────────────────────
function TabEnrollments() {
  const enrollments = [
    ['ENR-2401','BESS-01','ERCOT 4CP',     'Day-ahead','Active', '1.9 MW', '$213k/yr', 'Jun 2024', '—'],
    ['ENR-2402','BESS-01','ERCOT ECRS',    'Ancillary','Active', '1.9 MW', '$91k/yr',  'Jun 2024', '—'],
    ['ENR-2403','CH-01',  'ERCOT 4CP',     'Day-ahead','Active', '0.85 MW','$95k/yr',  'Jun 2024', '—'],
    ['ENR-2404','CH-02',  'ERCOT 4CP',     'Day-ahead','Active', '0.85 MW','$95k/yr',  'Jun 2024', '—'],
    ['ENR-2410','AHU-12', 'ERCOT 4CP',     'Day-ahead','Active', '0.12 MW','$13k/yr',  'Jul 2025', '—'],
    ['ENR-2411','GEN-01', 'ERCOT 4CP',     'Day-ahead','Pending','2.0 MW', '$224k/yr', 'Aug 2025', 'Awaiting site verify'],
    ['ENR-2412','BESS-01','PJM ELRP',      'Mandatory','Draft',  '1.9 MW', 'TBD',      '—',        'Coverage stack with 4CP'],
  ];
  const status = (s) => s === 'Active' ? 'ok' : s === 'Pending' ? 'warn' : s === 'Draft' ? 'neutral' : 'info';
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <KpiTile label="Active" value="5" sub="enrollments" />
        <KpiTile label="Pending" value="1" sub="awaiting site verify" />
        <KpiTile label="Draft" value="1" sub="not submitted" />
        <KpiTile label="Annual Revenue" value="$731k" sub="active enrollments" accent />
      </div>
      <Card padding={0}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${T.border}` }}>
          <Eyebrow>Enrollments at this site</Eyebrow>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn size="sm">Stack programs</Btn>
            <Btn size="sm" kind="accent" icon="plus">New Enrollment</Btn>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 0.6fr 1fr 0.7fr 0.7fr 0.6fr 0.7fr 0.6fr 1fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
          {['ID', 'Asset', 'Program', 'Type', 'Status', 'kW', 'Revenue', 'Started', 'Notes'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
        </div>
        {enrollments.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '0.7fr 0.6fr 1fr 0.7fr 0.7fr 0.6fr 0.7fr 0.6fr 1fr',
            padding: '11px 14px', borderBottom: i < enrollments.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
            alignItems: 'center', fontSize: 12.5, fontFamily: sansT,
          }}>
            <span style={{ fontFamily: monoT, color: T.ocean, fontWeight: 600 }}>{r[0]}</span>
            <span style={{ fontFamily: monoT, color: T.ink2 }}>{r[1]}</span>
            <span style={{ color: T.ink, fontWeight: 500 }}>{r[2]}</span>
            <span style={{ color: T.ink3 }}>{r[3]}</span>
            <StatusPill kind={status(r[4])}>{r[4]}</StatusPill>
            <Num size={12.5}>{r[5]}</Num>
            <span style={{ fontFamily: monoT, color: T.ocean, fontWeight: 600 }}>{r[6]}</span>
            <span style={{ color: T.ink3, fontSize: 11 }}>{r[7]}</span>
            <span style={{ color: T.ink3, fontSize: 11 }}>{r[8]}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Tab: Events ────────────────────────────────────────────
function TabSiteEvents() {
  const events = [
    ['2025-08-14','14:02–17:00','ERCOT 4CP','5 assets','3.6 MW','98.1%','ok','Completed'],
    ['2025-07-18','15:00–17:00','ERCOT 4CP','5 assets','3.6 MW','94.4%','ok','Completed'],
    ['2025-07-04','14:00–18:00','ERCOT ECRS','1 asset','1.9 MW','103.2%','ok','Completed'],
    ['2025-06-22','13:30–16:00','ERCOT 4CP','4 assets','2.7 MW','89.8%','warn','Underperformed'],
    ['2025-06-08','14:00–17:00','PJM ELRP-Test','3 assets','2.6 MW','96.0%','ok','Completed'],
  ];
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <KpiTile label="Events YTD" value="12" sub="this site" />
        <KpiTile label="Avg Performance" value="94.7%" sub="weighted by MW" delta="+0.6pp" deltaUp />
        <KpiTile label="MWh Curtailed" value="38.4" sub="all events" />
        <KpiTile label="Site Revenue YTD" value="$184k" sub="settled + accrued" accent />
      </div>
      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1fr 1fr 0.9fr 0.7fr 1.2fr 0.9fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
          {['Date', 'Window', 'Program', 'Assets', 'Called', 'Performance', 'Status'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
        </div>
        {events.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '0.9fr 1fr 1fr 0.9fr 0.7fr 1.2fr 0.9fr',
            padding: '11px 14px', borderBottom: i < events.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
            alignItems: 'center', fontSize: 12.5, fontFamily: sansT, cursor: 'pointer',
          }}>
            <span style={{ fontFamily: monoT, color: T.ink2 }}>{r[0]}</span>
            <span style={{ fontFamily: monoT, color: T.ink3 }}>{r[1]}</span>
            <span style={{ fontWeight: 600 }}>{r[2]}</span>
            <span style={{ color: T.ink3 }}>{r[3]}</span>
            <Num size={12.5}>{r[4]}</Num>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: T.borderSoft, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(parseFloat(r[5]), 105)}%`, height: '100%', background: parseFloat(r[5]) >= 95 ? T.lime : parseFloat(r[5]) >= 90 ? T.steel : '#E8B4B4' }} />
              </div>
              <Num size={12}>{r[5]}</Num>
            </div>
            <StatusPill kind={r[6]}>{r[7]}</StatusPill>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Tab: Performance ───────────────────────────────────────
function TabPerformance() {
  const W = 720, H = 200;
  // 12 month performance series
  const months = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
  const perf =     [96.2, 94.8, 95.1, 92.4, 93.0, 94.1, 95.6, 96.0, 94.2, 89.8, 94.4, 98.1];
  const benchmark = 95;
  const xs = (i) => 50 + i * ((W - 70) / 11);
  const ys = (v) => 30 + (100 - v) * 4;
  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card eyebrow="Trailing 12-Month Performance · weighted by MW" action={<Btn size="sm">Compare to portfolio</Btn>}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            {[85, 90, 95, 100].map(v => (
              <g key={v}>
                <line x1="50" x2={W - 20} y1={ys(v)} y2={ys(v)} stroke={T.borderSoft} strokeWidth="1" />
                <text x="44" y={ys(v) + 3} textAnchor="end" fontFamily={monoT} fontSize="9" fill={T.ink3}>{v}%</text>
              </g>
            ))}
            <line x1="50" x2={W - 20} y1={ys(benchmark)} y2={ys(benchmark)} stroke={T.steel} strokeWidth="1.2" strokeDasharray="4 3" />
            <text x={W - 22} y={ys(benchmark) - 4} textAnchor="end" fontFamily={sansT} fontSize="9" fontWeight="600" fill={T.steel}>Target 95%</text>
            {/* bars */}
            {perf.map((v, i) => (
              <g key={i}>
                <rect x={xs(i) - 18} y={ys(v)} width="36" height={H - 30 - ys(v) + 30}
                  fill={v >= 95 ? T.lime : v >= 90 ? T.steel : '#E8B4B4'} opacity="0.85" />
                <text x={xs(i)} y={ys(v) - 4} textAnchor="middle" fontFamily={monoT} fontSize="9" fontWeight="600" fill={T.ocean}>{v}</text>
                <text x={xs(i)} y={H - 6} textAnchor="middle" fontFamily={sansT} fontSize="10" fill={T.ink3}>{months[i]}</text>
              </g>
            ))}
          </svg>
        </Card>
        <Card eyebrow="Per-Asset Performance · 12mo weighted">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['BESS-01', 99.2, 'on target'],
              ['CH-01',   96.4, 'on target'],
              ['CH-02',   95.1, 'on target'],
              ['AHU-12',  91.8, 'minor underperform'],
              ['GEN-01',  null, 'pending enrollment'],
            ].map(([asset, p, note], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px 180px', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: monoT, fontSize: 12, fontWeight: 600, color: T.ocean }}>{asset}</span>
                <div style={{ height: 8, borderRadius: 4, background: T.borderSoft, overflow: 'hidden' }}>
                  {p && <div style={{ width: `${Math.min(p, 100)}%`, height: '100%', background: p >= 95 ? T.lime : p >= 90 ? T.steel : '#E8B4B4' }} />}
                </div>
                <Num size={13} color={p ? T.ocean : T.ink3}>{p ? `${p}%` : '—'}</Num>
                <span style={{ fontFamily: sansT, fontSize: 11, color: T.ink3 }}>{note}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card eyebrow="Site Score">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <Num size={42}>94.7</Num>
            <span style={{ fontFamily: sansT, fontSize: 14, fontWeight: 600, color: T.steel }}>%</span>
          </div>
          <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3 }}>vs portfolio avg <span style={{ color: T.ok, fontWeight: 600 }}>+0.9pp</span></div>
          <div style={{ height: 1, background: T.borderSoft, margin: '14px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: sansT, fontSize: 12 }}>
            <Row label="Reliability" value="98%" />
            <Row label="Telemetry uptime" value="99.6%" />
            <Row label="Notification ACK" value="100%" />
            <Row label="Avg ramp time" value="6.8 min" />
          </div>
        </Card>
        <Card eyebrow="Issues to address">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: sansT, fontSize: 12 }}>
            <Issue kind="warn" title="AHU-12 underperformed by 8%" detail="Last 2 events · check VFD setpoint" />
            <Issue kind="info" title="GEN-01 awaiting site verify" detail="Blocked since Aug 11 · ping the on-site PM" />
            <Issue kind="ok" title="BESS-01 ahead of plan" detail="+4.2% vs nominated · consider bumping" />
          </div>
        </Card>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span style={{ color: T.ink3 }}>{label}</span>
    <span style={{ fontFamily: monoT, fontWeight: 600, color: T.ink }}>{value}</span>
  </div>
);

const Issue = ({ kind, title, detail }) => {
  const c = kind === 'warn' ? T.warn : kind === 'ok' ? T.ok : T.info;
  const bg = kind === 'warn' ? T.warnBg : kind === 'ok' ? T.okBg : T.infoBg;
  return (
    <div style={{ padding: 10, background: bg, borderRadius: 4, borderLeft: `3px solid ${c}` }}>
      <div style={{ fontWeight: 600, color: c, marginBottom: 2 }}>{title}</div>
      <div style={{ color: T.ink2, fontSize: 11 }}>{detail}</div>
    </div>
  );
};

// ─── Public component ───────────────────────────────────────
function MidFiSiteDrilldown({ eventBanner, tab = 'equipment' }) {
  const body =
    tab === 'overview'    ? <TabOverview /> :
    tab === 'enrollments' ? <TabEnrollments /> :
    tab === 'events'      ? <TabSiteEvents /> :
    tab === 'performance' ? <TabPerformance /> :
                            <TabEquipment />;
  return (
    <MfFrame label={`Site · ${tab[0].toUpperCase() + tab.slice(1)} tab`} w={1280} h={820} scale={0.5}>
      <MfHeader eventActive={eventBanner} breadcrumb={['Portfolio', 'Advocate Health', 'Christ Med Ctr']} />
      <MfEventBanner on={eventBanner} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <MfSidebar active="sites" />
        <div style={{ flex: 1, overflow: 'auto', background: T.bg }}>
          <SiteHeader currentTab={tab} />
          {body}
        </div>
      </div>
    </MfFrame>
  );
}

Object.assign(window, { MidFiSiteDrilldown });
