// EDC events, enrollment & onboarding wireframes.

// ─── DR Events log (variant A: timeline list) ─────────────────
function EventsLog_Timeline() {
  return (
    <SketchFrame label="EVENTS A · Timeline log — chronological with performance bars" w={1280} h={780} scale={0.5}>
      <EdcHeader />
      <div style={{ display: 'flex', height: 'calc(100% - 56px)' }}>
        <EdcSidebar active="events" />
        <div style={{ flex: 1 }}>
          <EdcTitleStrip eyebrow="DR Events" title="Event Log" sub="64 events YTD · 96.1% avg performance"
            actions={<><SBtn ghost>Export</SBtn><SBtn ghost>Date range</SBtn><SBtn>Log Manual Event</SBtn></>} />
          <EdcFilterBar dense />
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <KpiStrip dense tiles={[
              { label: 'Events YTD', value: '64' },
              { label: 'Avg Performance', value: '96.1%' },
              { label: 'Total kWh Curtailed', value: '184K' },
              { label: 'Missed', value: '2', sub: 'past 90d' },
              { label: 'Avg Duration', value: '2.4h' },
              { label: 'Revenue', value: '$2.1M' },
            ]} />
            <SBox style={{ padding: 0 }}>
              {[
                ['Aug 14', '14:02–17:00 CT', 'ERCOT 4CP', 'Emergency', '28.4 MW', '27.4 MW', 96.4, 'Completed'],
                ['Aug 11', '15:30–17:30 PT', 'CAISO DSGS','Economic',  '14.1 MW', '14.4 MW', 102.0,'Completed'],
                ['Aug  7', '13:00–16:00 ET', 'PJM ELRP',  'Emergency', '11.6 MW', '10.3 MW', 88.7, 'Completed'],
                ['Jul 30', '14:00–17:00 ET', 'NYISO SCR', 'Test',      '8.2 MW',  '7.7 MW',  94.1, 'Completed'],
                ['Jul 22', '13:00–17:00 CT', 'ERCOT ERS', 'Economic',  '4.1 MW',  '4.0 MW',  98.1, 'Completed'],
                ['Jul 18', '14:00–18:00 CT', 'ERCOT 4CP', 'Emergency', '24.8 MW', '21.0 MW', 84.7, 'Underperformed'],
              ].map((r,i)=>(
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '0.7fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr 1.4fr 0.9fr',
                  padding: '10px 14px',
                  borderBottom: i<5?`1px dashed ${SKETCH.ruleSoft}`:'none',
                  fontFamily: handBody, fontSize: 13, alignItems:'center',
                }}>
                  <span style={{ fontFamily: handDisplay, fontSize: 16 }}>{r[0]}</span>
                  <span style={{ color: SKETCH.inkSoft, fontSize: 12 }}>{r[1]}</span>
                  <span style={{ fontFamily: handDisplay, fontSize: 14 }}>{r[2]}</span>
                  <SPill style={{ fontSize: 11 }}>{r[3]}</SPill>
                  <span style={{ fontFamily: handDisplay, fontSize: 14 }}>{r[4]}</span>
                  <span style={{ fontFamily: handDisplay, fontSize: 14 }}>{r[5]}</span>
                  {/* perf bar */}
                  <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 8, border: `1px solid ${SKETCH.rule}`, borderRadius: 2, background: SKETCH.paperAlt, overflow:'hidden' }}>
                      <div style={{ width: `${Math.min(r[6], 100)}%`, height: '100%', background: r[6] >= 95 ? SKETCH.lime : r[6] >= 90 ? SKETCH.iced : '#F5C8C8' }} />
                    </div>
                    <span style={{ fontFamily: handDisplay, fontSize: 14, minWidth: 44 }}>{r[6]}%</span>
                  </div>
                  <SPill accent={r[7]==='Completed'} style={{ fontSize: 11 }}>{r[7]}</SPill>
                </div>
              ))}
            </SBox>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

// ─── Event detail (per-asset performance) ─────────────────────
function EventDetail() {
  return (
    <SketchFrame label="EVENT DETAIL · per-asset baseline vs actual" w={1280} h={780} scale={0.5}>
      <EdcHeader />
      <div style={{ display: 'flex', height: 'calc(100% - 56px)' }}>
        <EdcSidebar active="events" collapsed />
        <div style={{ flex: 1 }}>
          <EdcScopeTrail trail={[
            { kind: 'Events', name: 'Log' },
            { kind: 'Event',  name: 'ERCOT 4CP · Aug 14, 2025' },
          ]} />
          <EdcTitleStrip
            eyebrow="DR Event"
            title="ERCOT 4CP — Aug 14, 14:02–17:00 CT"
            sub="Emergency · 14 sites · 28.4 MW called · 27.4 MW delivered · 96.4% achieved"
            actions={<><SBtn ghost>Re-run baseline</SBtn><SBtn ghost>Export PAR</SBtn><SBtn accent>Mark Reviewed</SBtn></>}
          />
          <div style={{ padding: 22, display:'flex', flexDirection:'column', gap: 12 }}>
            <KpiStrip dense tiles={[
              { label: 'Called',      value: '28.4 MW' },
              { label: 'Delivered',   value: '27.4 MW' },
              { label: 'Performance', value: '96.4%', sub: 'baseline: Adj 10-of-10' },
              { label: 'Revenue est.',value: '$182K' },
              { label: 'Sites',       value: '14' },
              { label: 'Assets',      value: '38' },
            ]} />
            <SBox style={{ padding: 14 }}>
              <SLabel eyebrow style={{ marginBottom: 8 }}>Aggregate dispatch · baseline (dashed) vs actual (solid)</SLabel>
              <div style={{ height: 140, border: `1.5px dashed ${SKETCH.ruleSoft}`, borderRadius: 4, position:'relative', background: SKETCH.paperAlt }}>
                <svg viewBox="0 0 600 140" width="100%" height="100%">
                  <path d="M 10 100 L 80 95 L 150 90 L 220 50 L 300 48 L 380 52 L 460 90 L 590 95"
                        fill="none" stroke={SKETCH.steel} strokeWidth="2" strokeDasharray="6,4" />
                  <path d="M 10 100 L 80 96 L 150 92 L 220 76 L 300 72 L 380 78 L 460 92 L 590 96"
                        fill="none" stroke={SKETCH.ocean} strokeWidth="2.5" />
                  <text x="20" y="20" fontFamily={handLabel} fontSize="11" fill={SKETCH.inkSoft}>kW</text>
                  <text x="225" y="44" fontFamily={handLabel} fontSize="11" fill={SKETCH.ocean}>called: 28.4 MW →</text>
                </svg>
              </div>
            </SBox>
            <SBox style={{ padding: 0 }}>
              <div style={{ display:'grid', gridTemplateColumns: '1.6fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.7fr', padding:'8px 14px', background: SKETCH.paperAlt, borderBottom: `1.5px solid ${SKETCH.rule}` }}>
                {['Asset','Site','Baseline kW','Actual kW','Reduction','Reduction %','Pass?'].map(h=><SLabel key={h} eyebrow>{h}</SLabel>)}
              </div>
              {[
                ['BESS · Bay 4','Houston Methodist','3,800','120','3,680','96.8%','✓'],
                ['RaaS HVAC · Tower B','Houston Methodist','1,200','230','970','80.8%','✓'],
                ['BESS · 2.0 MWh','UT MD Anderson','2,800','180','2,620','93.5%','✓'],
                ['Existing Backup Gen','City of Plano WTP','3,400','420','2,980','87.6%','✓'],
                ['BESS · 1.6 MWh','HCA West Houston','1,600','110','1,490','93.1%','✓'],
              ].map((r,i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns: '1.6fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.7fr', padding:'9px 14px', borderBottom: i<4?`1px dashed ${SKETCH.ruleSoft}`:'none', fontFamily: handBody, fontSize: 13, alignItems:'center' }}>
                  <span style={{ fontFamily: handDisplay, fontSize: 14 }}>{r[0]}</span>
                  <span style={{ color: SKETCH.inkSoft }}>{r[1]}</span>
                  <span style={{ fontFamily: handDisplay, fontSize: 13 }}>{r[2]}</span>
                  <span style={{ fontFamily: handDisplay, fontSize: 13 }}>{r[3]}</span>
                  <span style={{ fontFamily: handDisplay, fontSize: 13, color: SKETCH.steel }}>{r[4]}</span>
                  <span style={{ fontFamily: handDisplay, fontSize: 13 }}>{r[5]}</span>
                  <SPill accent style={{ fontSize: 11 }}>{r[6]}</SPill>
                </div>
              ))}
            </SBox>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

// ─── Enrollment slide-over (right drawer) ─────────────────────
function EnrollmentSlideOver() {
  return (
    <SketchFrame label="ENROLLMENT · slide-over drawer (matches EaaS pattern)" w={1280} h={780} scale={0.5}>
      <EdcHeader />
      <div style={{ display: 'flex', height: 'calc(100% - 56px)', position:'relative' }}>
        <EdcSidebar active="enrollment" />
        <div style={{ flex: 1, opacity: 0.45, pointerEvents:'none' }}>
          <EdcTitleStrip eyebrow="Portfolio" title="EDC Overview" />
          <EdcFilterBar />
          <div style={{ padding: 22 }}>
            <KpiStrip dense />
            <div style={{ height: 240, marginTop: 14, border: `1.5px dashed ${SKETCH.ruleSoft}`, borderRadius: 4 }} />
          </div>
        </div>
        {/* scrim */}
        <div style={{ position:'absolute', inset: 0, background: 'rgba(9,43,36,0.18)', pointerEvents:'none' }} />
        {/* drawer */}
        <div style={{
          position:'absolute', right: 0, top: 0, bottom: 0, width: 540,
          background: SKETCH.paper, borderLeft: `1.5px solid ${SKETCH.rule}`,
          boxShadow: '-8px 0 0 rgba(0,0,0,0.05)',
          padding: 22, display:'flex', flexDirection:'column', gap: 14,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div>
              <SLabel eyebrow>New Enrollment</SLabel>
              <SHeading size={24}>Enroll Equipment in DR Program</SHeading>
            </div>
            <span style={{ fontFamily: handBody, fontSize: 18, color: SKETCH.inkSoft }}>×</span>
          </div>
          {/* stepper */}
          <div style={{ display:'flex', gap: 6, alignItems:'center', fontFamily: handLabel, fontSize: 11, textTransform:'uppercase', letterSpacing:'0.1em' }}>
            <span style={{ color: SKETCH.ocean, borderBottom: `2px solid ${SKETCH.lime}`, paddingBottom: 2 }}>1 · Site & Equipment</span>
            <SIcon kind="chevron" size={10} color={SKETCH.inkMute} />
            <span style={{ color: SKETCH.inkSoft }}>2 · Program & MP</span>
            <SIcon kind="chevron" size={10} color={SKETCH.inkMute} />
            <span style={{ color: SKETCH.inkSoft }}>3 · Financials</span>
            <SIcon kind="chevron" size={10} color={SKETCH.inkMute} />
            <span style={{ color: SKETCH.inkSoft }}>4 · Review</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {[
              ['Client',          'HCA Houston ▾', 'lookup'],
              ['Site',            'Houston Methodist · Main ▾', 'lookup'],
              ['Equipment Type',  'BESS · BMS · RaaS · Solar · Existing Backup Gen', 'radio'],
              ['Subtype',         'Li-Ion 2-hr ▾', 'lookup'],
              ['Nameplate (kW)',  '1,200', 'num'],
              ['Capacity (kWh)',  '2,400', 'num'],
              ['Targeted (kW)',   '1,000', 'num'],
            ].map(([l,v,kind],i)=>(
              <div key={i} style={{ display:'flex', flexDirection:'column', gap: 4 }}>
                <SLabel eyebrow>{l}</SLabel>
                {kind === 'radio' ? (
                  <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
                    {v.split(' · ').map((opt,j)=><SPill key={j} accent={j===0} style={{ fontSize: 12 }}>{opt}</SPill>)}
                  </div>
                ) : (
                  <div style={{ border: `1.5px solid ${SKETCH.rule}`, borderRadius: 4, padding: '7px 10px', background: SKETCH.paper, fontFamily: kind==='num'?handDisplay:handBody, fontSize: kind==='num'?15:13 }}>{v}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop: 10, borderTop: `1.5px dashed ${SKETCH.ruleSoft}` }}>
            <SBtn ghost>Cancel</SBtn>
            <div style={{ display:'flex', gap: 8 }}>
              <SBtn ghost>Save draft</SBtn>
              <SBtn accent>Continue →</SBtn>
            </div>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

// ─── Client onboarding (multi-step full page) ─────────────────
function ClientOnboarding() {
  return (
    <SketchFrame label="ONBOARDING · new client multi-step" w={1280} h={780} scale={0.5}>
      <EdcHeader />
      <div style={{ display: 'flex', height: 'calc(100% - 56px)' }}>
        <EdcSidebar active="clients" collapsed />
        <div style={{ flex: 1, padding: '24px 48px', overflow:'auto' }}>
          <SLabel eyebrow>Onboard New Client</SLabel>
          <SHeading size={32} style={{ marginTop: 6 }}>Set up Memorial Hermann Health</SHeading>
          {/* stepper */}
          <div style={{ display:'flex', gap: 0, marginTop: 18, marginBottom: 22, borderBottom: `1.5px solid ${SKETCH.rule}` }}>
            {[
              ['1','Client info','done'],
              ['2','Sites','active'],
              ['3','Utilities & ISO','todo'],
              ['4','Equipment seed','todo'],
              ['5','Programs & MP','todo'],
              ['6','Review','todo'],
            ].map(([n,l,s],i)=>(
              <div key={i} style={{
                flex: 1, padding: '10px 14px',
                borderBottom: s==='active' ? `2px solid ${SKETCH.ocean}` : '2px solid transparent',
                background: s==='done' ? 'rgba(214,239,75,0.18)' : 'transparent',
                display:'flex', gap: 10, alignItems:'center',
                fontFamily: handBody,
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 999,
                  border: `1.5px solid ${SKETCH.ocean}`,
                  background: s==='done'? SKETCH.lime : (s==='active'? SKETCH.ocean : 'transparent'),
                  color: s==='active'? '#fff' : SKETCH.ocean,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily: handDisplay, fontSize: 13,
                }}>{s==='done' ? '✓' : n}</span>
                <span style={{ fontSize: 13, color: s==='todo'? SKETCH.inkSoft : SKETCH.ocean, fontFamily: handDisplay, fontSize: 14 }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap: 24 }}>
            <div>
              <SHeading size={22}>Step 2 — Add sites for this client</SHeading>
              <SLabel style={{ color: SKETCH.inkSoft, marginTop: 4, marginBottom: 14 }}>
                One row per meter / account number. Geocode runs automatically.
              </SLabel>
              <SBox style={{ padding: 0 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1.6fr 0.8fr 0.8fr 0.8fr 0.8fr 0.5fr', padding:'8px 12px', background: SKETCH.paperAlt, borderBottom: `1.5px solid ${SKETCH.rule}` }}>
                  {['Site name','Address','Utility','Account #','Peak kW','Campus SF',''].map(h=><SLabel key={h} eyebrow>{h}</SLabel>)}
                </div>
                {[
                  ['Memorial City Med Ctr','921 Gessner Rd, Houston TX','Centerpoint','40-3812','9,400','1.4M'],
                  ['Memorial Hermann · TMC','6411 Fannin St, Houston TX','Centerpoint','40-3814','14,200','2.1M'],
                  ['Memorial · Northeast','1635 N Loop W, Houston TX','Centerpoint','40-3851','5,800','680K'],
                ].map((r,i)=>(
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1.6fr 1.6fr 0.8fr 0.8fr 0.8fr 0.8fr 0.5fr', padding:'10px 12px', borderBottom:`1px dashed ${SKETCH.ruleSoft}`, fontFamily: handBody, fontSize: 13, alignItems:'center' }}>
                    <span style={{ fontFamily: handDisplay, fontSize: 15 }}>{r[0]}</span>
                    <span style={{ color: SKETCH.inkSoft }}>{r[1]}</span>
                    <span>{r[2]}</span><span>{r[3]}</span>
                    <span style={{ fontFamily: handDisplay, fontSize: 14 }}>{r[4]}</span>
                    <span style={{ fontFamily: handDisplay, fontSize: 14 }}>{r[5]}</span>
                    <span style={{ color: SKETCH.inkMute, textAlign:'right' }}>⋯</span>
                  </div>
                ))}
                <div style={{ padding: '10px 12px', display:'flex', gap: 8 }}>
                  <SBtn ghost size="sm"><SIcon kind="plus" size={11} /> Add row</SBtn>
                  <SBtn ghost size="sm">Import CSV</SBtn>
                  <SBtn ghost size="sm">Pull from eWay</SBtn>
                </div>
              </SBox>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop: 18 }}>
                <SBtn ghost>← Back</SBtn>
                <div style={{ display:'flex', gap: 8 }}><SBtn ghost>Save & exit</SBtn><SBtn accent>Continue →</SBtn></div>
              </div>
            </div>
            <SBox style={{ padding: 12, height: 'fit-content' }}>
              <SLabel eyebrow style={{ marginBottom: 8 }}>Geocoded preview</SLabel>
              <SketchUSMap height={120} pins choropleth={false} />
              <div style={{ height: 1, background: SKETCH.ruleSoft, margin: '10px 0' }} />
              <SLabel eyebrow style={{ marginBottom: 6 }}>Tips</SLabel>
              <SLines count={4} widths={[200,180,210,150]} />
            </SBox>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

// ─── Filter-bar pattern variations (3 options shown stacked) ──
function FilterBarPatterns() {
  return (
    <SketchFrame label="FILTER BAR · 3 patterns shown stacked" w={1280} h={780} scale={0.5}>
      <EdcHeader />
      <div style={{ padding: 22, display:'flex', flexDirection:'column', gap: 22 }}>
        <div>
          <SLabel eyebrow>Pattern A · Plain dropdown row (cpower style)</SLabel>
          <div style={{ marginTop: 8, border: `1.5px solid ${SKETCH.rule}`, borderRadius: 6 }}>
            <EdcFilterBar />
          </div>
        </div>
        <div>
          <SLabel eyebrow>Pattern B · Dropdowns + active-filter chips</SLabel>
          <div style={{ marginTop: 8, border: `1.5px solid ${SKETCH.rule}`, borderRadius: 6 }}>
            <EdcFilterBar chips />
          </div>
        </div>
        <div>
          <SLabel eyebrow>Pattern C · Saved-view picker (presets) + dropdowns</SLabel>
          <div style={{ marginTop: 8, border: `1.5px solid ${SKETCH.rule}`, borderRadius: 6 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8, padding: '10px 22px', background: SKETCH.paperAlt, borderBottom: `1px dashed ${SKETCH.ruleSoft}` }}>
              <SLabel eyebrow style={{ marginRight: 4 }}>View</SLabel>
              <SPill accent>★ My TX BESS pipeline</SPill>
              <SPill>HCA Healthcare</SPill>
              <SPill>CAISO active</SPill>
              <SPill>Underperforming events</SPill>
              <span style={{ marginLeft: 8, fontFamily: handLabel, fontSize: 12, color: SKETCH.steel, textDecoration:'underline' }}>+ Save current as preset</span>
            </div>
            <EdcFilterBar dense />
          </div>
        </div>
        <SAnnot x={26} y={680} w={520} side="right">
          → Recommendation: Pattern B with persistent chips.<br/>
          Sticks across nav (per session), URL-encoded so views are shareable.
        </SAnnot>
      </div>
    </SketchFrame>
  );
}

Object.assign(window, {
  EventsLog_Timeline, EventDetail, EnrollmentSlideOver,
  ClientOnboarding, FilterBarPatterns,
});
