// EDC demo · Right-side drawer for enrollment (4 steps) and onboarding (6 steps)

function Drawer() {
  const { drawer, setDrawer } = useApp();
  if (!drawer) return null;
  return (
    <>
      <div onClick={() => setDrawer(null)} style={{
        position: 'fixed', inset: 0, background: 'rgba(9,43,36,0.45)', zIndex: 100, animation: 'edcFadeIn 180ms',
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 540, background: T.paper,
        boxShadow: '-12px 0 32px rgba(0,0,0,0.18)', zIndex: 101, display: 'flex', flexDirection: 'column',
        animation: 'edcSlideR 240ms cubic-bezier(.2,.8,.2,1)', overflow: 'hidden',
      }}>
        {drawer.kind === 'enrollment' ? <EnrollmentDrawer /> : <OnboardingDrawer />}
      </div>
    </>
  );
}

function EnrollmentDrawer() {
  const { drawer, setDrawer, submitEnrollment, navigate } = useApp();
  const e = getEquipment(drawer.equipmentId);
  const s = e ? getSite(e.siteId) : null;
  const c = s ? getClient(s.clientId) : null;
  const [step, setStep] = useState(0);
  const [programId, setProgramId] = useState(null);
  const [nomKw, setNomKw] = useState(e ? e.kw : 0);
  const [autoDispatch, setAutoDispatch] = useState(true);

  if (!e) return null;
  const eligible = PROGRAMS.filter(p => p.iso === s.iso || (s.utility === 'CenterPoint' && p.iso === 'CenterPoint'));
  const p = getProgram(programId);
  const annual = p ? nomKw * p.rate : 0;
  const STEPS = ['Equipment', 'Program', 'Capacity & dispatch', 'Review & sign'];

  return (
    <>
      <DrawerHeader
        eyebrow={`Enroll · ${c?.short || ''}`}
        title={`${e.id} · ${e.make} ${e.model}`}
        sub={`${s.name} · ${e.kw.toLocaleString()} kW nameplate`}
        onClose={() => setDrawer(null)}
      />
      <Stepper steps={STEPS} active={step} onJump={i => i <= step && setStep(i)} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        {step === 0 && (
          <div>
            <SectionTitle>Equipment confirmed</SectionTitle>
            <Card padding={14}>
              <KV k="Asset tag" v={<span style={{ fontFamily: monoT }}>{e.id}</span>} />
              <KV k="Type" v={e.type} />
              <KV k="Make / Model" v={`${e.make} ${e.model}`} />
              <KV k="Nameplate" v={`${e.kw.toLocaleString()} kW${e.kwh ? ` / ${e.kwh.toLocaleString()} kWh` : ''}`} />
              <KV k="Site" v={s.name} />
              <KV k="ISO" v={s.iso} />
            </Card>
            <Note>This equipment is eligible for {eligible.length} programs in this ISO. Click <b>Next</b> to choose one.</Note>
          </div>
        )}
        {step === 1 && (
          <div>
            <SectionTitle>Choose program</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {eligible.map(prog => (
                <div key={prog.id} onClick={() => setProgramId(prog.id)} style={{
                  padding: 12, border: `1.5px solid ${programId === prog.id ? T.accent : T.border}`, borderRadius: 6,
                  background: programId === prog.id ? T.icedSoft : T.paper, cursor: 'pointer', fontFamily: sansT,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{prog.iso} {prog.name}</span>
                    <span style={{ fontFamily: monoT, fontSize: 13, color: T.accent, fontWeight: 700 }}>${prog.rate} {prog.unit}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.ink3, marginTop: 4 }}>{prog.desc}</div>
                  {programId === prog.id && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}`, fontSize: 11.5, color: T.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon kind="check" size={12} color={T.accent} /> Estimated annual revenue: {fmt$(e.kw * prog.rate)} (client share {fmt$(e.kw * prog.rate * 0.7)})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <SectionTitle>Capacity & dispatch</SectionTitle>
            <Field label="Nominated capacity (kW)" hint={`Max ${e.kw.toLocaleString()} kW (nameplate). Lower = lower performance risk.`}>
              <input type="range" min={Math.round(e.kw * 0.4)} max={e.kw} step={50} value={nomKw} onChange={ev => setNomKw(parseInt(ev.target.value))} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: monoT, fontSize: 12, color: T.ink3, marginTop: 4 }}>
                <span>{Math.round(e.kw * 0.4).toLocaleString()} kW</span>
                <span style={{ fontWeight: 700, color: T.accent }}>{nomKw.toLocaleString()} kW</span>
                <span>{e.kw.toLocaleString()} kW</span>
              </div>
            </Field>
            <Field label="Dispatch mode" hint="Auto-dispatch lets ENFRA respond to ISO signals within the agreed envelope.">
              <Toggle on={autoDispatch} onChange={setAutoDispatch} labelOn="Auto-dispatch (recommended)" labelOff="Manual approval per event" />
            </Field>
            {p && (
              <Card style={{ marginTop: 16, background: T.bgAlt, border: `1px solid ${T.border}` }} padding={14}>
                <Eyebrow>Estimated revenue · {p.iso} {p.name}</Eyebrow>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                  <span style={{ fontFamily: sansT, fontSize: 12, color: T.ink3 }}>Annual revenue</span>
                  <Num size={20}>{fmt$(annual)}</Num>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontFamily: sansT, fontSize: 12, color: T.ink3 }}>Client share (70%)</span>
                  <Num size={16} color={T.steel}>{fmt$(annual * 0.7)}</Num>
                </div>
              </Card>
            )}
          </div>
        )}
        {step === 3 && p && (
          <div>
            <SectionTitle>Review & sign</SectionTitle>
            <Card padding={14}>
              <KV k="Equipment" v={`${e.id} · ${e.make} ${e.model}`} />
              <KV k="Program" v={`${p.iso} ${p.name}`} />
              <KV k="Nominated kW" v={<span style={{ fontFamily: monoT }}>{nomKw.toLocaleString()}</span>} />
              <KV k="Dispatch" v={autoDispatch ? 'Auto' : 'Manual'} />
              <KV k="Annual rev. (est.)" v={<span style={{ fontFamily: monoT, color: T.accent, fontWeight: 700 }}>{fmt$(annual)}</span>} />
              <KV k="Client share" v={<span style={{ fontFamily: monoT, fontWeight: 700 }}>{fmt$(annual * 0.7)}</span>} />
              <KV k="ENFRA share" v={<span style={{ fontFamily: monoT }}>{fmt$(annual * 0.20)}</span>} />
              <KV k="CPower share" v={<span style={{ fontFamily: monoT }}>{fmt$(annual * 0.10)}</span>} />
            </Card>
            <Note>Clicking <b>Submit & DocuSign</b> generates the program addendum and emails it to {c.contact.name} for signature.</Note>
          </div>
        )}
      </div>

      <DrawerFooter
        primaryLabel={step < 3 ? 'Next →' : 'Submit & DocuSign'}
        primaryDisabled={(step === 1 && !programId)}
        onPrimary={() => {
          if (step < 3) setStep(step + 1);
          else {
            submitEnrollment({ equipmentId: e.id, programId, programName: `${p.iso} ${p.name}`, nomKw, autoDispatch });
            navigate('equipment', { equipmentId: e.id });
          }
        }}
        secondaryLabel={step > 0 ? '← Back' : 'Cancel'}
        onSecondary={() => step > 0 ? setStep(step - 1) : setDrawer(null)}
      />
    </>
  );
}

function OnboardingDrawer() {
  const { setDrawer, submitOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', short: '', vertical: 'Healthcare', region: 'TX', primaryISO: 'ERCOT',
    contactName: '', contactTitle: 'Energy Director', contactEmail: '', contactPhone: '',
    siteCount: 1, msaTemplate: 'Standard MSA · 70/20/10', wpaSent: false,
  });
  const STEPS = ['Client', 'Vertical & ISO', 'Primary contact', 'Sites', 'MSA & WPA', 'Done'];

  const upd = (k, v) => setData(d => ({ ...d, [k]: v }));

  return (
    <>
      <DrawerHeader
        eyebrow="New client"
        title="Onboarding wizard"
        sub="6 steps · DocuSign at the end"
        onClose={() => setDrawer(null)}
      />
      <Stepper steps={STEPS} active={step} onJump={i => i <= step && setStep(i)} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        {step === 0 && (
          <div>
            <SectionTitle>Client basics</SectionTitle>
            <Field label="Legal name"><Input value={data.name} onChange={v => upd('name', v)} placeholder="e.g. HCA Healthcare" /></Field>
            <Field label="Short label" hint="Shows in nav and breadcrumbs"><Input value={data.short} onChange={v => upd('short', v)} placeholder="e.g. HCA" /></Field>
          </div>
        )}
        {step === 1 && (
          <div>
            <SectionTitle>Vertical & primary ISO</SectionTitle>
            <Field label="Vertical">
              <Radio options={['Healthcare', 'Higher Ed', 'Federal', 'Municipal']} value={data.vertical} onChange={v => upd('vertical', v)} />
            </Field>
            <Field label="HQ region">
              <Radio options={['TX', 'CA', 'IL', 'NY', 'MA']} value={data.region} onChange={v => upd('region', v)} />
            </Field>
            <Field label="Primary ISO">
              <Radio options={['ERCOT', 'CAISO', 'PJM', 'NYISO', 'ISO-NE']} value={data.primaryISO} onChange={v => upd('primaryISO', v)} />
            </Field>
          </div>
        )}
        {step === 2 && (
          <div>
            <SectionTitle>Primary contact</SectionTitle>
            <Field label="Name"><Input value={data.contactName} onChange={v => upd('contactName', v)} placeholder="Full name" /></Field>
            <Field label="Title"><Input value={data.contactTitle} onChange={v => upd('contactTitle', v)} /></Field>
            <Field label="Email"><Input value={data.contactEmail} onChange={v => upd('contactEmail', v)} placeholder="email@org.com" /></Field>
            <Field label="Phone"><Input value={data.contactPhone} onChange={v => upd('contactPhone', v)} placeholder="+1 555-555-5555" /></Field>
          </div>
        )}
        {step === 3 && (
          <div>
            <SectionTitle>Sites</SectionTitle>
            <Field label="Number of sites" hint="You'll add per-site details after onboarding.">
              <input type="range" min={1} max={30} value={data.siteCount} onChange={e => upd('siteCount', parseInt(e.target.value))} style={{ width: '100%' }} />
              <div style={{ textAlign: 'center', marginTop: 6 }}><Num size={28}>{data.siteCount}</Num><span style={{ fontFamily: sansT, fontSize: 12, color: T.ink3, marginLeft: 6 }}>sites</span></div>
            </Field>
            <Note>We'll generate site stubs you can fill in (utility, ESI-ID, peak demand, equipment).</Note>
          </div>
        )}
        {step === 4 && (
          <div>
            <SectionTitle>Master Service Agreement</SectionTitle>
            <Field label="MSA template">
              <Radio options={['Standard MSA · 70/20/10', 'Federal MSA (FAR-aligned) · 65/25/10', 'Municipal MSA · 75/15/10']} value={data.msaTemplate} onChange={v => upd('msaTemplate', v)} />
            </Field>
            <SectionTitle>Webhook & API access</SectionTitle>
            <Field label="">
              <Toggle on={data.wpaSent} onChange={v => upd('wpaSent', v)} labelOn="Send Webhook Provisioning Agreement" labelOff="Skip API access for now" />
            </Field>
          </div>
        )}
        {step === 5 && (
          <div>
            <SectionTitle>Ready to submit</SectionTitle>
            <Card padding={14}>
              <KV k="Client" v={data.name || '—'} />
              <KV k="Short" v={data.short || '—'} />
              <KV k="Vertical" v={data.vertical} />
              <KV k="Region · ISO" v={`${data.region} · ${data.primaryISO}`} />
              <KV k="Contact" v={`${data.contactName || '—'} · ${data.contactTitle}`} />
              <KV k="Sites planned" v={data.siteCount} />
              <KV k="MSA" v={data.msaTemplate} />
              <KV k="WPA" v={data.wpaSent ? 'Send' : 'Skip'} />
            </Card>
            <Note>Submitting will: create the client record, stub {data.siteCount} sites, email <b>{data.contactName || 'the primary contact'}</b> a DocuSign envelope for the MSA{data.wpaSent ? ', and provision API/webhook credentials' : ''}.</Note>
          </div>
        )}
      </div>
      <DrawerFooter
        primaryLabel={step < 5 ? 'Next →' : 'Submit & send DocuSign'}
        primaryDisabled={(step === 0 && !data.name) || (step === 2 && !data.contactName)}
        onPrimary={() => {
          if (step < 5) setStep(step + 1);
          else submitOnboarding({
            name: data.name, short: data.short || data.name.slice(0, 8),
            vertical: data.vertical, region: data.region, primaryISO: data.primaryISO,
            contact: { name: data.contactName, title: data.contactTitle, email: data.contactEmail, phone: data.contactPhone },
            siteCount: data.siteCount, notes: 'Onboarded via wizard.',
          });
        }}
        secondaryLabel={step > 0 ? '← Back' : 'Cancel'}
        onSecondary={() => step > 0 ? setStep(step - 1) : setDrawer(null)}
      />
    </>
  );
}

// ─── Drawer atoms ─────────────────────────────────────────────
function DrawerHeader({ eyebrow, title, sub, onClose }) {
  return (
    <div style={{ padding: '16px 24px 14px', borderBottom: `1px solid ${T.border}`, background: T.paper, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 style={{ margin: '4px 0 4px', fontFamily: sansT, fontSize: 18, fontWeight: 700, color: T.ink }}>{title}</h2>
          <div style={{ fontSize: 12, color: T.ink3 }}>{sub}</div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: T.ink3 }}>
          <Icon kind="x" size={18} />
        </button>
      </div>
    </div>
  );
}

function DrawerFooter({ primaryLabel, onPrimary, secondaryLabel, onSecondary, primaryDisabled }) {
  return (
    <div style={{ padding: '14px 24px', borderTop: `1px solid ${T.border}`, background: T.paper, display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
      <Btn onClick={onSecondary}>{secondaryLabel}</Btn>
      <Btn kind="primary" onClick={onPrimary} disabled={primaryDisabled}>{primaryLabel}</Btn>
    </div>
  );
}

function Stepper({ steps, active, onJump }) {
  return (
    <div style={{ display: 'flex', padding: '12px 24px', borderBottom: `1px solid ${T.border}`, background: T.bgAlt, gap: 8, flexShrink: 0 }}>
      {steps.map((s, i) => (
        <div key={i} onClick={() => onJump(i)} style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8, cursor: i <= active ? 'pointer' : 'default',
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 999, fontFamily: sansT, fontSize: 11, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: i < active ? T.accent : (i === active ? T.lime : T.borderSoft),
            color: i < active ? '#fff' : T.accent,
            border: i === active ? `1.5px solid ${T.accent}` : 'none',
          }}>{i < active ? '✓' : i + 1}</span>
          <span style={{ fontSize: 11.5, fontWeight: i === active ? 700 : 500, color: i <= active ? T.accent : T.ink3, fontFamily: sansT }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

const SectionTitle = ({ children }) => (
  <div style={{ fontFamily: sansT, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.accent, marginBottom: 12 }}>{children}</div>
);
const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <div style={{ fontFamily: sansT, fontSize: 12, fontWeight: 600, color: T.ink2, marginBottom: 6 }}>{label}</div>}
    {children}
    {hint && <div style={{ fontSize: 11, color: T.ink3, marginTop: 5, fontFamily: sansT }}>{hint}</div>}
  </div>
);
const Note = ({ children }) => (
  <div style={{ marginTop: 16, padding: 12, background: T.icedSoft, border: `1px solid ${T.border}`, borderRadius: 6, fontFamily: sansT, fontSize: 12.5, color: T.ink2, lineHeight: 1.5 }}>{children}</div>
);
const Input = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
    width: '100%', padding: '8px 10px', border: `1px solid ${T.border2}`, borderRadius: 4,
    fontFamily: sansT, fontSize: 13, color: T.ink, outline: 'none',
  }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border2} />
);
const Radio = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {options.map(o => (
      <button key={o} onClick={() => onChange(o)} style={{
        padding: '6px 12px', borderRadius: 4,
        border: `1.5px solid ${value === o ? T.accent : T.border2}`,
        background: value === o ? T.icedSoft : T.paper,
        color: value === o ? T.accent : T.ink2,
        fontFamily: sansT, fontSize: 12.5, fontWeight: value === o ? 700 : 500, cursor: 'pointer',
      }}>{o}</button>
    ))}
  </div>
);
const Toggle = ({ on, onChange, labelOn, labelOff }) => (
  <div onClick={() => onChange(!on)} style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: 10,
    border: `1px solid ${T.border}`, borderRadius: 6, cursor: 'pointer',
    background: on ? T.icedSoft : T.paper,
  }}>
    <span style={{
      width: 36, height: 20, borderRadius: 999, background: on ? T.accent : T.border2,
      position: 'relative', flexShrink: 0, transition: 'background 160ms',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 16, height: 16, borderRadius: 999, background: '#fff',
        transition: 'left 160ms',
      }} />
    </span>
    <span style={{ fontFamily: sansT, fontSize: 13, color: T.ink2, fontWeight: 600 }}>{on ? labelOn : labelOff}</span>
  </div>
);

Object.assign(window, { Drawer, EnrollmentDrawer, OnboardingDrawer });
