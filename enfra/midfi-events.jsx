// Mid-fi Events: log + per-event detail with baseline-vs-actual chart.

const EVENTS_LOG = [
  ['2025-08-14', '14:02–17:00', 'ERCOT 4CP',     'Day-ahead', 14, '28.4 MW', 96.4, 'ok',   'Completed'],
  ['2025-08-11', '15:30–17:30', 'CAISO DSGS',    'Test',      6,  '14.1 MW', 102.0,'ok',   'Completed'],
  ['2025-08-07', '13:00–17:00', 'PJM ELRP',      'Mandatory', 9,  '11.6 MW', 88.7, 'warn', 'Underperformed'],
  ['2025-07-30', '14:00–18:00', 'NYISO SCR',     'Mandatory', 4,  '8.2 MW',  94.1, 'ok',   'Completed'],
  ['2025-07-22', '12:00–14:00', 'CAISO DSGS',    'Test',      6,  '13.8 MW', 99.1, 'ok',   'Completed'],
  ['2025-07-18', '15:00–17:00', 'ERCOT 4CP',     'Day-ahead', 12, '24.6 MW', 91.2, 'ok',   'Completed'],
  ['2025-07-12', '13:30–16:00', 'PJM ELRP',      'Test',      9,  '10.4 MW', 86.4, 'warn', 'Underperformed'],
  ['2025-07-04', '14:00–18:00', 'ERCOT ECRS',    'Mandatory', 3,  '5.8 MW',  104.2,'ok',   'Completed'],
];

function MidFiEventsLog({ eventBanner }) {
  return (
    <MfFrame label="DR Events Log · Mid-fi" w={1280} h={820} scale={0.5}>
      <MfHeader eventActive={eventBanner} breadcrumb={['DR Events']} />
      <MfEventBanner on={eventBanner} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <MfSidebar active="events" />
        <div style={{ flex: 1, overflow: 'auto', background: T.bg }}>
          <MfTitleStrip
            eyebrow="DR Events · YTD"
            title="Event Log"
            sub="64 events · avg performance 94.8% · $1.84M revenue"
            freshness="Live · OpenADR + email feeds"
            actions={<><Btn>Export CSV</Btn><Btn kind="primary">Schedule Test</Btn></>}
          />
          <MfFilterBar
            chips={[
              { label: 'Date', value: 'YTD 2025' },
              { label: 'ISO', value: 'All' },
            ]}
          />
          {/* Summary band */}
          <div style={{ padding: '16px 24px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
              <KpiTile label="Events YTD" value="64" sub="across 6 ISOs" />
              <KpiTile label="Avg Performance" value="94.8%" sub="weighted by MW" delta="+1.2pp" deltaUp />
              <KpiTile label="MW-Hours Curtailed" value="2,184" sub="all programs" />
              <KpiTile label="Revenue YTD" value="$1.84M" sub="paid + accrued" delta="+18%" deltaUp accent />
              <KpiTile label="Underperforms" value="4" sub="6.3% of events" />
            </div>
          </div>
          {/* Log */}
          <div style={{ padding: 24 }}>
            <Card padding={0}>
              <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr 1.2fr 0.8fr 0.5fr 0.9fr 1.4fr 1fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
                {['Date', 'Window (CT)', 'Program', 'Type', 'Sites', 'Called', 'Performance', 'Status'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
              </div>
              {EVENTS_LOG.map((r, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '0.9fr 1.1fr 1.2fr 0.8fr 0.5fr 0.9fr 1.4fr 1fr',
                  padding: '11px 14px', borderBottom: i < EVENTS_LOG.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                  alignItems: 'center', fontSize: 12.5, fontFamily: sansT, color: T.ink, cursor: 'pointer',
                }}>
                  <span style={{ fontFamily: monoT, color: T.ink2 }}>{r[0]}</span>
                  <span style={{ fontFamily: monoT, color: T.ink3 }}>{r[1]}</span>
                  <span style={{ fontWeight: 600 }}>{r[2]}</span>
                  <span style={{ color: T.ink3 }}>{r[3]}</span>
                  <Num size={12.5}>{r[4]}</Num>
                  <Num size={12.5}>{r[5]}</Num>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: T.borderSoft, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(r[6], 100)}%`, height: '100%', background: r[6] >= 95 ? T.lime : r[6] >= 90 ? T.steel : '#E8B4B4' }} />
                    </div>
                    <Num size={12}>{r[6]}%</Num>
                  </div>
                  <StatusPill kind={r[7]}>{r[8]}</StatusPill>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </MfFrame>
  );
}

// ─── Event Detail ────────────────────────────────────────────
function BaselineVsActualChart() {
  // Synthetic 5-min interval data for a 3hr event window (14:00–17:00)
  const points = 36; // 5min × 36 = 3hr
  const baseline = Array.from({ length: points }, (_, i) => 50 + 8 * Math.sin(i / 4) + (i < 12 ? -2 : 0));
  const actual = baseline.map((b, i) => {
    if (i < 4) return b - 1;
    if (i > 32) return b - 1;
    return b - 28 + 2 * Math.sin(i / 3);
  });
  const W = 760, H = 240, pad = { l: 40, r: 16, t: 12, b: 28 };
  const xMax = points - 1;
  const yMin = 10, yMax = 65;
  const xs = (i) => pad.l + ((W - pad.l - pad.r) * i) / xMax;
  const ys = (v) => pad.t + (H - pad.t - pad.b) * (1 - (v - yMin) / (yMax - yMin));
  const baseLine = baseline.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ');
  const actualLine = actual.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ');
  const fillArea = baseline.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ')
    + ' ' + actual.slice().reverse().map((v, i) => `L ${xs(points - 1 - i)} ${ys(v)}`).join(' ') + ' Z';
  const labels = ['14:00','14:30','15:00','15:30','16:00','16:30','17:00'];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {/* y grid */}
      {[20, 30, 40, 50, 60].map(v => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={ys(v)} y2={ys(v)} stroke={T.borderSoft} strokeWidth="1" />
          <text x={pad.l - 6} y={ys(v) + 3} textAnchor="end" fontFamily={monoT} fontSize="9" fill={T.ink3}>{v} MW</text>
        </g>
      ))}
      {/* event window shading */}
      <rect x={xs(2)} y={pad.t} width={xs(34) - xs(2)} height={H - pad.t - pad.b} fill={T.lime} opacity="0.10" />
      <line x1={xs(2)} x2={xs(2)} y1={pad.t} y2={H - pad.b} stroke={T.ocean} strokeWidth="1" strokeDasharray="3 3" />
      <line x1={xs(34)} x2={xs(34)} y1={pad.t} y2={H - pad.b} stroke={T.ocean} strokeWidth="1" strokeDasharray="3 3" />
      <text x={xs(2) + 4} y={pad.t + 12} fontFamily={sansT} fontSize="9" fontWeight="600" fill={T.ocean}>EVENT START</text>
      <text x={xs(34) - 4} y={pad.t + 12} textAnchor="end" fontFamily={sansT} fontSize="9" fontWeight="600" fill={T.ocean}>EVENT END</text>
      {/* curtailment fill */}
      <path d={fillArea} fill={T.lime} opacity="0.35" />
      {/* baseline */}
      <path d={baseLine} fill="none" stroke={T.ink3} strokeWidth="1.5" strokeDasharray="4 3" />
      {/* actual */}
      <path d={actualLine} fill="none" stroke={T.ocean} strokeWidth="2" />
      {/* x labels */}
      {labels.map((l, i) => (
        <text key={l} x={xs(i * 6)} y={H - 8} textAnchor="middle" fontFamily={monoT} fontSize="9" fill={T.ink3}>{l}</text>
      ))}
    </svg>
  );
}

const ASSET_PERF = [
  ['BESS-01', 'Tesla Megapack', 'Christ Med Ctr', '1.9 MW', '1.94 MW', 102.1, 'ok'],
  ['CH-01',   'Trane CVHF',     'Christ Med Ctr', '0.85 MW','0.81 MW', 95.3, 'ok'],
  ['CH-02',   'Trane CVHF',     'Christ Med Ctr', '0.85 MW','0.83 MW', 97.6, 'ok'],
  ['BESS-04', 'Tesla Megapack', 'HCA Houston SW', '1.9 MW', '1.88 MW',  98.9, 'ok'],
  ['GEN-02',  'Cummins QSK60',  'HCA Houston SW', '2.0 MW', '1.74 MW',  87.0, 'warn'],
  ['CH-11',   'York YK',        'UT Austin Main', '0.6 MW', '0.32 MW',  53.3, 'err'],
];

function MidFiEventDetail({ eventBanner }) {
  return (
    <MfFrame label="Event Detail · Mid-fi" w={1280} h={820} scale={0.5}>
      <MfHeader eventActive={eventBanner} breadcrumb={['DR Events', 'ERCOT 4CP · 2025-08-14']} />
      <MfEventBanner on={eventBanner} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <MfSidebar active="events" />
        <div style={{ flex: 1, overflow: 'auto', background: T.bg }}>
          <MfTitleStrip
            eyebrow="DR Event · ERCOT · Day-ahead"
            title="ERCOT 4CP · Aug 14, 2025"
            sub="14:02–17:00 CT · 14 sites · 28.4 MW called"
            freshness="Settlement pending (T+45)"
            actions={<><Btn>Export</Btn><Btn>Re-baseline</Btn><Btn kind="primary">Generate Report</Btn></>}
          />
          {/* Summary band */}
          <div style={{ padding: '16px 24px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
              <KpiTile label="Called" value="28.4 MW" sub="day-ahead nomination" />
              <KpiTile label="Delivered" value="27.4 MW" sub="actual avg over window" />
              <KpiTile label="Performance" value="96.4%" sub="weighted by site MW" delta="+1.2pp" deltaUp accent />
              <KpiTile label="MWh Curtailed" value="82.3" sub="3hr window" />
              <KpiTile label="Est. Revenue" value="$184k" sub="settlement T+45" />
            </div>
          </div>
          {/* Chart + side panel */}
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
            <Card eyebrow="Baseline vs Actual · 5-min intervals" action={
              <div style={{ display: 'flex', gap: 14, fontFamily: sansT, fontSize: 11, color: T.ink2 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 14, height: 0, borderTop: `2px dashed ${T.ink3}` }} /> Baseline (CBL)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 14, height: 2, background: T.ocean }} /> Actual demand
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 12, height: 10, background: T.lime, opacity: 0.5 }} /> Curtailment
                </span>
              </div>
            }>
              <BaselineVsActualChart />
            </Card>
            <Card eyebrow="Event Timeline">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: sansT, fontSize: 12 }}>
                {[
                  ['12:14', 'Day-ahead notification received', T.ink3],
                  ['13:55', 'PAMs acknowledged · 14/14', T.ok],
                  ['14:02', 'Event start · curtailment begins', T.ocean],
                  ['15:30', 'BESS-04 capacity check · OK', T.ink3],
                  ['16:48', 'CH-11 underperforming · alert', T.err],
                  ['17:00', 'Event end · ramp-up complete', T.ocean],
                  ['17:12', 'Post-event report queued', T.ink3],
                ].map(([t, msg, c], i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: monoT, fontWeight: 600, color: c, width: 36 }}>{t}</span>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: c, marginTop: 5, flexShrink: 0 }} />
                    <span style={{ color: T.ink2 }}>{msg}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {/* Per-asset performance */}
          <div style={{ padding: '0 24px 24px' }}>
            <Card eyebrow="Per-Asset Performance" action={<Btn size="sm">Group by Site ▾</Btn>} padding={0}>
              <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1fr 1.2fr 0.8fr 0.8fr 1.2fr 0.8fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
                {['Tag', 'Equipment', 'Site', 'Nominated', 'Delivered', 'Performance', 'Status'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
              </div>
              {ASSET_PERF.map((r, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '0.6fr 1fr 1.2fr 0.8fr 0.8fr 1.2fr 0.8fr',
                  padding: '11px 14px', borderBottom: i < ASSET_PERF.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                  alignItems: 'center', fontSize: 12.5, fontFamily: sansT,
                }}>
                  <span style={{ fontFamily: monoT, fontWeight: 600, color: T.ocean }}>{r[0]}</span>
                  <span style={{ color: T.ink }}>{r[1]}</span>
                  <span style={{ color: T.ink3 }}>{r[2]}</span>
                  <span style={{ fontFamily: monoT, color: T.ink2 }}>{r[3]}</span>
                  <Num size={12.5}>{r[4]}</Num>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: T.borderSoft, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(r[5], 105)}%`, height: '100%', background: r[5] >= 95 ? T.lime : r[5] >= 80 ? T.steel : '#E8B4B4' }} />
                    </div>
                    <Num size={12}>{r[5]}%</Num>
                  </div>
                  <StatusPill kind={r[6]}>{r[5] >= 95 ? 'On target' : r[5] >= 80 ? 'Under' : 'Failed'}</StatusPill>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </MfFrame>
  );
}

Object.assign(window, { MidFiEventsLog, MidFiEventDetail });
