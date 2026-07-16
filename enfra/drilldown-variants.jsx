// EDC drilldown variants — Portfolio → Client → Site → Equipment.
// Three navigation models, each shown as a single artboard.

// ─── Drilldown Model 1: Filter-bar re-scope (one page, swap data) ───
function DrilldownModel1_FilterRescope() {
  return (
    <SketchFrame label="DRILLDOWN 1 · Filter-bar re-scope — same page, data swaps as you narrow" w={1280} h={780} scale={0.5}>
      <EdcHeader />
      <div style={{ display: 'flex', height: 'calc(100% - 56px)' }}>
        <EdcSidebar active="portfolio" />
        <div style={{ flex: 1 }}>
          <EdcTitleStrip
            eyebrow="Scope · Site"
            title="Houston Methodist · Main"
            sub="HCA Houston · 1812 Bertner Ave, Houston TX · ERCOT"
            actions={<><SBtn ghost>← Up to Client</SBtn><SBtn accent>Enroll Equipment</SBtn></>}
          />
          <EdcFilterBar filters={{ iso: 'ERCOT', state: 'TX', clientType: 'Healthcare' }} chips />
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <KpiStrip dense tiles={[
              { label: 'Buildings', value: '14' },
              { label: 'Campus SF', value: '1.8M' },
              { label: 'Peak Demand', value: '12.4 MW' },
              { label: 'Avail. MW', value: '4.8' },
              { label: 'Active Enroll.', value: '8' },
              { label: 'YTD Savings', value: '$284K' },
            ]} />
            <SAnnot x={920} y={180} w={260}>
              ↑ same KPI strip layout as portfolio,<br/>
              just re-scoped to one site
            </SAnnot>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <SBox style={{ padding: 12 }}>
                <SLabel eyebrow style={{ marginBottom: 8 }}>Equipment at this Site</SLabel>
                {[
                  ['BESS · Bay 4',     '2.4 MWh', 'ERCOT 4CP, ERS', 'Active'],
                  ['RaaS HVAC · Tower B','1.2 MW',  'ERCOT 4CP',      'Active'],
                  ['Existing Backup Gen','3.0 MW',  'ERCOT ERS',      'Active'],
                  ['BMS · Steam Chillers','0.9 MW', '—',              'Eval'],
                ].map((r,i)=>(
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1.6fr 0.8fr 1.2fr 0.6fr', padding:'8px 0', borderBottom: i<3?`1px dashed ${SKETCH.ruleSoft}`:'none', fontFamily: handBody, fontSize: 13, alignItems:'center'}}>
                    <span style={{ fontFamily: handDisplay, fontSize: 15 }}>{r[0]}</span>
                    <span style={{ fontFamily: handDisplay, fontSize: 14 }}>{r[1]}</span>
                    <span style={{ fontSize: 12, color: SKETCH.inkSoft }}>{r[2]}</span>
                    <SPill accent={r[3]==='Active'} style={{ fontSize: 11 }}>{r[3]}</SPill>
                  </div>
                ))}
              </SBox>
              <SBox style={{ padding: 12 }}>
                <SLabel eyebrow style={{ marginBottom: 8 }}>Recent DR Events at this Site</SLabel>
                {[
                  ['Aug 14','ERCOT 4CP','3.8 MW','97.2%'],
                  ['Aug  3','ERCOT ERS','2.1 MW','94.8%'],
                  ['Jul 22','ERCOT ERS','2.0 MW','98.1%'],
                ].map((r,i)=>(
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'0.6fr 1fr 0.7fr 0.7fr', padding:'8px 0', borderBottom: i<2?`1px dashed ${SKETCH.ruleSoft}`:'none', fontFamily: handBody, fontSize: 13}}>
                    <span style={{ color: SKETCH.inkSoft }}>{r[0]}</span>
                    <span>{r[1]}</span>
                    <span style={{ fontFamily: handDisplay, fontSize: 14 }}>{r[2]}</span>
                    <span style={{ fontFamily: handDisplay, fontSize: 14, color: SKETCH.steel }}>{r[3]}</span>
                  </div>
                ))}
              </SBox>
            </div>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

// ─── Drilldown Model 2: Breadcrumb stack — discrete pages ───
function DrilldownModel2_Breadcrumb() {
  return (
    <SketchFrame label="DRILLDOWN 2 · Breadcrumb stack — discrete pages per level" w={1280} h={780} scale={0.5}>
      <EdcHeader />
      <div style={{ display: 'flex', height: 'calc(100% - 56px)' }}>
        <EdcSidebar active="clients" />
        <div style={{ flex: 1 }}>
          <EdcScopeTrail trail={[
            { kind: 'Portfolio', name: 'All' },
            { kind: 'Client',    name: 'HCA Houston' },
            { kind: 'Site',      name: 'Houston Methodist · Main' },
            { kind: 'Equipment', name: 'BESS · Bay 4' },
          ]} />
          <EdcTitleStrip
            eyebrow="Equipment"
            title="BESS · Bay 4"
            sub="2.4 MWh · 1.2 MW nameplate · enrolled in 2 programs"
            actions={<><SBtn ghost>← Back to Site</SBtn><SBtn>Edit Equipment</SBtn></>}
          />
          <EdcFilterBar dense />
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
              <SBox style={{ padding: 14 }}>
                <SLabel eyebrow style={{ marginBottom: 10 }}>Enrollments</SLabel>
                {[
                  ['ERCOT 4CP',  'CPower',  'Phase 2', '$182K/yr', '$24K fee'],
                  ['ERCOT ERS',  'CPower',  'Phase 2', '$96K/yr',  '$12K fee'],
                ].map((r,i)=>(
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr 1fr 0.8fr',
                    padding: '10px 0', borderBottom: i<1?`1px dashed ${SKETCH.ruleSoft}`:'none',
                    fontFamily: handBody, fontSize: 13, alignItems:'center'
                  }}>
                    <span style={{ fontFamily: handDisplay, fontSize: 15 }}>{r[0]}</span>
                    <span>{r[1]}</span>
                    <SPill style={{ fontSize: 11 }}>{r[2]}</SPill>
                    <span style={{ fontFamily: handDisplay, fontSize: 14, color: SKETCH.steel }}>{r[3]}</span>
                    <span style={{ color: SKETCH.inkSoft }}>{r[4]}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1.5px solid ${SKETCH.rule}` }}>
                  <SLabel eyebrow style={{ marginBottom: 8 }}>Live Telemetry · SkySpark</SLabel>
                  <div style={{ height: 100, border: `1.5px dashed ${SKETCH.ruleSoft}`, borderRadius: 4, display:'flex', alignItems:'center', justifyContent:'center', fontFamily: handLabel, color: SKETCH.inkMute }}>
                    [ kW timeseries chart · live SkySpark feed ]
                  </div>
                </div>
              </SBox>
              <SBox style={{ padding: 14 }}>
                <SLabel eyebrow style={{ marginBottom: 8 }}>Specs</SLabel>
                {[
                  ['Type',      'BESS'],
                  ['Subtype',   'Li-Ion · 2-hr'],
                  ['Nameplate', '1.2 MW'],
                  ['Capacity',  '2.4 MWh'],
                  ['Targeted',  '1.0 MW'],
                  ['Installed', 'May 2024'],
                  ['Vendor',    'Stem Inc.'],
                  ['SkySpark ID','site:hou-meth · pt:bess.bay4.kW'],
                ].map(([k,v],i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom: i<7?`1px dashed ${SKETCH.ruleSoft}`:'none', fontFamily: handBody, fontSize: 13 }}>
                    <span style={{ color: SKETCH.inkSoft }}>{k}</span>
                    <span style={{ fontFamily: k === 'SkySpark ID' ? handBody : handDisplay, fontSize: 13 }}>{v}</span>
                  </div>
                ))}
              </SBox>
            </div>
            <SAnnot x={300} y={420} w={300}>
              ↑ each level (client, site, equipment) is its<br/>
              own page; breadcrumb above is the spine
            </SAnnot>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

// ─── Drilldown Model 3: Master-detail — list left, detail right ──
function DrilldownModel3_MasterDetail() {
  return (
    <SketchFrame label="DRILLDOWN 3 · Master-detail — list pinned left, detail rolls in right" w={1280} h={780} scale={0.5}>
      <EdcHeader />
      <div style={{ display: 'flex', height: 'calc(100% - 56px)' }}>
        <EdcSidebar active="sites" collapsed />
        <div style={{ flex: 1, display:'flex', flexDirection:'column' }}>
          <EdcFilterBar dense />
          <div style={{ display:'flex', flex: 1 }}>
            {/* master list */}
            <div style={{ width: 320, borderRight: `1.5px solid ${SKETCH.rule}`, background: SKETCH.paperAlt }}>
              <div style={{ padding: '10px 14px', borderBottom: `1px dashed ${SKETCH.ruleSoft}` }}>
                <SLabel eyebrow>Sites · 142</SLabel>
                <div style={{ display:'flex', gap:6, marginTop: 6 }}>
                  <SPill accent>Texas</SPill>
                  <SPill>BESS</SPill>
                </div>
              </div>
              {[
                ['Houston Methodist · Main','HCA Houston','4.8 MW', true],
                ['UT Austin · Pickle','UT Austin','3.2 MW', false],
                ['City of Plano · WTP','City of Plano','3.4 MW', false],
                ['HCA · West Houston','HCA Houston','1.6 MW', false],
                ['UT MD Anderson','UT MD Anderson','2.8 MW', false],
                ['Baylor · Plano','Baylor Scott & White','2.1 MW', false],
                ['Methodist · Sugar Land','HCA Houston','1.9 MW', false],
                ['Rice · Brockman','Rice Univ.','0.8 MW', false],
              ].map(([n,c,mw, on],i)=>(
                <div key={i} style={{
                  padding: '10px 14px',
                  borderBottom: `1px dashed ${SKETCH.ruleSoft}`,
                  borderLeft: on ? `3px solid ${SKETCH.lime}` : '3px solid transparent',
                  background: on ? SKETCH.paper : 'transparent',
                  fontFamily: handBody, fontSize: 13,
                }}>
                  <div style={{ fontFamily: handDisplay, fontSize: 15 }}>{n}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', color: SKETCH.inkSoft, fontSize: 12 }}>
                    <span>{c}</span><span style={{ fontFamily: handDisplay, fontSize: 13 }}>{mw}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* detail */}
            <div style={{ flex: 1, padding: 18, overflow: 'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 12 }}>
                <div>
                  <SLabel eyebrow>Site detail</SLabel>
                  <SHeading size={26}>Houston Methodist · Main</SHeading>
                  <SLabel style={{ color: SKETCH.inkSoft }}>HCA Houston · ERCOT · 1.8M sf · 14 buildings</SLabel>
                </div>
                <SBtn accent>Enroll Equipment</SBtn>
              </div>
              <KpiStrip dense tiles={[
                { label: 'Peak kW', value: '12,400' },
                { label: 'Avail. MW', value: '4.8' },
                { label: 'Programs', value: '3' },
                { label: 'YTD $', value: '$284K' },
              ]} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginTop: 14 }}>
                <SBox style={{ padding: 12, height: 220 }}>
                  <SLabel eyebrow style={{ marginBottom: 8 }}>Equipment</SLabel>
                  <SLines count={6} widths={[240,200,260,180,210,170]} />
                </SBox>
                <SBox style={{ padding: 12, height: 220 }}>
                  <SLabel eyebrow style={{ marginBottom: 8 }}>Recent Events</SLabel>
                  <SLines count={5} widths={[230,200,180,210,150]} />
                </SBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SketchFrame>
  );
}

Object.assign(window, { DrilldownModel1_FilterRescope, DrilldownModel2_Breadcrumb, DrilldownModel3_MasterDetail });
