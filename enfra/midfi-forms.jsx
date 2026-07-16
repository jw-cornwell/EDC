// Mid-fi Enrollment slide-over drawer — 4 steps.

const EnrField = ({ label, value, suffix, mono }) => (
  <div>
    <div style={{ fontFamily: sansT, fontSize: 10.5, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
    <div style={{ padding: '8px 10px', border: `1px solid ${T.border2}`, borderRadius: 4, background: T.paper, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: mono ? monoT : sansT, fontSize: 13, color: T.ink, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {suffix && <span style={{ fontSize: 11, color: T.ink3, fontFamily: monoT }}>{suffix}</span>}
    </div>
  </div>
);

// ─── Step 1: Site selection ──────────────────────────────────
function EnrStepSite() {
  return (
    <>
      <Eyebrow style={{ marginBottom: 10 }}>Where is this equipment installed?</Eyebrow>
      <div style={{ marginBottom: 18 }}>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div style={{ padding: '10px 12px', border: `1.5px solid ${T.ocean}`, borderRadius: 4, background: T.paper, display: 'flex', alignItems: 'center', gap: 10 }}>
            <SIcon kind="search" size={14} color={T.ink3} />
            <span style={{ fontFamily: sansT, fontSize: 13, color: T.ink }}>HCA Memorial Hospital · Houston, TX</span>
            <span style={{ marginLeft: 'auto', fontFamily: monoT, fontSize: 11, color: T.ok, fontWeight: 600 }}>✓ Match</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['HCA Memorial · Houston', 'TMC, Bldg D · 412 beds', 'ERCOT (CenterPoint)', '18.4 MW', true],
            ['HCA Memorial · Bellaire', 'Bellaire, TX · 218 beds', 'ERCOT (CenterPoint)', '9.2 MW', false],
            ['HCA Memorial · Sugar Land', 'Sugar Land, TX · 184 beds', 'ERCOT (CenterPoint)', '7.6 MW', false],
          ].map(([n, sub, iso, mw, sel], i) => (
            <div key={i} style={{
              padding: '11px 13px', borderRadius: 5,
              border: sel ? `1.5px solid ${T.ocean}` : `1px solid ${T.border2}`,
              background: sel ? 'rgba(214,239,75,0.10)' : T.paper,
              display: 'flex', alignItems: 'center', gap: 11,
            }}>
              <div style={{
                width: 15, height: 15, borderRadius: 999,
                border: `1.5px solid ${sel ? T.ocean : T.border2}`,
                background: sel ? T.ocean : T.paper,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{sel && <div style={{ width: 6, height: 6, borderRadius: 999, background: '#fff' }} />}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: sansT, fontSize: 13, fontWeight: 600, color: T.ink }}>{n}</div>
                <div style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3 }}>{sub} · {iso}</div>
              </div>
              <div style={{ fontFamily: monoT, fontSize: 12, color: T.ocean, fontWeight: 600 }}>{mw}</div>
            </div>
          ))}
        </div>
      </div>
      <Eyebrow style={{ marginBottom: 10 }}>Building & metering</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <EnrField label="Building" value="Bldg D · MEP-1" />
        <EnrField label="Utility account" value="CNP-4471-9920" mono />
        <EnrField label="ESI ID" value="10443720008842" mono />
        <EnrField label="Service voltage" value="12.47 kV" />
      </div>
    </>
  );
}

// ─── Step 2: Equipment ───────────────────────────────────────
function EnrStepEquipment() {
  return (
    <>
      <Eyebrow style={{ marginBottom: 10 }}>Equipment identification</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <EnrField label="Tag" value="BESS-12" mono />
        <EnrField label="Type" value="Battery storage" />
        <EnrField label="Make" value="Tesla" />
        <EnrField label="Model" value="Megapack 2XL" />
        <EnrField label="Nameplate" value="1,900 kW" mono />
        <EnrField label="Energy" value="3,916 kWh" mono />
      </div>

      <Eyebrow style={{ marginBottom: 10 }}>Operational profile</Eyebrow>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['24/7 dispatchable', 'Full nameplate available year-round', true],
            ['Daytime only',     'Solar pairing · 6am-8pm dispatch window', false],
            ['Seasonal',         'Summer-only or winter-only response', false],
          ].map(([n, d, sel], i) => (
            <div key={i} style={{
              padding: '11px 13px', borderRadius: 5,
              border: sel ? `1.5px solid ${T.ocean}` : `1px solid ${T.border2}`,
              background: sel ? 'rgba(214,239,75,0.10)' : T.paper,
              display: 'flex', alignItems: 'center', gap: 11,
            }}>
              <div style={{
                width: 15, height: 15, borderRadius: 999,
                border: `1.5px solid ${sel ? T.ocean : T.border2}`,
                background: sel ? T.ocean : T.paper,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{sel && <div style={{ width: 6, height: 6, borderRadius: 999, background: '#fff' }} />}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: sansT, fontSize: 13, fontWeight: 600, color: T.ink }}>{n}</div>
                <div style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Eyebrow style={{ marginBottom: 10 }}>Telemetry source</Eyebrow>
      <div style={{ padding: 12, background: T.icedSoft, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: T.ocean, fontFamily: sansT }}>
        <SIcon kind="bolt" size={14} color={T.ocean} />
        <span>SkySpark feed auto-detected · 4-second resolution</span>
        <span style={{ marginLeft: 'auto', fontWeight: 600, color: T.ok }}>✓ Connected</span>
      </div>
    </>
  );
}

// ─── Step 3: Program (existing body) ─────────────────────────
function EnrStepProgram() {
  return (
    <>
      <Eyebrow style={{ marginBottom: 10 }}>Program selection</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
        {[
          ['ERCOT 4CP',     'Day-ahead capacity · 4 coincident peaks per year',     '$112/kW-yr', true],
          ['ERCOT ECRS',    'Ancillary · 10-min response · day-of dispatch',         '$48/kW-yr', false],
          ['ERCOT ERS',     'Emergency reserve · 30-min · winter & summer',          '$28/kW-yr', false],
          ['CenterPoint LM','Utility load mgmt · summer only',                       '$14/kW-yr', false],
        ].map(([n, d, p, sel], i) => (
          <div key={i} style={{
            padding: '12px 14px', borderRadius: 6,
            border: sel ? `1.5px solid ${T.ocean}` : `1px solid ${T.border2}`,
            background: sel ? 'rgba(214,239,75,0.10)' : T.paper,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: 999,
              border: `1.5px solid ${sel ? T.ocean : T.border2}`,
              background: sel ? T.ocean : T.paper,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{sel && <div style={{ width: 7, height: 7, borderRadius: 999, background: '#fff' }} />}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: sansT, fontSize: 13.5, fontWeight: 600, color: T.ink }}>{n}</div>
              <div style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3, marginTop: 1 }}>{d}</div>
            </div>
            <div style={{ fontFamily: monoT, fontSize: 13, fontWeight: 600, color: T.ocean }}>{p}</div>
          </div>
        ))}
      </div>

      <Eyebrow style={{ marginBottom: 10 }}>Nomination</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
        <EnrField label="Capacity nominated" value="1,900 kW" suffix="of 1,900 kW" mono />
        <EnrField label="Notification window" value="Day-ahead" />
        <EnrField label="Ramp time" value="10 min" mono />
        <EnrField label="Min. response duration" value="60 min" mono />
        <EnrField label="Season start" value="Jun 1, 2026" />
        <EnrField label="Season end" value="Sep 30, 2026" />
      </div>

      <Eyebrow style={{ marginBottom: 10 }}>Telemetry</Eyebrow>
      <div style={{ padding: 12, background: T.icedSoft, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: T.ocean, fontFamily: sansT }}>
        <SIcon kind="bolt" size={14} color={T.ocean} />
        <span>SkySpark feed detected · 4-second resolution · CBL ready</span>
        <span style={{ marginLeft: 'auto', fontWeight: 600, color: T.ok }}>✓ Connected</span>
      </div>
    </>
  );
}

// ─── Step 4: Financials ──────────────────────────────────────
function EnrStepFinancials() {
  return (
    <>
      <Eyebrow style={{ marginBottom: 10 }}>Revenue projection</Eyebrow>
      <div style={{ padding: 14, background: 'linear-gradient(135deg, rgba(0,68,82,0.06), rgba(214,239,75,0.10))', borderRadius: 6, border: `1px solid ${T.border2}`, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={{ fontFamily: sansT, fontSize: 10.5, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gross program revenue / yr</div>
            <div style={{ fontFamily: monoT, fontSize: 22, fontWeight: 700, color: T.ocean, fontVariantNumeric: 'tabular-nums' }}>$212,800</div>
            <div style={{ fontSize: 11, color: T.ink3, fontFamily: sansT }}>1,900 kW × $112/kW-yr · paid by CPower</div>
          </div>
          <div>
            <div style={{ fontFamily: sansT, fontSize: 10.5, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Net to client</div>
            <div style={{ fontFamily: monoT, fontSize: 22, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>$148,960</div>
            <div style={{ fontSize: 11, color: T.ink3, fontFamily: sansT }}>after CPower + ENFRA shares</div>
          </div>
        </div>
      </div>

      <Eyebrow style={{ marginBottom: 10 }}>Revenue split — three party</Eyebrow>
      {/* Stacked share bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', height: 28, borderRadius: 4, overflow: 'hidden', border: `1px solid ${T.border2}` }}>
          <div style={{ flex: 70, background: T.ocean, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: monoT, fontSize: 11.5, fontWeight: 700, color: '#fff' }}>Client · 70%</div>
          <div style={{ flex: 20, background: T.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: monoT, fontSize: 11.5, fontWeight: 700, color: T.ocean }}>ENFRA · 20%</div>
          <div style={{ flex: 10, background: T.steel, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: monoT, fontSize: 11, fontWeight: 700, color: '#fff' }}>CPower · 10%</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
        <div style={{ padding: 10, border: `1px solid ${T.border2}`, borderRadius: 4, background: T.paper }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: T.ocean }} />
            <span style={{ fontFamily: sansT, fontSize: 10.5, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Client</span>
          </div>
          <div style={{ fontFamily: monoT, fontSize: 15, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>$148,960</div>
          <div style={{ fontFamily: monoT, fontSize: 11, color: T.ink3 }}>70 % · HCA Healthcare</div>
        </div>
        <div style={{ padding: 10, border: `1px solid ${T.border2}`, borderRadius: 4, background: T.paper }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: T.lime }} />
            <span style={{ fontFamily: sansT, fontSize: 10.5, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>ENFRA</span>
          </div>
          <div style={{ fontFamily: monoT, fontSize: 15, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>$42,560</div>
          <div style={{ fontFamily: monoT, fontSize: 11, color: T.ink3 }}>20 % · M&V + ops</div>
        </div>
        <div style={{ padding: 10, border: `1px solid ${T.border2}`, borderRadius: 4, background: T.paper }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: T.steel }} />
            <span style={{ fontFamily: sansT, fontSize: 10.5, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>CPower</span>
          </div>
          <div style={{ fontFamily: monoT, fontSize: 15, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>$21,280</div>
          <div style={{ fontFamily: monoT, fontSize: 11, color: T.ink3 }}>10 % · ISO aggregator</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <EnrField label="Performance floor" value="85 %" mono suffix="of nom." />
        <EnrField label="Penalty cap" value="$24,000" mono suffix="/yr" />
        <EnrField label="CPower contract" value="MSA-2024-114" mono suffix="active" />
        <EnrField label="Settlement schedule" value="N+45 days" />
      </div>

      <Eyebrow style={{ marginBottom: 10 }}>Invoicing</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <EnrField label="Cadence" value="Monthly" />
        <EnrField label="First payout" value="Jul 15, 2026" />
        <EnrField label="Bill-to entity" value="HCA Healthcare LLC" />
        <EnrField label="PO #" value="HCA-2026-08842" mono />
      </div>

      <Eyebrow style={{ marginBottom: 10 }}>Sign-off</Eyebrow>
      <div style={{ padding: 12, background: T.paper, border: `1px dashed ${T.border2}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: T.ink2, fontFamily: sansT }}>
        <SIcon kind="check" size={14} color={T.ok} />
        <span>Contract amendment ready · DocuSign envelope queued for S. Reyes</span>
        <span style={{ marginLeft: 'auto', fontWeight: 600, color: T.ink3, fontFamily: monoT, fontSize: 11 }}>Awaiting send</span>
      </div>
    </>
  );
}

function MidFiEnrollmentDrawer({ eventBanner, step = 3 }) {
  const stepLabels = ['Site', 'Equipment', 'Program', 'Financials'];
  const stepBody =
    step === 1 ? <EnrStepSite /> :
    step === 2 ? <EnrStepEquipment /> :
    step === 3 ? <EnrStepProgram /> :
    <EnrStepFinancials />;
  const footerActions = {
    1: ['Save & Close', '← Back', 'Continue to Equipment →'],
    2: ['Save & Close', '← Back', 'Continue to Program →'],
    3: ['Save & Close', '← Back', 'Continue to Financials →'],
    4: ['Save & Close', '← Back', 'Submit for review'],
  }[step];

  return (
    <MfFrame label={`Enrollment Drawer · Step ${step} of 4 · Mid-fi`} w={1280} h={820} scale={0.5}>
      <MfHeader eventActive={eventBanner} breadcrumb={['Enrollment']} />
      <MfEventBanner on={eventBanner} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <MfSidebar active="enrollment" />
        <div style={{ flex: 1, overflow: 'auto', background: T.bg, position: 'relative' }}>
          <MfTitleStrip
            eyebrow="Enrollment Pipeline"
            title="Equipment Enrollment"
            sub="48 active · 12 pending review · 4 in financials"
            actions={<><Btn>Bulk Import</Btn><Btn icon="plus" kind="accent">New Enrollment</Btn></>}
          />
          <MfFilterBar chips={[{ label: 'Status', value: 'Pending review' }]} />
          <div style={{ padding: 24, opacity: 0.45, filter: 'blur(0.5px)', pointerEvents: 'none' }}>
            <Card padding={0}>
              <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1.4fr 1.2fr 0.9fr 0.9fr 1fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
                {['Tag', 'Equipment', 'Site', 'Program', 'Stage', 'Updated'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
              </div>
              {[
                ['BESS-12','Tesla Megapack 2XL', 'HCA Memorial · Houston', 'ERCOT 4CP', 'Financials',  '2 days ago'],
                ['CH-09', 'Trane CVHF-1500',     'Caltech · Beckman',     'CAISO DSGS','Site verify', '1 day ago'],
                ['GEN-04','Cummins QSK60-G6',    'VA San Diego',           'CAISO PDR', 'Pending review','3 hr ago'],
                ['AHU-22','York YK Air Handler', 'UT Austin · Welch',     'ERCOT 4CP', 'Pending review','5 hr ago'],
                ['BESS-13','Tesla Megapack 2XL', 'Advocate Lutheran',     'PJM ELRP',  'Financials',  '3 days ago'],
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '0.6fr 1.4fr 1.2fr 0.9fr 0.9fr 1fr', padding: '11px 14px', borderBottom: i < 4 ? `1px solid ${T.borderSoft}` : 'none', fontSize: 12.5, fontFamily: sansT }}>
                  <span style={{ fontFamily: monoT, fontWeight: 600, color: T.ocean }}>{r[0]}</span>
                  <span>{r[1]}</span>
                  <span style={{ color: T.ink3 }}>{r[2]}</span>
                  <span>{r[3]}</span>
                  <StatusPill kind="info">{r[4]}</StatusPill>
                  <span style={{ color: T.ink3 }}>{r[5]}</span>
                </div>
              ))}
            </Card>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,43,36,0.32)', zIndex: 5 }} />
        </div>

        {/* Slide-over drawer */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: 580, background: T.paper, boxShadow: '-12px 0 40px rgba(0,0,0,0.18)',
          zIndex: 10, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Eyebrow style={{ marginBottom: 4 }}>New Enrollment · Step {step} of 4</Eyebrow>
              <h2 style={{ margin: 0, fontFamily: sansT, fontSize: 20, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>BESS-12 · Tesla Megapack 2XL</h2>
              <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>HCA Memorial · Houston, TX · ERCOT 4CP</div>
            </div>
            <button style={{ width: 30, height: 30, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: T.ink3 }}>×</button>
          </div>

          {/* Stepper */}
          <div style={{ padding: '14px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 4, alignItems: 'center' }}>
            {stepLabels.map((s, i) => {
              const status = i < step - 1 ? 'done' : i === step - 1 ? 'active' : 'todo';
              return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 999,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: status === 'done' ? T.ocean : status === 'active' ? T.lime : T.borderSoft,
                      color: status === 'done' ? '#fff' : T.ocean,
                      fontFamily: monoT, fontSize: 11, fontWeight: 700,
                      border: status === 'active' ? `1.5px solid ${T.ocean}` : 'none',
                    }}>{status === 'done' ? '✓' : i + 1}</div>
                    <span style={{ fontFamily: sansT, fontSize: 12.5, fontWeight: status === 'active' ? 600 : 500, color: status === 'todo' ? T.ink3 : T.ink }}>{s}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: 1, background: i < step - 1 ? T.ocean : T.border, margin: '0 4px' }} />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Form body */}
          <div style={{ flex: 1, overflow: 'auto', padding: 22 }}>
            {stepBody}
          </div>

          {/* Drawer footer */}
          <div style={{ padding: '14px 22px', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, color: T.ink3, fontFamily: sansT }}>Auto-saved 4s ago</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn>{footerActions[0]}</Btn>
              {step > 1 && <Btn>{footerActions[1]}</Btn>}
              <Btn kind="primary">{footerActions[2]}</Btn>
            </div>
          </div>
        </div>
      </div>
    </MfFrame>
  );
}

Object.assign(window, { MidFiEnrollmentDrawer });
