// EDC demo · Events list, event detail, enrollment pipeline page

function EventsPage() {
  const { events, liveEvent, navigate } = useApp();
  return (
    <div>
      <TitleStrip
        eyebrow="DR Events"
        title="Event log"
        sub={`${events.length} settled events YTD${liveEvent ? ' · 1 live event in progress' : ''}`}
        actions={<Btn icon="list">Export CSV</Btn>}
      />
      <div style={{ padding: 24 }}>
        <Card padding={0}>
          {liveEvent && (
            <div onClick={() => navigate('event-detail', { eventId: 'live' })} style={{
              padding: '14px 16px', background: 'rgba(214,239,75,0.16)',
              borderBottom: `1px solid ${T.border}`, display: 'grid',
              gridTemplateColumns: '0.7fr 0.7fr 1fr 0.7fr 0.6fr 0.7fr 1fr', gap: 12, alignItems: 'center',
              fontFamily: sansT, fontSize: 13, cursor: 'pointer',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: sansT, fontWeight: 700, color: T.accent, fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: T.accent, animation: 'edcPulse 1.6s ease-in-out infinite' }} />Live
              </span>
              <span style={{ fontWeight: 600, color: T.accent }}>{liveEvent.iso} {liveEvent.program}</span>
              <span style={{ color: T.ink3 }}>started {liveEvent.startedAt} CT</span>
              <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{liveEvent.siteCount} sites</span>
              <span style={{ fontFamily: monoT, fontWeight: 700, color: T.accent }}>{fmtMw(liveEvent.calledMw)}</span>
              <span style={{ fontFamily: monoT, fontWeight: 700, color: T.accent }}>{fmtPct(liveEvent.perf)}</span>
              <span style={{ textAlign: 'right', color: T.steel, fontWeight: 600 }}>Open live →</span>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 0.7fr 1fr 0.7fr 0.6fr 0.7fr 1fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
            <Eyebrow>Event ID</Eyebrow><Eyebrow>ISO</Eyebrow><Eyebrow>When</Eyebrow><Eyebrow>Sites</Eyebrow><Eyebrow>MW</Eyebrow><Eyebrow>Perf</Eyebrow><Eyebrow>Status</Eyebrow>
          </div>
          {events.map((ev, i) => {
            const perfBad = ev.perf < 0.92;
            return (
              <div key={ev.id} onClick={() => navigate('event-detail', { eventId: ev.id })} style={{
                display: 'grid', gridTemplateColumns: '0.7fr 0.7fr 1fr 0.7fr 0.6fr 0.7fr 1fr', padding: '11px 14px',
                borderBottom: i < events.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                fontFamily: sansT, fontSize: 13, alignItems: 'center', cursor: 'pointer',
              }} onMouseEnter={e => e.currentTarget.style.background = T.borderSoft} onMouseLeave={e => e.currentTarget.style.background = T.paper}>
                <span style={{ fontFamily: monoT, fontSize: 11.5, color: T.accent, fontWeight: 600 }}>{ev.id}</span>
                <span style={{ fontWeight: 600, color: T.ink }}>{ev.iso} {ev.program}</span>
                <span style={{ color: T.ink2 }}>{ev.date} · {ev.start}–{ev.end}</span>
                <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{ev.siteCount}</span>
                <span style={{ fontFamily: monoT, fontWeight: 700, color: T.accent }}>{ev.calledMw.toFixed(1)}</span>
                <span style={{ fontFamily: monoT, fontWeight: 700, color: perfBad ? T.err : T.accent }}>{fmtPct(ev.perf)}</span>
                <span><StatusPill kind={perfBad ? 'err' : 'ok'}>{ev.status}</StatusPill></span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

function EventDetailPage() {
  const { route, events, liveEvent, navigate, endLiveEvent } = useApp();
  const isLive = route.params.eventId === 'live';
  const ev = isLive ? liveEvent : events.find(e => e.id === route.params.eventId);
  if (!ev) return <div style={{ padding: 40 }}>Event not found</div>;

  return (
    <div>
      <TitleStrip
        eyebrow={isLive ? 'Live event' : 'Settled event'}
        title={`${ev.iso} ${ev.program} · ${isLive ? `started ${ev.startedAt}` : ev.date}`}
        sub={isLive
          ? `${ev.siteCount} sites · ${fmtMw(ev.calledMw)} called · ends ~${ev.endsAt} CT`
          : `${ev.start}–${ev.end} · ${ev.siteCount} sites · ${fmtMw(ev.calledMw)} called`}
        actions={isLive
          ? <Btn kind="danger" onClick={endLiveEvent}>End event (demo)</Btn>
          : <Btn icon="list">Settlement report</Btn>}
      />
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={0}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <KpiTile label="Performance" value={fmtPct(ev.perf)} sub={ev.perf >= 0.95 ? 'on target' : (ev.perf >= 0.90 ? 'borderline' : 'penalty triggered')} accent />
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="MW called" value={ev.calledMw.toFixed(1)} sub="nominated" /></div>
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="MW delivered" value={(ev.calledMw * ev.perf).toFixed(1)} sub="actual" /></div>
              <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Sites" value={ev.siteCount} sub={isLive ? 'reporting' : 'settled'} /></div>
            </div>
          </Card>
          <Card title={isLive ? 'Baseline vs actual · live' : 'Baseline vs actual · event window'} eyebrow="kW · 1-min interval">
            <BaselineActualChart perf={ev.perf} live={isLive} />
          </Card>
          {isLive && ev.sites && (
            <Card title="Per-site performance" eyebrow="live · refreshed every 2 min" padding={0}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr 0.6fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
                <Eyebrow>Site</Eyebrow><Eyebrow>Nominated</Eyebrow><Eyebrow>Actual</Eyebrow><Eyebrow>Perf</Eyebrow><Eyebrow>Status</Eyebrow>
              </div>
              {ev.sites.map((row, i) => {
                const s = getSite(row.siteId);
                const perfBad = row.perf != null && row.perf < 0.95;
                return (
                  <div key={row.siteId} onClick={() => navigate('site', { siteId: row.siteId })} style={{
                    display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr 0.6fr', padding: '11px 14px',
                    borderBottom: i < ev.sites.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                    fontFamily: sansT, fontSize: 13, alignItems: 'center', cursor: 'pointer',
                  }} onMouseEnter={e => e.currentTarget.style.background = T.borderSoft} onMouseLeave={e => e.currentTarget.style.background = T.paper}>
                    <span style={{ fontWeight: 600, color: T.ink }}>{s?.name}</span>
                    <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{row.nomKw.toLocaleString()} kW</span>
                    <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{row.actualKw ? row.actualKw.toLocaleString() + ' kW' : '—'}</span>
                    <span style={{ fontFamily: monoT, fontWeight: 700, color: perfBad ? T.warn : T.accent }}>{row.perf != null ? fmtPct(row.perf) : '—'}</span>
                    <span><StatusPill kind={row.perf == null ? 'neutral' : (perfBad ? 'warn' : 'ok')}>{row.perf == null ? 'Excused' : (perfBad ? 'Under' : 'On target')}</StatusPill></span>
                  </div>
                );
              })}
            </Card>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Event facts">
            <KV k="ISO" v={ev.iso} />
            <KV k="Program" v={ev.program} />
            <KV k="Date" v={ev.date || new Date().toISOString().slice(0, 10)} />
            <KV k="Window" v={isLive ? `${ev.startedAt} – ~${ev.endsAt}` : `${ev.start} – ${ev.end}`} />
            <KV k="Notif. lead" v={ev.notifWindow || '2 hr'} />
            <KV k="Status" v={<StatusPill kind={isLive ? 'accent' : (ev.perf < 0.92 ? 'err' : 'ok')}>{isLive ? 'Active' : ev.status}</StatusPill>} />
          </Card>
          <Card title="Settlement preview" eyebrow="Estimated · pending ISO">
            <KV k="Capacity payment" v={<span style={{ fontFamily: monoT }}>{fmt$(ev.calledMw * 1000 * 8)}</span>} />
            <KV k="Energy payment"   v={<span style={{ fontFamily: monoT }}>{fmt$(ev.calledMw * 1000 * 0.32 * 3)}</span>} />
            <KV k="Performance adj." v={<span style={{ fontFamily: monoT, color: ev.perf >= 0.95 ? T.ok : T.warn }}>{ev.perf >= 0.95 ? '+0%' : `${((ev.perf - 1) * 100).toFixed(1)}%`}</span>} />
            <KV k="Total"            v={<span style={{ fontFamily: monoT, color: T.accent, fontWeight: 700 }}>{fmt$(ev.calledMw * 1000 * 8 * ev.perf + ev.calledMw * 1000 * 0.32 * 3)}</span>} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function BaselineActualChart({ perf, live }) {
  const W = 700, H = 220, pad = 36;
  const N = 60;
  const baseline = useMemo(() => {
    const out = [];
    for (let i = 0; i < N; i++) out.push(0.92 + Math.sin(i * 0.18) * 0.04);
    return out;
  }, []);
  const eventStart = 18, eventEnd = N - 6;
  const actual = useMemo(() => {
    return baseline.map((b, i) => {
      if (i < eventStart || i > eventEnd) return b;
      const drop = 0.42 * (perf || 0.96);
      const noise = Math.sin(i * 0.6) * 0.02;
      return b - drop + noise;
    });
  }, [baseline, perf]);

  const max = 1.0, min = 0.45;
  const xOf = i => pad + (i / (N - 1)) * (W - 2 * pad);
  const yOf = v => H - pad - ((v - min) / (max - min)) * (H - 2 * pad);
  const pathOf = arr => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i).toFixed(1)} ${yOf(v).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 220, display: 'block' }}>
      {/* Event window */}
      <rect x={xOf(eventStart)} y={pad} width={xOf(eventEnd) - xOf(eventStart)} height={H - 2 * pad} fill="rgba(214,239,75,0.18)" />
      <text x={xOf(eventStart) + 6} y={pad + 12} fontFamily={sansT} fontSize="10" fontWeight="700" fill={T.accent} letterSpacing="0.08em">EVENT WINDOW</text>
      {/* Axes */}
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke={T.border} />
      <line x1={pad} y1={pad}     x2={pad}     y2={H - pad} stroke={T.border} />
      {[0.5, 0.7, 0.9].map(v => (
        <g key={v}>
          <line x1={pad} y1={yOf(v)} x2={W - pad} y2={yOf(v)} stroke={T.borderSoft} />
          <text x={pad - 6} y={yOf(v) + 3} textAnchor="end" fontFamily={monoT} fontSize="9" fill={T.ink3}>{(v * 28.4).toFixed(1)} MW</text>
        </g>
      ))}
      {/* Baseline (dashed) */}
      <path d={pathOf(baseline)} stroke={T.steel} strokeWidth="1.4" fill="none" strokeDasharray="4 3" />
      {/* Actual */}
      <path d={pathOf(actual)} stroke={T.accent} strokeWidth="2" fill="none" />
      {/* Live cursor */}
      {live && (
        <g>
          <line x1={xOf(eventEnd - 3)} y1={pad} x2={xOf(eventEnd - 3)} y2={H - pad} stroke={T.accent} strokeWidth="1" strokeDasharray="2 3" />
          <circle cx={xOf(eventEnd - 3)} cy={yOf(actual[eventEnd - 3])} r="5" fill={T.lime} stroke={T.accent} strokeWidth="1.5">
            <animate attributeName="r" values="5;7;5" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
      {/* Legend */}
      <g transform={`translate(${W - pad - 220}, ${pad + 6})`}>
        <line x1="0" y1="6" x2="14" y2="6" stroke={T.steel} strokeWidth="1.4" strokeDasharray="4 3" />
        <text x="20" y="9" fontFamily={sansT} fontSize="10" fill={T.ink2}>Baseline (CBL 10/10)</text>
        <line x1="120" y1="6" x2="134" y2="6" stroke={T.accent} strokeWidth="2" />
        <text x="140" y="9" fontFamily={sansT} fontSize="10" fill={T.ink2}>Actual demand</text>
      </g>
    </svg>
  );
}

function EnrollmentPage() {
  const { setDrawer, navigate } = useApp();
  const pipeline = EQUIPMENT.filter(e => e.status !== 'Enrolled');
  return (
    <div>
      <TitleStrip
        eyebrow="Enrollment"
        title="Enrollment pipeline"
        sub={`${pipeline.length} pieces of equipment ready to enroll`}
        actions={<Btn kind="primary" icon="plus" onClick={() => useApp().setDrawer({ kind: 'onboarding' })}>Onboard new client</Btn>}
      />
      <div style={{ padding: 24 }}>
        <Card padding={0} title="Pipeline" eyebrow="click any row to enroll · 4-step flow">
          <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 0.5fr 1.2fr 1.2fr 0.6fr 0.7fr 0.7fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
            <Eyebrow>Tag</Eyebrow><Eyebrow>Type</Eyebrow><Eyebrow>Equipment</Eyebrow><Eyebrow>Site</Eyebrow><Eyebrow>kW</Eyebrow><Eyebrow>Status</Eyebrow><span/>
          </div>
          {pipeline.map((e, i) => {
            const s = getSite(e.siteId);
            return (
              <div key={e.id} style={{
                display: 'grid', gridTemplateColumns: '0.6fr 0.5fr 1.2fr 1.2fr 0.6fr 0.7fr 0.7fr', padding: '11px 14px',
                borderBottom: i < pipeline.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                fontFamily: sansT, fontSize: 13, alignItems: 'center',
              }}>
                <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent, cursor: 'pointer' }} onClick={() => navigate('equipment', { equipmentId: e.id })}>{e.id}</span>
                <span style={{ color: T.ink2 }}>{e.type}</span>
                <span style={{ color: T.ink }}>{e.make} {e.model}</span>
                <span style={{ color: T.ink2, cursor: 'pointer' }} onClick={() => navigate('site', { siteId: s.id })}>{s?.name}</span>
                <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{e.kw.toLocaleString()}</span>
                <span><StatusForEquip status={e.status} /></span>
                <span style={{ textAlign: 'right' }}><Btn size="sm" kind="accent" onClick={() => setDrawer({ kind: 'enrollment', equipmentId: e.id })}>Enroll</Btn></span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { EventsPage, EventDetailPage, EnrollmentPage, BaselineActualChart });
