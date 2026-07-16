// EDC demo · Equipment overview (4 type tiles) + per-bucket detail page

function EquipmentOverviewPage() {
  const { navigate, filters, persona, personaFilteredSiteIds } = useApp();

  const filtered = useMemo(() => {
    return EQUIPMENT.filter(e => {
      const s = getSite(e.siteId);
      if (!s) return false;
      if (persona === 'pam' && personaFilteredSiteIds && !personaFilteredSiteIds.has(s.id)) return false;
      if (filters.iso && s.iso !== filters.iso) return false;
      if (filters.state && s.state !== filters.state) return false;
      if (filters.vertical) {
        const c = getClient(s.clientId);
        if (c?.vertical !== filters.vertical) return false;
      }
      if (filters.status && e.status !== filters.status) return false;
      return true;
    });
  }, [filters, persona, personaFilteredSiteIds]);

  const stats = useMemo(() => {
    return EQUIP_BUCKETS.map(b => {
      const eq = filtered.filter(e => b.types.includes(e.type));
      const enrolled = eq.filter(e => e.status === 'Enrolled');
      const enrolledKw = enrolled.reduce((s, e) => s + e.kw, 0);
      const availableKw = enrolled.reduce((s, e) => s + Math.min(availableKwFor(e), e.kw), 0);
      const grossRev = enrolled.reduce((s, e) => { const p = getProgram(e.programId); return s + (p ? e.kw * p.rate : 0); }, 0);
      const offline = enrolled.filter(e => availableKwFor(e) === 0).length;
      return { bucket: b, count: eq.length, enrolledCount: enrolled.length, enrolledKw, availableKw, grossRev, offline };
    });
  }, [filtered]);

  const totals = stats.reduce((acc, s) => ({
    count: acc.count + s.count, enrolled: acc.enrolled + s.enrolledCount,
    availableKw: acc.availableKw + s.availableKw, grossRev: acc.grossRev + s.grossRev,
  }), { count: 0, enrolled: 0, availableKw: 0, grossRev: 0 });

  return (
    <div>
      <TitleStrip
        eyebrow="Equipment"
        title="Equipment overview"
        sub={`${totals.enrolled} enrolled assets · ${(totals.availableKw / 1000).toFixed(1)} MW available now · ${fmt$M(totals.grossRev)} gross annual program revenue`}
        actions={<Btn icon="list" onClick={() => navigate('enrollment')}>Enrollment pipeline →</Btn>}
      />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          {stats.map(({ bucket, count, enrolledCount, availableKw, enrolledKw, grossRev, offline }) => (
            <BucketTile key={bucket.id} bucket={bucket} count={count} enrolledCount={enrolledCount}
              availableMw={availableKw / 1000} enrolledMw={enrolledKw / 1000}
              grossRev={grossRev} offline={offline}
              onClick={() => navigate('equipment-bucket', { bucket: bucket.id })} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card title="Available MW by category" eyebrow="dispatchable now · capped at enrolled">
            <BucketBars stats={stats} field="availableKw" />
          </Card>
          <Card title="Gross annual revenue by category" eyebrow="program rate × enrolled kW">
            <BucketBars stats={stats} field="grossRev" money />
          </Card>
        </div>
      </div>
    </div>
  );
}

function BucketTile({ bucket, count, enrolledCount, availableMw, enrolledMw, grossRev, offline, onClick }) {
  const utilization = enrolledMw > 0 ? availableMw / enrolledMw : 0;
  return (
    <div onClick={onClick} style={{
      background: T.paper, border: `1px solid ${T.border}`, borderRadius: 8,
      padding: 16, cursor: 'pointer', position: 'relative', transition: 'all 140ms',
      borderLeft: `4px solid ${bucketColor(bucket.id)}`,
    }} onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.borderLeftColor = bucketColor(bucket.id); e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(9,43,36,0.08)'; }}
       onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.borderLeftColor = bucketColor(bucket.id); e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BucketIcon kind={bucket.id} />
          <div>
            <div style={{ fontFamily: sansT, fontSize: 14, fontWeight: 700, color: T.ink }}>{bucket.label}</div>
            <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3 }}>{bucket.sub}</div>
          </div>
        </div>
        <Icon kind="chevron" size={14} color={T.ink3} />
      </div>
      <div style={{ marginTop: 14 }}>
        <Eyebrow>Available now</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
          <Num size={28}>{availableMw.toFixed(1)}</Num>
          <span style={{ fontFamily: sansT, fontSize: 12, color: T.ink3, fontWeight: 600 }}>MW</span>
          <span style={{ marginLeft: 'auto', fontFamily: monoT, fontSize: 11, color: T.ink3 }}>of {enrolledMw.toFixed(1)} MW enrolled</span>
        </div>
        <div style={{ marginTop: 6, height: 4, background: T.borderSoft, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(100, utilization * 100)}%`, background: utilization > 0.85 ? T.ok : (utilization > 0.6 ? T.lime : T.warn), transition: 'width 200ms' }} />
        </div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.borderSoft}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <Eyebrow>Assets</Eyebrow>
          <div style={{ fontFamily: monoT, fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 2 }}>
            {enrolledCount}<span style={{ color: T.ink3, fontWeight: 500 }}>/{count}</span>
          </div>
        </div>
        <div>
          <Eyebrow>Annual rev</Eyebrow>
          <div style={{ fontFamily: monoT, fontSize: 14, fontWeight: 700, color: T.accent, marginTop: 2 }}>{grossRev > 0 ? fmt$M(grossRev) : '—'}</div>
        </div>
      </div>
      {offline > 0 && (
        <div style={{ marginTop: 10, fontSize: 11, color: T.warn, fontFamily: sansT, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: T.warn }} />
          {offline} offline · reduced availability
        </div>
      )}
    </div>
  );
}

function BucketBars({ stats, field, money }) {
  const max = Math.max(...stats.map(s => s[field])) || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {stats.map(s => (
        <div key={s.bucket.id} style={{ fontFamily: sansT }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.ink, fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: bucketColor(s.bucket.id) }} />
              {s.bucket.label}
            </span>
            <span style={{ fontFamily: monoT, fontWeight: 700, color: T.accent }}>
              {money ? (s[field] > 0 ? fmt$M(s[field]) : '—') : `${(s[field] / 1000).toFixed(1)} MW`}
            </span>
          </div>
          <div style={{ height: 8, background: T.borderSoft, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(s[field] / max) * 100}%`, background: bucketColor(s.bucket.id), transition: 'width 240ms' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function bucketColor(id) {
  return { bess: T.lime, generators: T.steel, solar: '#F59E0B', facilities: T.accent }[id] || T.ink3;
}

function BucketIcon({ kind, size = 28 }) {
  const wrap = (children, bg) => (
    <span style={{
      width: size, height: size, borderRadius: 6,
      background: bg || T.icedSoft,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>{children}</span>
  );
  if (kind === 'bess') return wrap(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="16" height="10" rx="1"/><path d="M19 10v4M7 10v4M11 10v4M15 10v4"/></svg>,
    'rgba(214,239,75,0.30)'
  );
  if (kind === 'generators') return wrap(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/></svg>,
    T.steel
  );
  if (kind === 'solar') return wrap(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>,
    'rgba(245,158,11,0.18)'
  );
  if (kind === 'facilities') return wrap(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/></svg>,
    T.accent
  );
  return wrap(<span/>);
}

// ─── Bucket detail page ───────────────────────────────────────
function EquipmentBucketPage() {
  const { route, navigate, filters, persona, personaFilteredSiteIds, setDrawer } = useApp();
  const bucket = EQUIP_BUCKETS.find(b => b.id === route.params.bucket);
  if (!bucket) return <div style={{ padding: 40 }}>Bucket not found</div>;

  const eq = useMemo(() => {
    return EQUIPMENT.filter(e => {
      if (!bucket.types.includes(e.type)) return false;
      const s = getSite(e.siteId);
      if (!s) return false;
      if (persona === 'pam' && personaFilteredSiteIds && !personaFilteredSiteIds.has(s.id)) return false;
      if (filters.iso && s.iso !== filters.iso) return false;
      if (filters.state && s.state !== filters.state) return false;
      if (filters.vertical) {
        const c = getClient(s.clientId);
        if (c?.vertical !== filters.vertical) return false;
      }
      if (filters.status && e.status !== filters.status) return false;
      return true;
    });
  }, [bucket, filters, persona, personaFilteredSiteIds]);

  const enrolled = eq.filter(e => e.status === 'Enrolled');
  const enrolledKw = enrolled.reduce((s, e) => s + e.kw, 0);
  const availableKw = enrolled.reduce((s, e) => s + Math.min(availableKwFor(e), e.kw), 0);
  const grossRev = enrolled.reduce((s, e) => { const p = getProgram(e.programId); return s + (p ? e.kw * p.rate : 0); }, 0);

  return (
    <div>
      <TitleStrip
        eyebrow={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span onClick={() => navigate('equipment-overview')} style={{ cursor: 'pointer', color: T.steel, fontWeight: 600 }}>← Equipment overview</span>
        </span>}
        title={`${bucket.label}`}
        sub={bucket.sub}
        actions={<Btn icon="plus" onClick={() => navigate('enrollment')}>Enrollment pipeline</Btn>}
      />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card padding={0}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <KpiTile label="Available now" value={`${(availableKw / 1000).toFixed(1)} MW`} sub={`${enrolled.filter(e => availableKwFor(e) > 0).length} of ${enrolled.length} dispatchable`} accent />
            <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Enrolled" value={`${(enrolledKw / 1000).toFixed(1)} MW`} sub={`${enrolled.length} assets enrolled`} /></div>
            <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Total assets" value={eq.length} sub={`${eq.length - enrolled.length} not enrolled`} /></div>
            <div style={{ borderLeft: `1px solid ${T.border}` }}><KpiTile label="Annual revenue" value={grossRev > 0 ? fmt$M(grossRev) : '—'} sub="gross · pre-split" /></div>
          </div>
        </Card>

        <Card title={`${bucket.label} assets`} eyebrow={`${eq.length} assets · click any row to drill in`} padding={0}>
          <BucketTable equipment={eq} setDrawer={setDrawer} navigate={navigate} />
        </Card>
      </div>
    </div>
  );
}

function BucketTable({ equipment, setDrawer, navigate }) {
  if (equipment.length === 0) return <div style={{ padding: 40, textAlign: 'center', color: T.ink3, fontSize: 13 }}>No equipment matches the current filters.</div>;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1.1fr 1.3fr 0.5fr 0.6fr 0.7fr 0.7fr 0.7fr 0.6fr', padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
        <Eyebrow>Tag</Eyebrow><Eyebrow>Make · model</Eyebrow><Eyebrow>Site</Eyebrow><Eyebrow>kW</Eyebrow><Eyebrow>Avail.</Eyebrow><Eyebrow>Program</Eyebrow><Eyebrow>Annual $</Eyebrow><Eyebrow>Status</Eyebrow><span/>
      </div>
      {equipment.map((e, i) => {
        const s = getSite(e.siteId);
        const c = s ? getClient(s.clientId) : null;
        const p = getProgram(e.programId);
        const avail = availableKwFor(e);
        const annual = p ? e.kw * p.rate : 0;
        const offline = e.status === 'Enrolled' && avail === 0;
        const derated = e.status === 'Enrolled' && avail > 0 && avail < e.kw;
        return (
          <div key={e.id} style={{
            display: 'grid', gridTemplateColumns: '0.6fr 1.1fr 1.3fr 0.5fr 0.6fr 0.7fr 0.7fr 0.7fr 0.6fr', padding: '11px 14px',
            borderBottom: i < equipment.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
            fontFamily: sansT, fontSize: 13, alignItems: 'center',
          }}>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent, cursor: 'pointer' }}
              onClick={() => navigate('equipment', { equipmentId: e.id })}>{e.id}</span>
            <span style={{ color: T.ink }}>{e.make} <span style={{ color: T.ink3 }}>{e.model}</span></span>
            <span style={{ color: T.ink2, cursor: 'pointer' }} onClick={() => navigate('site', { siteId: s.id })}>
              <div>{s?.name.split('·').slice(-1)[0].trim()}</div>
              <div style={{ fontSize: 11, color: T.ink3 }}>{c?.short} · {s?.state} · {s?.iso}</div>
            </span>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{e.kw.toLocaleString()}</span>
            <span style={{ fontFamily: monoT, fontWeight: 700, color: offline ? T.err : (derated ? T.warn : T.ok) }}>
              {e.status === 'Enrolled' ? avail.toLocaleString() : '—'}
            </span>
            <span style={{ color: T.ink2, fontSize: 12 }}>{p ? `${p.iso} ${p.name}` : <span style={{ color: T.ink4 }}>—</span>}</span>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{annual ? fmt$(annual) : '—'}</span>
            <span><StatusForEquip status={e.status} /></span>
            <span style={{ textAlign: 'right' }}>
              {e.status === 'Enrolled'
                ? <Btn size="sm" onClick={() => navigate('equipment', { equipmentId: e.id })}>Open</Btn>
                : <Btn size="sm" kind="accent" onClick={() => setDrawer({ kind: 'enrollment', equipmentId: e.id })}>Enroll</Btn>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { EquipmentOverviewPage, EquipmentBucketPage, BucketTile, BucketIcon, bucketColor });
