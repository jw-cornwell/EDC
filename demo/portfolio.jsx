// EDC demo · Portfolio dashboard
// KPIs at top · US map (clickable choropleth) · Top sites table · Active enrollments preview.

function PortfolioPage() {
  const { persona, filters, navigate, personaFilteredSiteIds, fireEvent, liveEvent } = useApp();

  // Apply filters → equipment list
  const filteredEq = useMemo(() => {
    return EQUIPMENT.filter(e => {
      if (filters.equipType && e.type !== filters.equipType) return false;
      if (filters.status && e.status !== filters.status) return false;
      const site = getSite(e.siteId);
      if (!site) return false;
      if (filters.iso && site.iso !== filters.iso) return false;
      if (filters.state && site.state !== filters.state) return false;
      const client = getClient(site.clientId);
      if (filters.vertical && client?.vertical !== filters.vertical) return false;
      if (personaFilteredSiteIds && !personaFilteredSiteIds.has(site.id)) return false;
      return true;
    });
  }, [filters, personaFilteredSiteIds]);

  const stats = useMemo(() => {
    const eq = filteredEq;
    const enrolled = eq.filter(e => e.status === 'Enrolled');
    const sites = new Set(eq.map(e => e.siteId));
    const clients = new Set([...sites].map(sid => getSite(sid)?.clientId).filter(Boolean));
    const peakKw = [...sites].reduce((sum, sid) => sum + (getSite(sid)?.peakKw || 0), 0);
    const enrolledKw = enrolled.reduce((sum, e) => sum + (e.kw || 0), 0);
    const annualRev = enrolled.reduce((sum, e) => {
      const p = getProgram(e.programId);
      return sum + (p ? e.kw * p.rate : 0);
    }, 0);
    const clientShareRev = annualRev * 0.7;
    return {
      sites: sites.size, clients: clients.size,
      peakMw: peakKw / 1000, enrolledMw: enrolledKw / 1000,
      enrolledCount: enrolled.length,
      annualRev, clientShareRev,
    };
  }, [filteredEq]);

  // Dynamic scope label — follows client → site hierarchy based on filters.
  // PAM persona is always scoped to their assigned sites.
  let scope;
  if (persona === 'pam') {
    scope = `Jamie Torres · ${stats.sites} Assigned Sites`;
  } else {
    // Single client filtered? show client name. Otherwise "All N Clients".
    // State filter narrows sites but keeps client framing.
    const clientLabel = stats.clients === 1
      ? (getClient([...new Set(filteredEq.map(e => getSite(e.siteId)?.clientId))].filter(Boolean)[0])?.name || '1 Client')
      : `All ${stats.clients} Clients`;
    scope = `Demand Management · ${clientLabel}`;
  }
  const sub = `${scope} · ${stats.sites} ${stats.sites === 1 ? 'Site' : 'Sites'} · ${stats.enrolledMw.toFixed(1)} MW Enrolled`;

  return (
    <div>
      <TitleStrip
        eyebrow="Portfolio Overview"
        title={persona === 'pam' ? 'My Sites' : 'Portfolio'}
        sub={sub}
        actions={<>
          <Btn onClick={() => navigate('events')}>View events</Btn>
          <Btn kind="primary" icon="plus" onClick={() => useApp().setDrawer && useApp().setDrawer({ kind: 'onboarding' })}>Onboard client</Btn>
        </>}
      />

      {/* KPI tiles welded together */}
      <div style={{ padding: '16px 24px 0', background: T.bg }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', background: T.paper, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <KpiTile label="Total Sites"  value={stats.sites}   sub={`${stats.clients} clients`} clickable onClick={() => navigate('clients')} accent />
          <div style={{ borderLeft: `1px solid ${T.border}` }}>
            <KpiTile label="Peak Demand" value={stats.peakMw.toFixed(1)} sub="MW · estimated peak" />
          </div>
          <div style={{ borderLeft: `1px solid ${T.border}` }}>
            <KpiTile label="Avail. MW" value={stats.enrolledMw.toFixed(1)} sub={`${stats.enrolledCount} pieces enrolled`} />
          </div>
          <div style={{ borderLeft: `1px solid ${T.border}` }}>
            <KpiTile label="Active Enrollments" value={stats.enrolledCount} sub={`${filteredEq.filter(e => e.status === 'Pipeline').length} in pipeline`} clickable onClick={() => navigate('enrollment')} />
          </div>
          <div style={{ borderLeft: `1px solid ${T.border}` }}>
            <KpiTile label="Est. Annual Savings" value={fmt$M(stats.clientShareRev)} sub="client share · 70 %" delta="+8.2%" deltaUp />
          </div>
          <div style={{ borderLeft: `1px solid ${T.border}` }}>
            <KpiTile label="Total Clients" value={stats.clients} sub="under MSA" clickable onClick={() => navigate('clients')} />
          </div>
        </div>
      </div>

      {/* Map + side panel */}
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <Card title="Geographic distribution" eyebrow="Choropleth · color = MW enrolled · click a state to filter">
          <USMap filteredSiteIds={new Set(filteredEq.map(e => e.siteId))} />
        </Card>
        <Card title="Top sites by enrolled MW" eyebrow="Click to drill in" padding={0}>
          <TopSitesTable filteredEq={filteredEq} />
        </Card>
      </div>

      {/* Recent equipment table */}
      <div style={{ padding: '0 24px 32px' }}>
        <Card title="Equipment portfolio" eyebrow={`${filteredEq.length} pieces · click any row`} padding={0}>
          <EquipmentTable equipment={filteredEq.slice(0, 12)} />
        </Card>
      </div>
    </div>
  );
}

// ─── US Map (clickable, simplified state shapes) ──────────────
function USMap({ filteredSiteIds }) {
  const { filters, setFilters } = useApp();
  // State → MW enrolled for visible sites
  const stateMw = useMemo(() => {
    const map = {};
    EQUIPMENT.forEach(e => {
      if (e.status !== 'Enrolled') return;
      if (!filteredSiteIds.has(e.siteId)) return;
      const s = getSite(e.siteId);
      if (!s) return;
      map[s.state] = (map[s.state] || 0) + e.kw / 1000;
    });
    return map;
  }, [filteredSiteIds]);

  const maxMw = Math.max(...Object.values(stateMw), 1);
  const colorFor = mw => {
    if (!mw) return T.borderSoft;
    const t = Math.min(1, mw / maxMw);
    // Lerp from icedSoft → lime
    return `rgba(214, 239, 75, ${0.25 + 0.75 * t})`;
  };

  // Hand-placed state rectangles (rough US grid layout)
  const layout = [
    [['WA', 0], ['ID', 1], ['MT', 2], ['ND', 3], ['MN', 4], ['WI', 5], ['MI', 6], ['NY', 8], ['VT', 9], ['NH',10], ['ME',11]],
    [['OR', 0], ['NV', 1], ['WY', 2], ['SD', 3], ['IA', 4], ['IL', 5], ['IN', 6], ['OH', 7], ['PA', 8], ['NJ', 9], ['CT',10], ['MA',11]],
    [['CA', 0], ['UT', 1], ['CO', 2], ['NE', 3], ['MO', 4], ['KY', 5], ['WV', 6], ['VA', 7], ['MD', 8], ['DE', 9], ['RI',10]],
    [[null,0],  ['AZ', 1], ['NM', 2], ['KS', 3], ['AR', 4], ['TN', 5], ['NC', 6], ['SC', 7], [null, 8]],
    [[null,0],  [null,1],  [null,2],  ['OK', 3], ['LA', 4], ['MS', 5], ['AL', 6], ['GA', 7], ['FL', 8]],
    [[null,0],  [null,1],  [null,2],  ['TX', 3]],
  ];
  const boxW = 50, boxH = 38, gap = 3;
  const cols = 12;
  return (
    <svg viewBox={`0 0 ${cols * (boxW + gap)} ${(layout.length + 0.4) * (boxH + gap)}`} style={{ width: '100%', height: 360, display: 'block' }}>
      {layout.map((row, ri) => row.map(([code, ci]) => {
        if (!code) return null;
        const mw = stateMw[code] || 0;
        const fill = colorFor(mw);
        const stroke = filters.state === code ? T.accent : T.border;
        const strokeWidth = filters.state === code ? 2 : 1;
        const x = ci * (boxW + gap), y = ri * (boxH + gap);
        return (
          <g key={code} style={{ cursor: 'pointer' }} onClick={() => setFilters(f => ({ ...f, state: f.state === code ? null : code }))}>
            <rect x={x} y={y} width={boxW} height={boxH} rx={3} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
            <text x={x + boxW / 2} y={y + 14} textAnchor="middle" fontFamily={sansT} fontSize="10" fontWeight="700" fill={T.accent}>{code}</text>
            {mw > 0 && (
              <text x={x + boxW / 2} y={y + 28} textAnchor="middle" fontFamily={monoT} fontSize="9" fontWeight="600" fill={T.accent}>{mw.toFixed(1)} MW</text>
            )}
          </g>
        );
      }))}
      {/* Legend */}
      <g transform={`translate(${cols * (boxW + gap) - 200}, ${(layout.length + 0.1) * (boxH + gap)})`}>
        <text x="0" y="9" fontFamily={sansT} fontSize="9" fontWeight="600" fill={T.ink3} letterSpacing="0.08em">MW ENROLLED</text>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <rect key={i} x={70 + i * 22} y={2} width={20} height={10} fill={`rgba(214, 239, 75, ${0.25 + 0.75 * t})`} stroke={T.border} strokeWidth="0.5" />
        ))}
        <text x="68" y="11" textAnchor="end" fontFamily={monoT} fontSize="9" fill={T.ink3}>0</text>
        <text x="180" y="11" fontFamily={monoT} fontSize="9" fill={T.ink3}>{maxMw.toFixed(1)}</text>
      </g>
    </svg>
  );
}

// ─── Top sites table ──────────────────────────────────────────
function TopSitesTable({ filteredEq }) {
  const { navigate } = useApp();
  const bySite = useMemo(() => {
    const map = {};
    filteredEq.forEach(e => {
      if (e.status !== 'Enrolled') return;
      map[e.siteId] = (map[e.siteId] || 0) + (e.kw / 1000);
    });
    return Object.entries(map).map(([sid, mw]) => ({ site: getSite(sid), mw })).filter(r => r.site).sort((a, b) => b.mw - a.mw).slice(0, 6);
  }, [filteredEq]);

  if (bySite.length === 0) return <div style={{ padding: 20, fontSize: 12, color: T.ink3, fontFamily: sansT }}>No enrolled sites match the current filters.</div>;

  return (
    <div>
      {bySite.map((row, i) => (
        <div key={row.site.id} onClick={() => navigate('site', { siteId: row.site.id })} style={{
          display: 'grid', gridTemplateColumns: '24px 1fr auto auto', gap: 12, alignItems: 'center',
          padding: '10px 14px', borderBottom: i < bySite.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
          cursor: 'pointer', transition: 'background 120ms',
        }} onMouseEnter={e => e.currentTarget.style.background = T.borderSoft} onMouseLeave={e => e.currentTarget.style.background = T.paper}>
          <span style={{ fontFamily: monoT, fontSize: 11, color: T.ink4, fontWeight: 600 }}>{i + 1}</span>
          <div>
            <div style={{ fontFamily: sansT, fontSize: 12.5, fontWeight: 600, color: T.ink }}>{row.site.name}</div>
            <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3 }}>{row.site.city}, {row.site.state} · {row.site.iso}</div>
          </div>
          <span style={{ fontFamily: monoT, fontSize: 13, color: T.accent, fontWeight: 700 }}>{row.mw.toFixed(1)} MW</span>
          <Icon kind="chevron" size={11} color={T.ink4} />
        </div>
      ))}
    </div>
  );
}

// ─── Equipment table (used here + on site page) ──────────────
function EquipmentTable({ equipment, showSite = true }) {
  const { navigate, setDrawer } = useApp();
  const rowCols = showSite ? '0.6fr 0.6fr 1.4fr 1.2fr 0.9fr 0.6fr 0.9fr 0.4fr' : '0.6fr 0.6fr 1.4fr 0.9fr 0.6fr 0.9fr 0.4fr';
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: rowCols, padding: '8px 14px', background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
        <Eyebrow>Tag</Eyebrow>
        <Eyebrow>Type</Eyebrow>
        <Eyebrow>Equipment</Eyebrow>
        {showSite && <Eyebrow>Site</Eyebrow>}
        <Eyebrow>Program</Eyebrow>
        <Eyebrow>kW</Eyebrow>
        <Eyebrow>Status</Eyebrow>
        <span />
      </div>
      {equipment.map((e, i) => {
        const s = getSite(e.siteId);
        const p = getProgram(e.programId);
        return (
          <div key={e.id} onClick={() => navigate('equipment', { equipmentId: e.id })} style={{
            display: 'grid', gridTemplateColumns: rowCols, padding: '11px 14px',
            borderBottom: i < equipment.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
            fontSize: 12.5, fontFamily: sansT, alignItems: 'center', cursor: 'pointer',
            transition: 'background 120ms',
          }} onMouseEnter={ev => ev.currentTarget.style.background = T.borderSoft} onMouseLeave={ev => ev.currentTarget.style.background = T.paper}>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{e.id}</span>
            <span style={{ color: T.ink2 }}>{e.type}</span>
            <span style={{ color: T.ink }}>{e.make} {e.model}</span>
            {showSite && <span style={{ color: T.ink3, fontSize: 12 }}>{s?.name.split('·').slice(-1)[0].trim()}</span>}
            <span style={{ color: T.ink2 }}>{p ? `${p.iso} ${p.name}` : '—'}</span>
            <span style={{ fontFamily: monoT, fontWeight: 600, color: T.accent }}>{e.kw.toLocaleString()}</span>
            <StatusForEquip status={e.status} />
            {e.status !== 'Enrolled' && (
              <Btn size="sm" kind="accent" onClick={ev => { ev.stopPropagation(); setDrawer({ kind: 'enrollment', equipmentId: e.id }); }}>Enroll</Btn>
            )}
            {e.status === 'Enrolled' && <span />}
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { PortfolioPage, USMap, EquipmentTable });
