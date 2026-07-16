// EDC demo · drilldown pages: ClientsList, Client, Site, Equipment

function ClientsListPage() {
  const { navigate, clients, persona, personaFilteredSiteIds } = useApp();
  const visible = persona === 'pam'
    ? clients.filter(c => sitesForClient(c.id).some(s => personaFilteredSiteIds?.has(s.id)))
    : clients;

  return (
    <div>
      <TitleStrip
        eyebrow="Clients"
        title="Client portfolio"
        sub={`${visible.length} active clients · MSAs in place`}
        actions={<Btn kind="primary" icon="plus" onClick={() => useApp().setDrawer && useApp().setDrawer({ kind: 'onboarding' })}>Onboard client</Btn>}
      />
      <div style={{ padding: 24 }}>
        <Card padding={0}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr 0.7fr 1fr 0.7fr 0.7fr 0.7fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
            <Eyebrow>Client</Eyebrow><Eyebrow>Vertical</Eyebrow><Eyebrow>Region</Eyebrow><Eyebrow>Primary contact</Eyebrow><Eyebrow>Sites</Eyebrow><Eyebrow>Enrolled</Eyebrow><Eyebrow>Annual Rev</Eyebrow>
          </div>
          {visible.map((c, i) => {
            const sites = sitesForClient(c.id);
            const eq = equipmentForClient(c.id);
            const enrolled = eq.filter(e => e.status === 'Enrolled');
            const rev = enrolled.reduce((s, e) => { const p = getProgram(e.programId); return s + (p ? e.kw * p.rate : 0); }, 0);
            return (
              <div key={c.id} onClick={() => navigate('client', { clientId: c.id })} style={{
                display: 'grid', gridTemplateColumns: '1.6fr 0.9fr 0.7fr 1fr 0.7fr 0.7fr 0.7fr', padding: '12px 14px',
                borderBottom: i < visible.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                fontFamily: sansT, fontSize: 13, alignItems: 'center', cursor: 'pointer',
              }} onMouseEnter={e => e.currentTarget.style.background = T.borderSoft} onMouseLeave={e => e.currentTarget.style.background = T.paper}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 4, background: T.iced, color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: sansT }}>{c.short.slice(0, 2).toUpperCase()}</span>
                  <span>
                    <div style={{ fontWeight: 600, color: T.ink }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: T.ink3 }}>{c.notes.slice(0, 60)}…</div>
                  </span>
                </span>
                <span><VerticalChip vertical={c.vertical} /></span>
                <span style={{ fontFamily: monoT, fontSize: 12, color: T.ink2 }}>{c.region} · {c.primaryISO}</span>
                <span style={{ color: T.ink2, fontSize: 12 }}>{c.contact.name}<div style={{ fontSize: 11, color: T.ink3 }}>{c.contact.title}</div></span>
                <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{sites.length}</span>
                <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{enrolled.length}/{eq.length}</span>
                <span style={{ fontFamily: monoT, fontWeight: 700, color: T.accent }}>{fmt$M(rev)}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

function ClientPage() {
  const { route, navigate } = useApp();
  const c = getClient(route.params.clientId);
  if (!c) return <div style={{ padding: 40 }}>Client not found</div>;
  const sites = sitesForClient(c.id);
  const eq = equipmentForClient(c.id);
  const enrolled = eq.filter(e => e.status === 'Enrolled');
  const annualRev = enrolled.reduce((s, e) => { const p = getProgram(e.programId); return s + (p ? e.kw * p.rate : 0); }, 0);

  return (
    <div>
      <TitleStrip
        eyebrow={`Client · ${c.vertical}`}
        title={c.name}
        sub={`${sites.length} sites · ${eq.length} pieces of equipment · primary ISO ${c.primaryISO}`}
        actions={<><Btn icon="list">View MSA</Btn><Btn kind="primary" icon="plus">Add site</Btn></>}
      />
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={0}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <KpiTile label="Sites" value={sites.length} sub="under MSA" accent />
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Equipment" value={eq.length} sub={`${enrolled.length} enrolled`} /></div>
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Enrolled MW" value={(enrolled.reduce((s, e) => s + e.kw, 0) / 1000).toFixed(1)} /></div>
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Est. Annual" value={fmt$M(annualRev * 0.7)} sub="client share" /></div>
            </div>
          </Card>

          <Card title="Sites" eyebrow="Click to drill in" padding={0}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.8fr 0.6fr 0.6fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
              <Eyebrow>Site</Eyebrow><Eyebrow>Location</Eyebrow><Eyebrow>Utility · ISO</Eyebrow><Eyebrow>Peak kW</Eyebrow><Eyebrow>Enrolled</Eyebrow>
            </div>
            {sites.map((s, i) => {
              const sEq = equipmentForSite(s.id);
              const sEn = sEq.filter(e => e.status === 'Enrolled');
              return (
                <div key={s.id} onClick={() => navigate('site', { siteId: s.id })} style={{
                  display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.8fr 0.6fr 0.6fr', padding: '11px 14px',
                  borderBottom: i < sites.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                  fontFamily: sansT, fontSize: 13, alignItems: 'center', cursor: 'pointer',
                }} onMouseEnter={e => e.currentTarget.style.background = T.borderSoft} onMouseLeave={e => e.currentTarget.style.background = T.paper}>
                  <span style={{ fontWeight: 600, color: T.ink }}>{s.name.split('·').slice(-1)[0].trim()}</span>
                  <span style={{ color: T.ink2 }}>{s.city}, {s.state}</span>
                  <span style={{ fontFamily: monoT, fontSize: 12, color: T.ink2 }}>{s.utility} · {s.iso}</span>
                  <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{s.peakKw.toLocaleString()}</span>
                  <span style={{ fontFamily: monoT, color: T.accent, fontWeight: 600 }}>{sEn.length}/{sEq.length}</span>
                </div>
              );
            })}
          </Card>

          <Card title="All equipment" padding={0}>
            <EquipmentTable equipment={eq} showSite />
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Asset manager" eyebrow="ENFRA point of contact">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: T.iced, color: T.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: sansT, fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>{c.assetManager.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: sansT, fontSize: 13.5, fontWeight: 600, color: T.ink }}>{c.assetManager.name}</div>
                <div style={{ fontSize: 11.5, color: T.ink3 }}>{c.assetManager.title}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: T.ink2, fontFamily: monoT }}>{c.assetManager.email}</div>
            <div style={{ fontSize: 12, color: T.ink2, fontFamily: monoT, marginTop: 2 }}>{c.assetManager.phone}</div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.borderSoft}` }}>
              <KV k="Coverage" v={c.assetManager.coverage} />
              <KV k="Managing since" v={c.assetManager.since} />
            </div>
          </Card>
          <Card title="Notes" eyebrow="Internal">
            <div style={{ fontSize: 12.5, color: T.ink2, fontFamily: sansT, lineHeight: 1.5 }}>{c.notes}</div>
          </Card>
          <Card title="Linked tools" eyebrow="External systems">
            <ExternalLink
              label="Demand Management SCADA"
              sub={`Live telemetry \u00b7 ${c.short} \u00b7 ${c.primaryISO}`}
              href={`https://scada.enfra.internal/clients/${c.id}`}
              tone="ocean"
            />
            <div style={{ height: 8 }}></div>
            <ExternalLink
              label="Asset Manager Dashboard"
              sub={`Performance & maintenance \u00b7 ${c.assetManager.name.split(' ')[0]}`}
              href={`https://assets.enfra.internal/clients/${c.id}`}
              tone="lime"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function ExternalLink({ label, sub, href, tone = 'ocean' }) {
  const isLime = tone === 'lime';
  const bg = isLime ? T.lime : T.ocean;
  const fg = isLime ? T.onLime : T.onOcean;
  const hoverBg = isLime ? T.limeHv : T.oceanHv;
  const subColor = isLime ? 'rgba(9,43,36,0.65)' : 'rgba(255,255,255,0.7)';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => { e.preventDefault(); /* demo: stay on page */ }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 8,
        background: bg, color: fg, textDecoration: 'none',
        fontFamily: sansT, transition: 'background 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => e.currentTarget.style.background = hoverBg}
      onMouseLeave={e => e.currentTarget.style.background = bg}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em' }}>{label}</div>
        <div style={{ fontSize: 11, color: subColor, marginTop: 2, fontFamily: monoT }}>{sub}</div>
      </div>
      <Icon kind="arrow-r" size={16} color={fg} />
    </a>
  );
}

function SitePage() {
  const { route, navigate } = useApp();
  const s = getSite(route.params.siteId);
  if (!s) return <div style={{ padding: 40 }}>Site not found</div>;
  const c = getClient(s.clientId);
  const eq = equipmentForSite(s.id);
  const enrolled = eq.filter(e => e.status === 'Enrolled');
  const enrolledMw = enrolled.reduce((sum, e) => sum + e.kw, 0) / 1000;

  return (
    <div>
      <TitleStrip
        eyebrow={`Site · ${c?.short || ''}`}
        title={s.name}
        sub={`${s.city}, ${s.state} · ${s.utility} · ${s.iso} · ESI-ID ${s.esiId}${s.beds ? ` · ${s.beds} beds` : ''}`}
        actions={<><Btn icon="list">Site contract</Btn><Btn kind="primary" icon="plus">Add equipment</Btn></>}
      />
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={0}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <KpiTile label="Peak kW" value={s.peakKw.toLocaleString()} sub="estimated" accent />
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Equipment" value={eq.length} sub={`${enrolled.length} enrolled`} /></div>
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Enrolled MW" value={enrolledMw.toFixed(1)} /></div>
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Last event" value="08/14" sub="96.4% perf" /></div>
            </div>
          </Card>
          <Card title="Equipment at this site" padding={0}>
            <EquipmentTable equipment={eq} showSite={false} />
          </Card>
          <Card title="Recent telemetry" eyebrow="SkySpark · 24h interval demand (kW)">
            <TelemetryChart peakKw={s.peakKw} />
          </Card>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Site facts">
            <KV k="Client" v={<span style={{ cursor: 'pointer', color: T.steel, fontWeight: 600 }} onClick={() => navigate('client', { clientId: c.id })}>{c.name} ↗</span>} />
            <KV k="Address" v={`${s.city}, ${s.state}`} />
            <KV k="Utility" v={s.utility} />
            <KV k="ISO" v={s.iso} />
            <KV k="ESI-ID" v={<span style={{ fontFamily: monoT }}>{s.esiId}</span>} />
            {s.beds && <KV k="Beds" v={s.beds} />}
            <KV k="Peak demand" v={`${s.peakKw.toLocaleString()} kW`} />
          </Card>
          <Card title="Eligible programs" eyebrow="ISO + utility programs">
            {PROGRAMS.filter(p => p.iso === s.iso || (s.utility === 'CenterPoint' && p.iso === 'CenterPoint')).map(p => (
              <div key={p.id} style={{ padding: '8px 0', borderBottom: `1px solid ${T.borderSoft}`, fontFamily: sansT }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{p.iso} {p.name}</span>
                  <span style={{ fontFamily: monoT, fontSize: 12, color: T.accent, fontWeight: 700 }}>${p.rate}/kW-yr</span>
                </div>
                <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>{p.desc}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${T.borderSoft}`, fontFamily: sansT }}>
      <span style={{ fontSize: 11.5, color: T.ink3, fontWeight: 500 }}>{k}</span>
      <span style={{ fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{v}</span>
    </div>
  );
}

// Cute deterministic "telemetry" chart
function TelemetryChart({ peakKw }) {
  const W = 600, H = 140, pad = 22;
  const pts = useMemo(() => {
    const out = [];
    for (let i = 0; i < 48; i++) {
      const t = i / 47;
      // diurnal curve + noise
      const base = 0.45 + 0.35 * Math.sin((t - 0.25) * Math.PI * 2);
      const noise = Math.sin(i * 1.7) * 0.04 + Math.cos(i * 0.9) * 0.03;
      out.push(Math.max(0.2, Math.min(1.0, base + noise)) * peakKw);
    }
    return out;
  }, [peakKw]);
  const max = Math.max(...pts), min = Math.min(...pts);
  const path = pts.map((v, i) => {
    const x = pad + (i / (pts.length - 1)) * (W - 2 * pad);
    const y = H - pad - ((v - min) / (max - min)) * (H - 2 * pad);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140, display: 'block' }}>
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke={T.border} />
      <line x1={pad} y1={pad}     x2={pad}     y2={H - pad} stroke={T.border} />
      <path d={`${path} L ${W - pad} ${H - pad} L ${pad} ${H - pad} Z`} fill="rgba(214,239,75,0.20)" />
      <path d={path} stroke={T.accent} strokeWidth="1.6" fill="none" />
      <text x={pad} y={pad - 6} fontFamily={monoT} fontSize="9" fill={T.ink3}>{Math.round(max).toLocaleString()} kW</text>
      <text x={pad} y={H - pad + 12} fontFamily={monoT} fontSize="9" fill={T.ink3}>00:00</text>
      <text x={W - pad} y={H - pad + 12} textAnchor="end" fontFamily={monoT} fontSize="9" fill={T.ink3}>24:00</text>
    </svg>
  );
}

function EquipmentPage() {
  const { route, navigate, setDrawer } = useApp();
  const e = getEquipment(route.params.equipmentId);
  if (!e) return <div style={{ padding: 40 }}>Equipment not found</div>;
  const s = getSite(e.siteId);
  const c = s ? getClient(s.clientId) : null;
  const p = getProgram(e.programId);
  const annual = p ? e.kw * p.rate : 0;

  return (
    <div>
      <TitleStrip
        eyebrow={`Equipment · ${e.type}`}
        title={`${e.id} · ${e.make} ${e.model}`}
        sub={`${e.kw.toLocaleString()} kW${e.kwh ? ` / ${e.kwh.toLocaleString()} kWh` : ''} · ${s?.name} · ${c?.short}`}
        actions={e.status === 'Enrolled'
          ? <Btn icon="list">View enrollment doc</Btn>
          : <Btn kind="accent" icon="plus" onClick={() => setDrawer({ kind: 'enrollment', equipmentId: e.id })}>Enroll in program</Btn>}
      />
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={0}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <KpiTile label="Nameplate" value={`${e.kw.toLocaleString()} kW`} accent />
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Status" value={e.status} sub={p ? `${p.iso} ${p.name}` : 'No program'} /></div>
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Annual rev." value={annual ? fmt$(annual) : '—'} sub={p ? `${p.unit}` : 'not enrolled'} /></div>
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Last event" value={e.status === 'Enrolled' ? '96.4%' : '—'} sub={e.status === 'Enrolled' ? '08/14 · ERCOT 4CP' : '—'} /></div>
            </div>
          </Card>
          <LiveStatusCard equipment={e} />
          {(e.type === 'Chiller' || e.type === 'HP Chiller') && <ChilledWaterCard equipment={e} />}
          <Card title="Performance · last 6 events" padding={0}>
            <PerfBars />
          </Card>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Equipment facts">
            <KV k="Asset tag" v={<span style={{ fontFamily: monoT }}>{e.id}</span>} />
            <KV k="Type" v={e.type} />
            <KV k="Make / Model" v={`${e.make} ${e.model}`} />
            <KV k="Capacity" v={`${e.kw.toLocaleString()} kW`} />
            {e.kwh && <KV k="Energy" v={`${e.kwh.toLocaleString()} kWh`} />}
            <KV k="Site" v={<span style={{ cursor: 'pointer', color: T.steel, fontWeight: 600 }} onClick={() => navigate('site', { siteId: s.id })}>{s.name.split('·').slice(-1)[0].trim()} ↗</span>} />
            <KV k="Client" v={<span style={{ cursor: 'pointer', color: T.steel, fontWeight: 600 }} onClick={() => navigate('client', { clientId: c.id })}>{c.short} ↗</span>} />
          </Card>
          {p && (
            <Card title="Enrollment" eyebrow={`${p.iso} ${p.name}`}>
              <div style={{ fontFamily: sansT, fontSize: 13, color: T.ink, fontWeight: 600 }}>{p.desc}</div>
              <div style={{ marginTop: 12 }}>
                <KV k="Rate" v={<span style={{ fontFamily: monoT }}>${p.rate} {p.unit}</span>} />
                <KV k="Capacity nominated" v={<span style={{ fontFamily: monoT }}>{e.kw.toLocaleString()} kW</span>} />
                <KV k="Annual revenue" v={<span style={{ fontFamily: monoT, color: T.accent, fontWeight: 700 }}>{fmt$(annual)}</span>} />
                <KV k="Client share (70%)" v={<span style={{ fontFamily: monoT, color: T.accent, fontWeight: 700 }}>{fmt$(annual * 0.7)}</span>} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Live status (SkySpark) ───────────────────────────────────
// Deterministic seed from the equipment id so the demo is stable per asset,
// but the values drift every couple seconds so it feels live.
function liveSeedFor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function useLiveTelemetry(equipment) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2400);
    return () => clearInterval(t);
  }, [equipment.id]);
  return useMemo(() => {
    const seed = liveSeedFor(equipment.id);
    const r = (seed % 100) / 100;
    const isBess = equipment.type === 'BESS';
    const isSolar = equipment.type === 'Solar';
    const offline = r < 0.10;

    // Drift over time, deterministic-ish
    const drift = (n, amp) => {
      const base = ((seed >>> n) & 0xff) / 255;
      return (Math.sin((tick + base * 17) / 3.1) * amp);
    };

    if (isBess) {
      // Pick a mode based on seed bucket
      const bucket = Math.floor(r * 100) % 5;
      const modes = ['Discharging', 'Charging', 'Off', 'Full', 'Empty'];
      const status = offline ? 'Off' : modes[bucket];
      let socBase = 0.55 + drift(3, 0.10);
      if (status === 'Full')  socBase = 0.98 + drift(2, 0.01);
      if (status === 'Empty') socBase = 0.04 + drift(2, 0.02);
      if (status === 'Charging')    socBase = 0.42 + drift(3, 0.06);
      if (status === 'Discharging') socBase = 0.68 + drift(3, 0.06);
      const soc = Math.max(0, Math.min(1, socBase));

      let power = 0;
      if (status === 'Discharging') power = Math.round(equipment.kw * (0.55 + drift(4, 0.12)));
      else if (status === 'Charging') power = -Math.round(equipment.kw * (0.30 + drift(4, 0.10)));
      else power = 0;

      let avail = 0;
      if (status === 'Full' || status === 'Discharging') avail = Math.round(equipment.kw * Math.min(1, soc * 1.05));
      else if (status === 'Charging') avail = Math.round(equipment.kw * 0.70);
      else if (status === 'Empty' || status === 'Off') avail = 0;

      return { status, soc, power, available: avail, hasSoc: true };
    }

    if (isSolar) {
      // Solar produces during the day; deterministic "now"
      const hour = (tick + (seed % 24)) % 24;
      const daylight = hour >= 7 && hour <= 19;
      const status = offline ? 'Off' : (daylight ? 'Generating' : 'Off');
      const power = status === 'Generating'
        ? Math.round(equipment.kw * (0.55 + drift(5, 0.18)))
        : 0;
      return { status, soc: null, power, available: status === 'Generating' ? power : 0, hasSoc: false };
    }

    // Gensets / chillers / AHUs — Off / Running / Standby
    const bucket = Math.floor(r * 100) % 3;
    const modes = equipment.type === 'Genset'
      ? ['Standby', 'Running', 'Off']
      : ['Running', 'Standby', 'Off'];
    const status = offline ? 'Off' : modes[bucket];
    const loadFrac = status === 'Running' ? (0.60 + drift(4, 0.15)) : 0;
    const power = Math.round(equipment.kw * loadFrac);
    const avail = status === 'Off' ? 0 : equipment.kw;

    // Chiller / heat-pump chiller hydronic telemetry from SkySpark
    if (equipment.type === 'Chiller' || equipment.type === 'HP Chiller') {
      const isHP = equipment.type === 'HP Chiller';
      // Nameplate cooling capacity in tons (~0.6 kW/ton input at design)
      const nameplateTons = Math.round(equipment.kw / 0.6);
      const tons = Math.round(nameplateTons * loadFrac);
      // Design 12°F ΔT; actual drifts with load
      const dT = status === 'Running' ? (10 + drift(6, 1.8)) : 0;
      const leaving = status === 'Running' ? (42 + drift(7, 1.2)) : 56 + drift(7, 0.8);
      const entering = status === 'Running' ? (leaving + dT) : leaving + drift(8, 0.4);
      // GPM = tons × 24 / ΔT (standard chilled-water heat balance)
      const gpm = status === 'Running' && dT > 0
        ? Math.round((tons * 24) / dT)
        : 0;
      return {
        status, soc: null, power, available: avail, hasSoc: false,
        chiller: {
          isHP,
          flowGpm: gpm,
          enteringF: +entering.toFixed(1),
          leavingF: +leaving.toFixed(1),
          loadTons: tons,
          nameplateTons,
          dT: +dT.toFixed(1),
        },
      };
    }

    return { status, soc: null, power, available: avail, hasSoc: false };
  }, [equipment.id, equipment.kw, equipment.type, tick]);
}

function StatusPillLive({ status }) {
  const map = {
    'Discharging': { bg: T.lime, fg: T.accent, dot: T.accent },
    'Charging':    { bg: T.iced, fg: T.accent, dot: T.accent },
    'Full':        { bg: T.okBg, fg: T.ok,    dot: T.ok },
    'Empty':       { bg: T.warnBg, fg: T.warn, dot: T.warn },
    'Off':         { bg: T.borderSoft, fg: T.ink3, dot: T.ink4 },
    'Running':     { bg: T.lime, fg: T.accent, dot: T.accent },
    'Standby':     { bg: T.iced, fg: T.accent, dot: T.accent },
    'Generating':  { bg: T.lime, fg: T.accent, dot: T.accent },
  };
  const s = map[status] || map['Off'];
  const isLive = status !== 'Off';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontFamily: sansT, fontSize: 12, fontWeight: 700,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: s.dot,
        animation: isLive ? 'edcPulse 1.6s ease-in-out infinite' : 'none',
      }}></span>
      {status}
    </span>
  );
}

function SOCBar({ soc, status }) {
  const pct = Math.round(soc * 100);
  const lowFill = soc < 0.15;
  const fillC = status === 'Charging' ? T.iced : (lowFill ? T.warnBg : T.lime);
  const borderC = status === 'Charging' ? T.accent : (lowFill ? T.warn : T.accent);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>State of charge</span>
        <span style={{ fontFamily: monoT, fontSize: 14, color: T.accent, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ position: 'relative', height: 22, borderRadius: 4, border: `1px solid ${T.border}`, background: T.bgAlt, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`, background: fillC, borderRight: pct > 1 && pct < 99 ? `1px solid ${borderC}` : 'none',
          transition: 'width 0.6s ease-out',
        }}></div>
        {/* tick marks at 25/50/75 */}
        {[25, 50, 75].map(t => (
          <div key={t} style={{
            position: 'absolute', left: `${t}%`, top: 4, bottom: 4, width: 1,
            background: T.border2, opacity: 0.5,
          }}></div>
        ))}
      </div>
    </div>
  );
}

function LiveStatusCard({ equipment }) {
  const t = useLiveTelemetry(equipment);
  const showSoc = t.hasSoc;
  const powerStr = t.power === 0
    ? '0'
    : (t.power > 0 ? `+${t.power.toLocaleString()}` : t.power.toLocaleString());
  const powerLabel = t.power === 0
    ? (t.status === 'Off' ? 'Offline' : 'Idle')
    : (equipment.type === 'BESS'
        ? (t.power > 0 ? 'Discharging' : 'Charging')
        : (equipment.type === 'Solar' ? 'Generating' : 'Output'));

  return (
    <Card padding={0}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: `1px solid ${T.border}`, background: T.bgAlt,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: sansT, fontSize: 11, fontWeight: 700,
            color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>Live status</span>
          <span style={{
            fontFamily: monoT, fontSize: 10.5, color: T.ink3,
            padding: '2px 6px', background: T.paper, border: `1px solid ${T.border}`, borderRadius: 3,
          }}>SkySpark · updated 2s ago</span>
        </div>
        <StatusPillLive status={t.status} />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: showSoc ? '1fr 1fr 1fr' : '1fr 1fr',
      }}>
        <div style={{ padding: '18px 20px' }}>
          <div style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Power</div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: monoT, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em',
              color: t.power < 0 ? T.steel : T.accent,
            }}>{powerStr}</span>
            <span style={{ fontFamily: monoT, fontSize: 13, color: T.ink3 }}>kW</span>
          </div>
          <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3, marginTop: 2 }}>{powerLabel}</div>
        </div>
        {showSoc && (
          <div style={{ padding: '18px 20px', borderLeft: `1px solid ${T.border}` }}>
            <SOCBar soc={t.soc} status={t.status} />
            <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3, marginTop: 6 }}>
              {equipment.kwh ? `${Math.round(t.soc * equipment.kwh).toLocaleString()} / ${equipment.kwh.toLocaleString()} kWh` : ''}
            </div>
          </div>
        )}
        <div style={{ padding: '18px 20px', borderLeft: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Available</div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: monoT, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em',
              color: t.available === 0 ? T.ink4 : T.accent,
            }}>{t.available.toLocaleString()}</span>
            <span style={{ fontFamily: monoT, fontSize: 13, color: T.ink3 }}>kW</span>
          </div>
          <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3, marginTop: 2 }}>
            of {equipment.kw.toLocaleString()} kW nameplate · {Math.round((t.available / equipment.kw) * 100)}%
          </div>
        </div>
      </div>
    </Card>
  );
}

function ChilledWaterCard({ equipment }) {
  const t = useLiveTelemetry(equipment);
  const cw = t.chiller;
  if (!cw) return null;
  const isRunning = t.status === 'Running';
  const loadPct = cw.nameplateTons > 0 ? Math.round((cw.loadTons / cw.nameplateTons) * 100) : 0;
  const prefix = cw.isHP ? 'HPCH' : 'CHW';
  const title = cw.isHP ? 'Heat pump chiller loop' : 'Chilled water loop';
  const headerTag = cw.isHP ? 'SkySpark · HPCH header' : 'SkySpark · CHW header';
  const flowSub = isRunning ? (cw.isHP ? 'Hydronic loop' : 'Primary loop') : 'No flow';
  const leavingSub = isRunning
    ? (cw.isHP ? 'Supply to loads · setpt 44°F' : 'Supply to loads · setpt 42°F')
    : (cw.isHP ? 'Setpt 44°F' : 'Setpt 42°F');

  const Tile = ({ label, value, unit, sub, accent }) => (
    <div style={{ padding: '18px 20px', borderLeft: accent ? 'none' : `1px solid ${T.border}` }}>
      <div style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontFamily: monoT, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em',
          color: isRunning ? T.accent : T.ink4,
        }}>{value}</span>
        <span style={{ fontFamily: monoT, fontSize: 12, color: T.ink3 }}>{unit}</span>
      </div>
      <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3, marginTop: 2 }}>{sub}</div>
    </div>
  );

  return (
    <Card padding={0}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: `1px solid ${T.border}`, background: T.bgAlt,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: sansT, fontSize: 11, fontWeight: 700,
            color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>{title}</span>
          <span style={{
            fontFamily: monoT, fontSize: 10.5, color: T.ink3,
            padding: '2px 6px', background: T.paper, border: `1px solid ${T.border}`, borderRadius: 3,
          }}>{headerTag}</span>
        </div>
        <span style={{ fontFamily: monoT, fontSize: 11.5, color: T.ink2, fontWeight: 600 }}>
          ΔT {isRunning ? `${cw.dT.toFixed(1)}°F` : '—'}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: cw.isHP ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)' }}>
        <Tile
          label={`${prefix} Flow`}
          value={isRunning ? cw.flowGpm.toLocaleString() : '0'}
          unit="GPM"
          sub={flowSub}
          accent
        />
        <Tile
          label="Entering Temp"
          value={cw.enteringF.toFixed(1)}
          unit="°F"
          sub="Return from loads"
        />
        <Tile
          label="Leaving Temp"
          value={cw.leavingF.toFixed(1)}
          unit="°F"
          sub={leavingSub}
        />
        {!cw.isHP && (
          <Tile
            label="CHW Load"
            value={isRunning ? cw.loadTons.toLocaleString() : '0'}
            unit="tons"
            sub={`of ${cw.nameplateTons.toLocaleString()} ton capacity · ${loadPct}%`}
          />
        )}
      </div>
    </Card>
  );
}

function PerfBars() {
  const data = [0.971, 0.953, 0.992, 1.012, 0.881, 0.974];
  const labels = ['08/14', '06/15', '08/07', '07/22', '07/09', '06/28'];
  return (
    <div style={{ padding: 18, display: 'flex', alignItems: 'flex-end', gap: 14, height: 160 }}>
      {data.map((v, i) => {
        const h = (v - 0.85) / 0.20 * 110;
        const okC = v >= 0.95 ? T.lime : (v >= 0.90 ? T.iced : T.errBg);
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <span style={{ fontFamily: monoT, fontSize: 11, color: T.accent, fontWeight: 700 }}>{(v * 100).toFixed(1)}%</span>
            <div style={{ width: '100%', maxWidth: 56, height: h, background: okC, border: `1px solid ${T.accent}`, borderRadius: 2 }} />
            <span style={{ fontFamily: monoT, fontSize: 10, color: T.ink3 }}>{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { ClientsListPage, ClientPage, SitePage, EquipmentPage, KV });
