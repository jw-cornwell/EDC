// EDC Portfolio Dashboard — 4 layout variants (A/B/C/D) of the landing page.
// Each variant renders the same KPI/map/listing data but with a different
// information hierarchy. All sit in a 1280×820 SketchFrame.

// Shared mock data --------------------------------------------------
const KPIS = [
  { label: 'Total Sites',          value: '342',     sub: '28 states' },
  { label: 'Total Clients',        value: '47',      sub: '4 verticals' },
  { label: 'Peak Demand',          value: '618 MW',  sub: 'portfolio · last yr' },
  { label: 'Available MW',         value: '184.2',   sub: 'enrolled capacity' },
  { label: 'Active Enrollments',   value: '512',     sub: 'across 38 programs' },
  { label: 'Est. Annual Savings',  value: '$24.8M',  sub: 'gross · current FY' },
];

const TOP_CLIENTS = [
  ['Advocate Health',   'Healthcare', 42, '38.2 MW', '$3.4M'],
  ['Caltech',           'Higher Ed',  18, '22.1 MW', '$1.9M'],
  ['HCA Houston',       'Healthcare', 31, '28.8 MW', '$2.7M'],
  ['UT Austin',         'Higher Ed',  24, '19.6 MW', '$1.6M'],
  ['City of Plano',     'Municipal',  12, '11.4 MW', '$0.9M'],
  ['VA Pacific',        'Federal',    16, '14.2 MW', '$1.3M'],
];

const TOP_STATES = [
  ['TX', 'ERCOT',  '88.2 MW', 142],
  ['CA', 'CAISO',  '42.4 MW', 67],
  ['NY', 'NYISO',  '18.7 MW', 28],
  ['IL', 'PJM',    '12.1 MW', 22],
  ['GA', 'N/A',    '9.8 MW',  18],
  ['VA', 'PJM',    '7.3 MW',  14],
];

const RECENT_EVENTS = [
  ['ERCOT 4CP',  'Aug 14',  '28.4 MW', '96.4%', 'Completed'],
  ['CAISO DSGS', 'Aug 11',  '14.1 MW', '102.0%','Completed'],
  ['PJM ELRP',   'Aug  7',  '11.6 MW', '88.7%', 'Completed'],
  ['NYISO SCR',  'Jul 30',  '8.2 MW',  '94.1%', 'Completed'],
];

// ─── KPI strip — variants ──────────────────────────────────────
function KpiStrip({ tiles = KPIS, dense, vertical }) {
  if (vertical) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tiles.map((t, i) => <SKpi key={i} {...t} dense />)}
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tiles.length}, 1fr)`, gap: 8 }}>
      {tiles.map((t, i) => <SKpi key={i} {...t} dense={dense} accent={t.label === 'Available MW'} />)}
    </div>
  );
}

// ─── Variant A — Classic: KPIs full-width up top, big map below ─
function VariantA_Classic({ eventBanner }) {
  return (
    <SketchFrame label="VARIANT A · Classic — KPIs above the fold, big map dominates" w={1280} h={820} scale={0.5}>
      <EdcHeader eventActive={eventBanner} />
      <EdcEventBanner on={eventBanner} />
      <div style={{ display: 'flex', height: `calc(100% - 56px${eventBanner ? ' - 44px' : ''})` }}>
        <EdcSidebar active="portfolio" />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <EdcTitleStrip
            eyebrow="Portfolio · All Clients"
            title="Demand Center Overview"
            sub="342 sites · 47 clients · last refreshed 4 min ago"
          />
          <EdcFilterBar />
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <KpiStrip />
            <SBox style={{ padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <SLabel eyebrow>Enrolled MW by State</SLabel>
                <div style={{ display: 'flex', gap: 8, fontFamily: handBody, fontSize: 12, color: SKETCH.inkSoft }}>
                  <SPill accent>Choropleth</SPill><SPill>Pins</SPill><SPill>Both</SPill>
                </div>
              </div>
              <SketchUSMap height={340} />
            </SBox>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

// ─── Variant B — Map Hero: map is the page, tiles + lists overlay ─
function VariantB_MapHero({ eventBanner }) {
  return (
    <SketchFrame label="VARIANT B · Map Hero — geography first, KPIs as a floating rail" w={1280} h={820} scale={0.5}>
      <EdcHeader eventActive={eventBanner} />
      <EdcEventBanner on={eventBanner} />
      <div style={{ display: 'flex', height: `calc(100% - 56px${eventBanner ? ' - 44px' : ''})` }}>
        <EdcSidebar active="portfolio" collapsed />
        <div style={{ flex: 1, position: 'relative' }}>
          <EdcFilterBar dense />
          <div style={{ position: 'relative', height: 'calc(100% - 56px)' }}>
            {/* full-bleed map */}
            <div style={{ position: 'absolute', inset: 0, background: SKETCH.paperAlt }}>
              <SketchUSMap height={680} highlightedState="TX" />
            </div>
            {/* floating left rail with KPIs */}
            <div style={{
              position: 'absolute', top: 16, left: 16, width: 240,
              background: SKETCH.paper, border: `1.5px solid ${SKETCH.rule}`,
              borderRadius: 6, padding: 14, boxShadow: '4px 4px 0 rgba(0,0,0,0.06)',
            }}>
              <SLabel eyebrow style={{ marginBottom: 6 }}>Portfolio · Live</SLabel>
              <SHeading size={22}>EDC Overview</SHeading>
              <div style={{ height: 1, background: SKETCH.ruleSoft, margin: '10px 0' }} />
              <KpiStrip vertical />
            </div>
            {/* floating right rail with state breakdown */}
            <div style={{
              position: 'absolute', top: 16, right: 16, width: 270,
              background: SKETCH.paper, border: `1.5px solid ${SKETCH.rule}`,
              borderRadius: 6, padding: 14, boxShadow: '4px 4px 0 rgba(0,0,0,0.06)',
            }}>
              <SLabel eyebrow style={{ marginBottom: 8 }}>Top States by Available MW</SLabel>
              {TOP_STATES.map(([s, iso, mw, sites], i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '6px 0', borderBottom: i < 5 ? `1px dashed ${SKETCH.ruleSoft}` : 'none',
                  fontFamily: handBody, fontSize: 13,
                }}>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontFamily: handDisplay, fontSize: 16, width: 26 }}>{s}</span>
                    <span style={{ color: SKETCH.inkSoft, fontSize: 11 }}>{iso}</span>
                  </span>
                  <span><span style={{ fontFamily: handDisplay, fontSize: 15 }}>{mw}</span>
                    <span style={{ color: SKETCH.inkMute, marginLeft: 6, fontSize: 11 }}>{sites} sites</span></span>
                </div>
              ))}
            </div>
            {/* bottom callout: clicked-state detail */}
            <div style={{
              position: 'absolute', bottom: 16, left: 16, right: 16, height: 110,
              background: SKETCH.paper, border: `1.5px solid ${SKETCH.rule}`,
              borderRadius: 6, padding: 14, display: 'flex', gap: 18, alignItems: 'center',
            }}>
              <div style={{ flex: '0 0 auto' }}>
                <SLabel eyebrow>Selected · Texas</SLabel>
                <SHeading size={26}>ERCOT · 142 sites · 88.2 MW</SHeading>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                <SKpi label="Clients" value="14" dense />
                <SKpi label="Active Enroll." value="186" dense />
                <SKpi label="Programs" value="4CP, ERS, LMR" dense />
                <SKpi label="YTD Savings" value="$8.2M" dense accent />
              </div>
              <SBtn accent>Drill into Texas →</SBtn>
            </div>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

// ─── Variant C — Split: Map left, lists/leaderboards right ─────
function VariantC_Split({ eventBanner }) {
  return (
    <SketchFrame label="VARIANT C · Split — map and leaderboards share the fold equally" w={1280} h={820} scale={0.5}>
      <EdcHeader eventActive={eventBanner} />
      <EdcEventBanner on={eventBanner} />
      <div style={{ display: 'flex', height: `calc(100% - 56px${eventBanner ? ' - 44px' : ''})` }}>
        <EdcSidebar active="portfolio" />
        <div style={{ flex: 1 }}>
          <EdcTitleStrip
            eyebrow="Portfolio"
            title="EDC Overview"
            sub="Filtered: All clients · All ISOs"
          />
          <EdcFilterBar />
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <KpiStrip dense />
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
              <SBox style={{ padding: 12, height: 380 }}>
                <SLabel eyebrow style={{ marginBottom: 8 }}>Enrolled Capacity by State</SLabel>
                <SketchUSMap height={320} />
              </SBox>
              <SBox style={{ padding: 12, height: 380, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 14, marginBottom: 8, borderBottom: `1.5px solid ${SKETCH.rule}` }}>
                  {['Top Clients','Top Sites','Recent Events'].map((t,i)=>(
                    <span key={t} style={{
                      padding: '6px 4px', fontFamily: handBody, fontSize: 13,
                      borderBottom: i === 0 ? `2px solid ${SKETCH.ocean}` : '2px solid transparent',
                      color: i === 0 ? SKETCH.ocean : SKETCH.inkSoft,
                    }}>{t}</span>
                  ))}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 0.7fr 0.9fr 0.8fr', gap: 6, padding: '6px 0', borderBottom: `1px dashed ${SKETCH.ruleSoft}` }}>
                    {['Client','Vertical','Sites','Avail. MW','YTD $'].map(h=>(
                      <SLabel eyebrow key={h}>{h}</SLabel>
                    ))}
                  </div>
                  {TOP_CLIENTS.map((r,i)=>(
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '2fr 1.1fr 0.7fr 0.9fr 0.8fr', gap: 6,
                      padding: '8px 0', borderBottom: i < 5 ? `1px dashed ${SKETCH.ruleSoft}` : 'none',
                      fontFamily: handBody, fontSize: 13, alignItems: 'center',
                    }}>
                      <span style={{ fontFamily: handDisplay, fontSize: 16 }}>{r[0]}</span>
                      <SPill style={{ fontSize: 11 }}>{r[1]}</SPill>
                      <span>{r[2]}</span>
                      <span style={{ fontFamily: handDisplay, fontSize: 15 }}>{r[3]}</span>
                      <span>{r[4]}</span>
                    </div>
                  ))}
                </div>
              </SBox>
            </div>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

// ─── Variant D — Operator Console: dense, table-forward ────────
function VariantD_Console({ eventBanner }) {
  return (
    <SketchFrame label="VARIANT D · Operator Console — dense ops view, map shrinks to a chip" w={1280} h={820} scale={0.5}>
      <EdcHeader eventActive={eventBanner} />
      <EdcEventBanner on={eventBanner} />
      <div style={{ display: 'flex', height: `calc(100% - 56px${eventBanner ? ' - 44px' : ''})` }}>
        <EdcSidebar active="portfolio" collapsed />
        <div style={{ flex: 1 }}>
          <EdcFilterBar dense chips />
          <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <SLabel eyebrow>Operations · ERCOT focus</SLabel>
                <SHeading size={24}>EDC — 4 filters active</SHeading>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <SBtn ghost>Save view</SBtn>
                <SBtn ghost>Export CSV</SBtn>
                <SBtn accent><SIcon kind="plus" size={11} color={SKETCH.ocean} /> Enroll</SBtn>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 12 }}>
              <KpiStrip dense />
              <SBox style={{ padding: 8 }}>
                <SLabel eyebrow style={{ marginBottom: 4 }}>Geography</SLabel>
                <SketchUSMap height={80} pins choropleth />
              </SBox>
            </div>
            <SBox style={{ padding: 0 }}>
              <div style={{ display: 'grid',
                gridTemplateColumns: '0.5fr 1.6fr 1fr 0.8fr 0.7fr 0.9fr 0.8fr 0.8fr 0.6fr',
                padding: '8px 12px', borderBottom: `1.5px solid ${SKETCH.rule}`,
                background: SKETCH.paperAlt,
              }}>
                {['#','Site','Client','State','ISO','Equipment','Avail MW','Phase','Status'].map(h=>(
                  <SLabel key={h} eyebrow>{h}</SLabel>
                ))}
              </div>
              {[
                [1,'Houston Methodist · Main','HCA Houston','TX','ERCOT','BESS · 2.4 MWh','2.0','Phase 2','Active'],
                [2,'UT Austin · Pickle','UT Austin','TX','ERCOT','RaaS HVAC','3.2','Phase 1','Active'],
                [3,'Advocate · Lutheran Gen','Advocate Health','IL','PJM','BMS HVAC','1.4','Closed','Active'],
                [4,'Caltech · Athenaeum','Caltech','CA','CAISO','BESS · 1.0 MWh','0.9','Phase 2','Pending'],
                [5,'VA Loma Linda','VA Pacific','CA','CAISO','Solar + BESS','2.1','Phase 1','Active'],
                [6,'City of Plano · WTP','City of Plano','TX','ERCOT','Existing Backup Gen','3.4','Closed','Stale'],
                [7,'HCA · West Houston','HCA Houston','TX','ERCOT','BESS · 1.6 MWh','1.6','Phase 2','Active'],
              ].map((r,i)=>(
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '0.5fr 1.6fr 1fr 0.8fr 0.7fr 0.9fr 0.8fr 0.8fr 0.6fr',
                  padding: '9px 12px', fontFamily: handBody, fontSize: 13,
                  borderBottom: `1px dashed ${SKETCH.ruleSoft}`, alignItems: 'center',
                }}>
                  <span style={{ color: SKETCH.inkMute }}>{r[0]}</span>
                  <span style={{ fontFamily: handDisplay, fontSize: 15 }}>{r[1]}</span>
                  <span style={{ color: SKETCH.inkSoft }}>{r[2]}</span>
                  <span>{r[3]}</span>
                  <span>{r[4]}</span>
                  <span>{r[5]}</span>
                  <span style={{ fontFamily: handDisplay, fontSize: 14 }}>{r[6]}</span>
                  <SPill style={{ fontSize: 11 }}>{r[7]}</SPill>
                  <SPill accent={r[8]==='Active'} style={{ fontSize: 11 }}>{r[8]}</SPill>
                </div>
              ))}
            </SBox>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

Object.assign(window, { VariantA_Classic, VariantB_MapHero, VariantC_Split, VariantD_Console, KPIS });
