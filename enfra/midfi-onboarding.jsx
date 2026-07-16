// Mid-fi Onboarding wizard — 6 steps, each rendered via the `step` prop.
// Step 1: Client info  ·  2: Vertical & contacts  ·  3: Sites
// Step 4: Equipment    ·  5: Programs            ·  6: Financials & sign-off

const ONBOARD_STEPS = [
  ['Client info',          'S. Reyes · started Aug 12'],
  ['Vertical & contacts',  '4 contacts · primary: D. Patel'],
  ['Sites',                '23 sites scoped · 184 buildings'],
  ['Equipment import',     '178 / 184 auto-matched · eWay'],
  ['Programs',             '6 programs evaluated · 4 selected'],
  ['Financials & sign-off','Revenue split · DocuSign'],
];

const stepStatus = (i, current) => i < current - 1 ? 'done' : i === current - 1 ? 'active' : 'todo';

function Stepper({ current }) {
  return (
    <div style={{ padding: '20px 24px', background: T.paper, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {ONBOARD_STEPS.map(([name, sub], i) => {
          const status = stepStatus(i, current);
          return (
            <React.Fragment key={name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: status === 'done' ? T.ocean : status === 'active' ? T.lime : T.borderSoft,
                  color: status === 'done' ? '#fff' : T.ocean,
                  fontFamily: monoT, fontSize: 12, fontWeight: 700,
                  border: status === 'active' ? `2px solid ${T.ocean}` : 'none', flexShrink: 0,
                }}>{status === 'done' ? '✓' : i + 1}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: sansT, fontSize: 12.5, fontWeight: status === 'active' ? 600 : 500, color: status === 'todo' ? T.ink3 : T.ink, whiteSpace: 'nowrap' }}>{name}</div>
                  <div style={{ fontFamily: sansT, fontSize: 10, color: T.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {status === 'done' ? sub : status === 'active' ? 'In progress' : 'Pending'}
                  </div>
                </div>
              </div>
              {i < ONBOARD_STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: status === 'done' ? T.ocean : T.border, margin: '0 8px' }} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const SumRow2 = ({ label, value, mono, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ color: T.ink3 }}>{label}</span>
    <span style={{ fontFamily: mono ? monoT : sansT, fontWeight: 600, color: accent ? T.ocean : T.ink, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
  </div>
);

function Summary({ current }) {
  return (
    <Card eyebrow="Onboarding Summary">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: sansT, fontSize: 12.5 }}>
        <SumRow2 label="Client" value="Memorial Hermann" />
        <SumRow2 label="Vertical" value={<VerticalChip vertical="Healthcare" />} />
        <SumRow2 label="Sites" value="23" mono />
        <SumRow2 label="Buildings" value="184" mono />
        {current >= 4 && <SumRow2 label="Equip. selected" value="178 / 184" mono accent />}
        {current >= 5 && <SumRow2 label="Programs" value="4" mono />}
        <SumRow2 label="Est. peak" value="61.8 MW" mono />
        {current >= 4 && <SumRow2 label="Est. Avail. MW" value="14.2 MW" mono accent />}
        {current >= 5 && <SumRow2 label="Est. annual rev." value="$1.84M" mono accent />}
      </div>
    </Card>
  );
}

const FieldR = ({ label, value, full, suffix }) => (
  <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
    <div style={{ fontFamily: sansT, fontSize: 10.5, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
    <div style={{ padding: '8px 10px', border: `1px solid ${T.border2}`, borderRadius: 4, background: T.paper, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: sansT, fontSize: 13, color: T.ink, fontWeight: 500 }}>{value}</span>
      {suffix && <span style={{ fontSize: 11, color: T.ink3, fontFamily: monoT }}>{suffix}</span>}
    </div>
  </div>
);

// ─── Step 1: Client info ─────────────────────────────────────
function StepClient() {
  return (
    <Card title="Client information" eyebrow="Step 1 · Identify the client" action={<Btn size="sm">Lookup in eWay</Btn>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FieldR label="Legal name" value="Memorial Hermann Health System" full />
        <FieldR label="Doing business as" value="Memorial Hermann" />
        <FieldR label="Tax ID (EIN)" value="74-1XXXXXXX" />
        <FieldR label="Headquarters" value="929 Gessner Rd, Houston, TX 77024" full />
        <FieldR label="Account owner" value="S. Reyes" />
        <FieldR label="Sales stage" value="Closed-won" />
        <FieldR label="MSA effective" value="Aug 12, 2025" />
        <FieldR label="MSA expires" value="Aug 11, 2030" />
      </div>
      <div style={{ marginTop: 16, padding: 12, background: T.icedSoft, borderRadius: 4, fontSize: 12, color: T.ocean, fontFamily: sansT, display: 'flex', alignItems: 'center', gap: 10 }}>
        <SIcon kind="bolt" size={14} color={T.ocean} />
        Pulled from eWay record EWY-441299 · last synced 1 min ago
        <span style={{ marginLeft: 'auto', fontWeight: 600 }}>Re-sync</span>
      </div>
    </Card>
  );
}

// ─── Step 2: Vertical & contacts ─────────────────────────────
function StepContacts() {
  return (
    <>
      <Card eyebrow="Step 2 · Classify & assign" title="Vertical & internal team">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {[['Federal', false], ['Healthcare', true], ['Higher Ed', false], ['Municipal', false]].map(([v, sel]) => (
            <div key={v} style={{
              padding: '12px 10px', borderRadius: 6, textAlign: 'center',
              background: sel ? T.lime : T.paper,
              border: `1.5px solid ${sel ? T.ocean : T.border2}`,
              fontFamily: sansT, fontSize: 13, fontWeight: 600, color: T.ocean, cursor: 'pointer',
            }}>{v}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldR label="Account exec" value="S. Reyes" />
          <FieldR label="Project asset mgr" value="J. Tran" />
          <FieldR label="Lead engineer" value="A. Kowalski" />
          <FieldR label="Demand mgmt lead" value="M. Park" />
        </div>
      </Card>

      <Card eyebrow="Client contacts · 4" action={<Btn size="sm" icon="plus">Add contact</Btn>} padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1.4fr 1fr 0.5fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
          {['Name', 'Role', 'Email', 'Primary?', ''].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
        </div>
        {[
          ['Dr. Devesh Patel', 'VP Facilities', 'dpatel@memorialhermann.org', true],
          ['Karen Williams',   'Energy Manager','kwilliams@memorialhermann.org', false],
          ['Marco Diaz',       'CFO Office',    'mdiaz@memorialhermann.org', false],
          ['Eve Chen',         'Sustainability','echen@memorialhermann.org', false],
        ].map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1.4fr 1fr 0.5fr', padding: '11px 14px', borderBottom: i < 3 ? `1px solid ${T.borderSoft}` : 'none', alignItems: 'center', fontSize: 12.5, fontFamily: sansT }}>
            <span style={{ fontWeight: 600, color: T.ink }}>{r[0]}</span>
            <span style={{ color: T.ink2 }}>{r[1]}</span>
            <span style={{ color: T.ink3, fontFamily: monoT, fontSize: 11 }}>{r[2]}</span>
            <span>{r[3] && <StatusPill kind="accent">Primary</StatusPill>}</span>
            <span style={{ color: T.ink3, textAlign: 'right', fontSize: 14 }}>⋯</span>
          </div>
        ))}
      </Card>
    </>
  );
}

// ─── Step 3: Sites ───────────────────────────────────────────
function StepSites() {
  const sites = [
    ['TMC Main',          'Houston, TX', 'ERCOT (CenterPoint)','12', '184k', '18.4 MW', 'auto'],
    ['Memorial SW',       'Houston, TX', 'ERCOT (CenterPoint)','5',  '92k',  '8.1 MW',  'auto'],
    ['Memorial SE',       'Pearland, TX','ERCOT (CenterPoint)','4',  '74k',  '6.4 MW',  'auto'],
    ['Memorial Katy',     'Katy, TX',    'ERCOT (CenterPoint)','3',  '48k',  '3.9 MW',  'auto'],
    ['The Woodlands',     'Spring, TX',  'ERCOT (Entergy)',     '6',  '108k', '9.2 MW',  'auto'],
    ['Cypress',           'Cypress, TX', 'ERCOT (CenterPoint)','3',  '42k',  '3.6 MW',  'review'],
    ['+ 17 more sites',   '—',           '—',                   '23', '347k','12.2 MW', 'auto'],
  ];
  return (
    <>
      <Card eyebrow="Step 3 · Map sites & service territories" title="Sites discovered" action={
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn size="sm">Map view</Btn>
          <Btn size="sm" icon="plus">Add site</Btn>
        </div>
      } padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.1fr 1.4fr 0.6fr 0.7fr 0.8fr 0.7fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
          {['Site', 'City', 'ISO / Utility', 'Bldgs', 'Sq Ft', 'Est. peak', 'Match'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
        </div>
        {sites.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.1fr 1.4fr 0.6fr 0.7fr 0.8fr 0.7fr', padding: '11px 14px', borderBottom: i < sites.length - 1 ? `1px solid ${T.borderSoft}` : 'none', alignItems: 'center', fontSize: 12.5, fontFamily: sansT, fontStyle: i === 6 ? 'italic' : 'normal', color: i === 6 ? T.ink3 : 'inherit' }}>
            <span style={{ fontWeight: i === 6 ? 500 : 600, color: i === 6 ? T.ink3 : T.ink }}>{r[0]}</span>
            <span style={{ color: T.ink2 }}>{r[1]}</span>
            <span style={{ color: T.ink3 }}>{r[2]}</span>
            <Num size={12.5}>{r[3]}</Num>
            <span style={{ fontFamily: monoT, color: T.ink2 }}>{r[4]}</span>
            <Num size={12.5}>{r[5]}</Num>
            <StatusPill kind={r[6] === 'auto' ? 'ok' : 'warn'}>{r[6] === 'auto' ? 'Auto' : 'Review'}</StatusPill>
          </div>
        ))}
      </Card>
    </>
  );
}

// ─── Step 4: Equipment import (existing logic) ──────────────
function StepEquipment() {
  return (
    <>
      <Card title="Equipment Import" eyebrow="Step 4 · Bring in distributed energy resources" action={<Btn size="sm">Skip step</Btn>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['eWay Sync',     "Pull equipment from Memorial Hermann's eWay tenant", '184 found', T.lime, 'recommended'],
            ['SkySpark',      'Import points & equip from SkySpark project',        '142 found', T.iced, 'available'],
            ['CSV Upload',    'Bulk upload from a spreadsheet template',             null,        T.paper, 'available'],
            ['Manual entry',  'Add equipment one at a time',                          null,        T.paper, 'available'],
          ].map(([title, desc, count, bg, badge], i) => (
            <div key={i} style={{
              padding: 14, borderRadius: 6,
              background: bg, border: `1px solid ${i === 0 ? T.ocean : T.border2}`,
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontFamily: sansT, fontSize: 13.5, fontWeight: 600, color: T.ink }}>{title}</div>
                {badge === 'recommended' && <StatusPill kind="accent">Recommended</StatusPill>}
              </div>
              <div style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3, lineHeight: 1.4 }}>{desc}</div>
              {count && <div style={{ marginTop: 8, fontFamily: monoT, fontSize: 11, color: T.ocean, fontWeight: 600 }}>{count} matches detected</div>}
            </div>
          ))}
        </div>
      </Card>

      <Card eyebrow="eWay Preview · 184 records · select what to import" action={<Btn size="sm">Configure column mapping</Btn>} padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.4fr 0.5fr 0.7fr 1.4fr 1.2fr 0.6fr 0.5fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
          <span><input type="checkbox" defaultChecked readOnly /></span>
          {['Tag', 'Type', 'Make/Model', 'Site', 'kW', 'Map'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
        </div>
        {[
          ['BESS-MH-01','BESS',  'Tesla Megapack 2XL','TMC Main · Yard',  '1900', 'auto'],
          ['BESS-MH-02','BESS',  'Tesla Megapack 2XL','TMC Main · Yard',  '1900', 'auto'],
          ['CH-MH-04',  'Chiller','Trane CVHF-1500',  'Memorial SW · MEP-1','850', 'auto'],
          ['GEN-MH-01', 'Genset', 'Cummins QSK60-G6', 'TMC Main · Bldg D',   '2000','review'],
          ['AHU-MH-12', 'AHU',    'York YK 30K',      'Memorial SE · L4',    '120', 'auto'],
        ].map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '0.4fr 0.5fr 0.7fr 1.4fr 1.2fr 0.6fr 0.5fr', padding: '10px 14px', borderBottom: i < 4 ? `1px solid ${T.borderSoft}` : 'none', alignItems: 'center', fontSize: 12.5, fontFamily: sansT }}>
            <span><input type="checkbox" defaultChecked readOnly /></span>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.ocean }}>{r[0]}</span>
            <span style={{ color: T.ink2 }}>{r[1]}</span>
            <span>{r[2]}</span>
            <span style={{ color: T.ink3 }}>{r[3]}</span>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.ocean }}>{r[4]}</span>
            <StatusPill kind={r[5] === 'auto' ? 'ok' : 'warn'}>{r[5] === 'auto' ? 'Auto' : 'Review'}</StatusPill>
          </div>
        ))}
        <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11.5, color: T.ink3, fontFamily: sansT }}>Showing 5 of 184 · 178 auto-matched · 6 need review</span>
          <span style={{ fontSize: 11.5, color: T.steel, fontFamily: sansT, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>View all 184 →</span>
        </div>
      </Card>
    </>
  );
}

// ─── Step 5: Programs ────────────────────────────────────────
function StepPrograms() {
  const progs = [
    ['ERCOT 4CP',     'Day-ahead capacity', 'TX · ERCOT', '$112/kW-yr', '11.4 MW', '$1.28M/yr', true],
    ['ERCOT ECRS',    'Ancillary · 10-min', 'TX · ERCOT', '$48/kW-yr',  '3.8 MW',  '$182k/yr',  true],
    ['CenterPoint LM','Utility load mgmt',  'TX · CNP',   '$14/kW-yr',  '6.2 MW',  '$87k/yr',   true],
    ['Entergy CRS',   'Utility curtailment','TX · ETI',   '$22/kW-yr',  '2.4 MW',  '$53k/yr',   true],
    ['ERCOT ERS',     'Emergency reserve',  'TX · ERCOT', '$28/kW-yr',  '—',       '—',         false],
    ['ERCOT NSRS',    'Non-spin reserve',   'TX · ERCOT', '$36/kW-yr',  '—',       '—',         false],
  ];
  return (
    <>
      <Card eyebrow="Step 5 · Match assets to programs" title="Recommended program stack" action={<Btn size="sm">Re-evaluate</Btn>} padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr 0.9fr 0.7fr 0.9fr 0.7fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
          {['Program', 'Type', 'Region', 'Price', 'MW', 'Annual', 'Enroll'].map(h => <Eyebrow key={h}>{h}</Eyebrow>)}
        </div>
        {progs.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr 0.9fr 0.7fr 0.9fr 0.7fr', padding: '11px 14px', borderBottom: i < progs.length - 1 ? `1px solid ${T.borderSoft}` : 'none', alignItems: 'center', fontSize: 12.5, fontFamily: sansT, opacity: r[6] ? 1 : 0.55 }}>
            <span style={{ fontWeight: 600, color: T.ink }}>{r[0]}</span>
            <span style={{ color: T.ink2 }}>{r[1]}</span>
            <span style={{ color: T.ink3 }}>{r[2]}</span>
            <span style={{ fontFamily: monoT, color: T.ocean, fontWeight: 600 }}>{r[3]}</span>
            <Num size={12.5}>{r[4]}</Num>
            <span style={{ fontFamily: monoT, color: T.ocean, fontWeight: 600 }}>{r[5]}</span>
            <div>
              <div style={{ position: 'relative', width: 36, height: 20, borderRadius: 999, background: r[6] ? T.ocean : T.borderSoft, transition: 'background 120ms' }}>
                <div style={{ position: 'absolute', top: 2, left: r[6] ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff' }} />
              </div>
            </div>
          </div>
        ))}
        <div style={{ padding: '12px 14px', background: T.icedSoft, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: sansT }}>
          <span style={{ color: T.ocean, fontWeight: 600 }}>Stacked annual revenue · 4 programs</span>
          <span style={{ fontFamily: monoT, fontWeight: 700, fontSize: 16, color: T.ocean }}>$1.84M / yr</span>
        </div>
      </Card>
      <Card eyebrow="Stacking analysis">
        <div style={{ fontFamily: sansT, fontSize: 12.5, color: T.ink2, lineHeight: 1.55 }}>
          <p style={{ margin: '0 0 8px' }}>4 programs can stack on the same MW without conflict; 4CP (capacity) + ECRS (ancillary) are compatible. CenterPoint LM and Entergy CRS apply to non-overlapping utility territories.</p>
          <p style={{ margin: 0 }}>ERS and NSRS were evaluated and excluded — duty cycle conflicts with 4CP for the BESS fleet. <span style={{ color: T.steel, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>See conflict matrix →</span></p>
        </div>
      </Card>
    </>
  );
}

// ─── Step 6: Financials & sign-off ───────────────────────────
function StepFinancials() {
  return (
    <>
      <Card eyebrow="Step 6 · Revenue split & invoicing" title="Financial terms">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldR label="Revenue split (ENFRA / client)" value="20 / 80" />
          <FieldR label="Performance guarantee" value="93% floor" />
          <FieldR label="Invoicing cadence" value="Quarterly · NET 30" />
          <FieldR label="Currency" value="USD" />
          <FieldR label="Settlement timing" value="T+45 days" />
          <FieldR label="True-up frequency" value="Annual" />
          <FieldR label="Bank account on file" value="Wells Fargo · ••3914" full />
        </div>
      </Card>
      <Card eyebrow="Pro-forma · Year 1">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <Stat l="Gross revenue" v="$1.84M" />
          <Stat l="ENFRA share" v="$368k" accent />
          <Stat l="Client share" v="$1.47M" />
          <Stat l="Payback" v="3.2 yr" />
        </div>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.borderSoft}`, fontSize: 11.5, color: T.ink3, fontFamily: sansT }}>
          Assumes 96% performance · 4 programs · 14.2 MW available · 178 enrolled assets
        </div>
      </Card>
      <Card eyebrow="Sign-off" title="Send for client signature">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ width: 48, height: 60, background: T.icedSoft, border: `1px solid ${T.border2}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: monoT, fontSize: 9, color: T.ocean, fontWeight: 700 }}>PDF</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: sansT, fontSize: 13.5, fontWeight: 600, color: T.ink }}>Memorial Hermann · DR Services Agreement</div>
            <div style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3, marginTop: 2 }}>Generated 4 min ago · 24 pages · DocuSign envelope ready</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <Btn size="sm">Preview</Btn>
              <Btn size="sm" kind="primary">Send via DocuSign →</Btn>
            </div>
          </div>
          <StatusPill kind="warn">Awaiting send</StatusPill>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: sansT, fontSize: 12 }}>
          <SignRow name="Dr. Devesh Patel"  role="VP Facilities · Memorial Hermann" status="Pending"   />
          <SignRow name="Marco Diaz"         role="CFO Office · Memorial Hermann"   status="Pending"   />
          <SignRow name="S. Reyes"           role="Account Exec · ENFRA"            status="Auto-sign" />
        </div>
      </Card>
    </>
  );
}

const Stat = ({ l, v, accent }) => (
  <div>
    <Eyebrow>{l}</Eyebrow>
    <div style={{ marginTop: 4 }}><Num size={20} color={accent ? T.ocean : T.ink}>{v}</Num></div>
  </div>
);

const SignRow = ({ name, role, status }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: T.bgAlt, borderRadius: 4 }}>
    <div style={{ width: 28, height: 28, borderRadius: 999, background: T.steel, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{name.split(' ').map(s => s[0]).slice(0, 2).join('')}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, color: T.ink }}>{name}</div>
      <div style={{ color: T.ink3, fontSize: 11 }}>{role}</div>
    </div>
    <StatusPill kind={status === 'Auto-sign' ? 'ok' : 'warn'}>{status}</StatusPill>
  </div>
);

// ─── Footer (continue / back) ────────────────────────────────
function StepFooter({ current }) {
  const labels = {
    1: ['Save & Exit', 'Continue → Vertical & contacts'],
    2: ['← Back to Client info', 'Continue → Sites'],
    3: ['← Back to Contacts', 'Continue → Equipment import'],
    4: ['← Back to Sites', 'Import 178 → Continue to Programs'],
    5: ['← Back to Equipment', 'Continue → Financials & sign-off'],
    6: ['← Back to Programs', 'Send to client for signature →'],
  };
  return (
    <div style={{ padding: '14px 24px', background: T.paper, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0 }}>
      <span style={{ fontSize: 11.5, color: T.ink3, fontFamily: sansT }}>Auto-saved · {current} of 6 steps {current === 6 ? 'ready' : 'complete'}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn>{labels[current][0]}</Btn>
        <Btn kind="primary">{labels[current][1]}</Btn>
      </div>
    </div>
  );
}

// ─── Public component ───────────────────────────────────────
function MidFiOnboardingWizard({ eventBanner, step = 4 }) {
  const stepBody =
    step === 1 ? <StepClient /> :
    step === 2 ? <StepContacts /> :
    step === 3 ? <StepSites /> :
    step === 4 ? <StepEquipment /> :
    step === 5 ? <StepPrograms /> :
                 <StepFinancials />;
  const titleSub = {
    1: 'Started Aug 12 by S. Reyes · just now',
    2: 'Started Aug 12 by S. Reyes · 1 min ago',
    3: '23 sites scoped · 184 buildings',
    4: '23 sites scoped · 184 buildings · ~62 MW estimated peak',
    5: '178 assets imported · 14.2 MW available · 4 programs evaluated',
    6: '4 programs locked · $1.84M annual gross · ready for signature',
  }[step];
  return (
    <MfFrame label={`Onboarding · Step ${step} of 6`} w={1280} h={820} scale={0.5}>
      <MfHeader eventActive={eventBanner} breadcrumb={['Clients', 'Onboard new']} />
      <MfEventBanner on={eventBanner} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <MfSidebar active="clients" />
        <div style={{ flex: 1, overflow: 'auto', background: T.bg, display: 'flex', flexDirection: 'column' }}>
          <MfTitleStrip
            eyebrow={`New Client · Step ${step} of 6`}
            title="Onboard: Memorial Hermann"
            sub={titleSub}
            actions={<><Btn>Save & Exit</Btn><Btn kind="primary">Resume Later</Btn></>}
          />
          <Stepper current={step} />
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{stepBody}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Summary current={step} />
              <Card eyebrow="Next steps">
                <ul style={{ margin: 0, paddingLeft: 16, fontFamily: sansT, fontSize: 12, color: T.ink2, lineHeight: 1.7 }}>
                  {ONBOARD_STEPS.slice(step).map(([s], i) => (
                    <li key={i}>{s}</li>
                  ))}
                  {step === 6 && <li style={{ color: T.ok, fontWeight: 600 }}>Done — go-live readiness check</li>}
                </ul>
              </Card>
            </div>
          </div>
          <StepFooter current={step} />
        </div>
      </div>
    </MfFrame>
  );
}

Object.assign(window, { MidFiOnboardingWizard });
