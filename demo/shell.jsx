// EDC demo shell — header, sidebar, event banner, router state.
// All interactive — header dropdowns, persona switch, fire-event,
// notifications fly out, sidebar nav rewires routes.

const { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } = React;

// ─── Tiny SVG icon set ────────────────────────────────────────
const Icon = ({ kind, size = 16, color = 'currentColor', strokeWidth = 1.6 }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'home':     return (<svg {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>);
    case 'pin':      return (<svg {...p}><path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>);
    case 'building': return (<svg {...p}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2M10 21v-4h4v4"/></svg>);
    case 'bolt':     return (<svg {...p}><path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z"/></svg>);
    case 'event':    return (<svg {...p}><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 9h18M8 3v4M16 3v4"/><circle cx="12" cy="14" r="2" fill={color}/></svg>);
    case 'plus':     return (<svg {...p}><path d="M12 5v14M5 12h14"/></svg>);
    case 'list':     return (<svg {...p}><path d="M3 6h18M3 12h18M3 18h18"/></svg>);
    case 'search':   return (<svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>);
    case 'chevron':  return (<svg {...p}><path d="M9 6l6 6-6 6"/></svg>);
    case 'chev-d':   return (<svg {...p}><path d="M6 9l6 6 6-6"/></svg>);
    case 'gear':     return (<svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>);
    case 'bell':     return (<svg {...p}><path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>);
    case 'check':    return (<svg {...p}><path d="M5 12l4 4L19 6"/></svg>);
    case 'x':        return (<svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>);
    case 'flame':    return (<svg {...p}><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-1 5 3 5 4-3 4-5c0-3-4-5-4-5zM7 14a5 5 0 0 0 10 0c0 5-2 8-5 8s-5-3-5-8z"/></svg>);
    case 'arrow-r':  return (<svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>);
    case 'sun':      return (<svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>);
    case 'moon':     return (<svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>);
    case 'logo':     return (
      <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="3" fill={T.lime}/><text x="12" y="17" fontFamily={sansT} fontSize="14" fontWeight="800" fill={T.accent} textAnchor="middle">E</text></svg>
    );
    default:         return (<svg {...p}><circle cx="12" cy="12" r="9"/></svg>);
  }
};

// ─── App context (router + persona + live event) ─────────────
const AppCtx = createContext(null);

function useApp() { return useContext(AppCtx); }

function AppProvider({ children }) {
  const [route, setRoute] = useState({ name: 'portfolio', params: {} });
  const [persona, setPersona] = useState('demand'); // 'demand' or 'pam'
  const [theme, setThemeState] = useState(() => {
    let saved = 'light';
    try { saved = localStorage.getItem('edc-theme') || 'light'; } catch {}
    applyTheme(saved);
    return saved;
  });
  // Mutate T synchronously during render so the SAME render cycle that
  // flipped the state also propagates new token values to all child
  // inline styles (useEffect would be too late — DOM is already committed).
  applyTheme(theme);
  useEffect(() => {
    try { localStorage.setItem('edc-theme', theme); } catch {}
  }, [theme]);
  const setTheme = useCallback((t) => setThemeState(t === 'dark' ? 'dark' : 'light'), []);
  const toggleTheme = useCallback(() => setThemeState(t => t === 'dark' ? 'light' : 'dark'), []);
  const [liveEvent, setLiveEvent] = useState(null);
  const [events, setEvents] = useState(SEED_EVENTS);
  const [enrollments, setEnrollments] = useState([]); // submitted enrollments
  const [clients, setClients] = useState(CLIENTS);    // can grow via onboarding
  const [drawer, setDrawer] = useState(null);  // { kind: 'enrollment', equipmentId } | { kind:'onboarding' }
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ iso: null, state: null, vertical: null, equipType: null, status: null });

  // Persona changes default filter scope (PAM = "My Sites"-only)
  const personaFilteredSiteIds = useMemo(
    () => persona === 'pam' ? new Set(pamSiteIds()) : null,
    [persona]
  );

  // Auto-tick the live event perf (drift slightly to feel alive)
  useEffect(() => {
    if (!liveEvent) return;
    const t = setInterval(() => {
      setLiveEvent(le => {
        if (!le) return le;
        // Random walk performance between 0.92 and 1.02
        const drift = (Math.random() - 0.5) * 0.008;
        const newPerf = Math.max(0.90, Math.min(1.03, le.perf + drift));
        const newSites = le.sites.map(s => {
          if (s.perf == null) return s;
          const sd = (Math.random() - 0.5) * 0.012;
          return { ...s, perf: Math.max(0.85, Math.min(1.05, s.perf + sd)), actualKw: Math.round(s.nomKw * (s.perf + sd)) };
        });
        return { ...le, perf: newPerf, sites: newSites };
      });
    }, 2400);
    return () => clearInterval(t);
  }, [!!liveEvent]);

  const fireEvent = useCallback(() => {
    const now = new Date();
    const start = now.toTimeString().slice(0, 5);
    const end = new Date(now.getTime() + 3 * 60 * 60 * 1000).toTimeString().slice(0, 5);
    const live = {
      ...LIVE_EVENT_TEMPLATE,
      startedAt: start,
      endsAt: end,
      perf: 0.964,
    };
    setLiveEvent(live);
    setToast({ kind: 'event', text: `ERCOT 4CP event called · 14 sites · ${fmtMw(28.4)} · started ${start} CT` });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const endLiveEvent = useCallback(() => {
    if (!liveEvent) return;
    // Settle into events list
    const settled = {
      id: 'evt-' + Date.now(),
      iso: liveEvent.iso,
      program: liveEvent.program,
      date: new Date().toISOString().slice(0, 10),
      start: liveEvent.startedAt,
      end: new Date().toTimeString().slice(0, 5),
      siteCount: liveEvent.siteCount,
      calledMw: liveEvent.calledMw,
      perf: liveEvent.perf,
      status: 'Settled',
    };
    setEvents(prev => [settled, ...prev]);
    setLiveEvent(null);
    setToast({ kind: 'ok', text: `Event ended · ${fmtPct(settled.perf)} performance · settlement queued` });
    setTimeout(() => setToast(null), 4000);
    setRoute({ name: 'event-detail', params: { eventId: settled.id } });
  }, [liveEvent]);

  const submitEnrollment = useCallback((payload) => {
    setEnrollments(prev => [...prev, { ...payload, submittedAt: Date.now(), id: 'enr-' + Date.now() }]);
    setToast({ kind: 'ok', text: `Enrollment submitted · ${payload.equipmentId} → ${payload.programName}` });
    setTimeout(() => setToast(null), 4000);
    setDrawer(null);
  }, []);

  const submitOnboarding = useCallback((payload) => {
    setClients(prev => [...prev, { ...payload, id: 'cli-' + Date.now(), pamOwner: false }]);
    setToast({ kind: 'ok', text: `Client onboarded · ${payload.name} · ${payload.siteCount} sites · DocuSign sent` });
    setTimeout(() => setToast(null), 4500);
    setDrawer(null);
    setRoute({ name: 'portfolio', params: {} });
  }, []);

  const navigate = useCallback((name, params = {}) => {
    setRoute({ name, params });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const value = {
    route, navigate,
    persona, setPersona,
    theme, setTheme, toggleTheme,
    liveEvent, fireEvent, endLiveEvent,
    events, enrollments, clients,
    drawer, setDrawer,
    toast, setToast,
    filters, setFilters,
    personaFilteredSiteIds,
    submitEnrollment, submitOnboarding,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// ─── Header ───────────────────────────────────────────────────
function Header() {
  const { persona, setPersona, liveEvent, fireEvent, navigate, route, theme, toggleTheme } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);

  return (
    <header style={{ height: 56, background: T.ocean, color: T.onOcean, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 18, fontFamily: sansT, flexShrink: 0, position: 'relative', zIndex: 30, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('portfolio')}>
        <Icon kind="logo" size={26} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' }}>ENFRA</span>
          <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.lime, fontWeight: 600 }}>Demand Center</span>
        </div>
      </div>

      <Breadcrumb route={route} navigate={navigate} />

      <div style={{ flex: 1 }} />

      {/* Live event indicator in header (small) */}
      {liveEvent && (
        <button onClick={() => navigate('event-detail', { eventId: 'live' })} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
          background: 'rgba(214,239,75,0.16)', border: `1px solid ${T.lime}`, borderRadius: 4,
          fontSize: 11, color: T.lime, fontWeight: 600, letterSpacing: '0.06em',
          fontFamily: sansT, cursor: 'pointer',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: T.lime, boxShadow: '0 0 0 3px rgba(214,239,75,0.25)', animation: 'edcPulse 1.6s ease-in-out infinite' }} />
          1 EVENT ACTIVE · {liveEvent.iso} {liveEvent.program}
        </button>
      )}

      {/* Fire event button (demo only) */}
      {!liveEvent && (
        <button onClick={fireEvent} title="Demo: simulate a DR event being called by the ISO" style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
          background: 'transparent', border: `1px solid rgba(214,239,75,0.45)`,
          borderRadius: 4, fontSize: 11, color: T.lime, fontWeight: 600,
          letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: sansT, cursor: 'pointer',
        }}>
          <Icon kind="flame" size={13} color={T.lime} />
          Fire test event
        </button>
      )}

      {/* Persona switch */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setPersonaOpen(o => !o)} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px',
          background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.15)`,
          borderRadius: 4, fontFamily: sansT, fontSize: 12, color: '#fff', cursor: 'pointer',
        }}>
          <span style={{ width: 22, height: 22, borderRadius: 999, background: T.steel, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
            {persona === 'pam' ? 'JT' : 'SR'}
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600 }}>{persona === 'pam' ? 'Jamie Torres' : 'Sarah Reyes'}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.62)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{persona === 'pam' ? 'Project Asset Mgr' : 'Demand Mgmt'}</span>
          </span>
          <Icon kind="chev-d" size={12} color="rgba(255,255,255,0.6)" />
        </button>
        {personaOpen && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: T.paper, border: `1px solid ${T.border}`, borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', minWidth: 260, padding: 6, zIndex: 50 }}>
            <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Switch persona</div>
            {[
              { id: 'demand', name: 'Sarah Reyes', title: 'Demand Mgmt · sees all clients', initials: 'SR' },
              { id: 'pam',    name: 'Jamie Torres', title: 'PAM · scoped to assigned sites', initials: 'JT' },
            ].map(p => (
              <button key={p.id} onClick={() => { setPersona(p.id); setPersonaOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', background: persona === p.id ? T.icedSoft : 'transparent',
                border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: sansT, textAlign: 'left',
              }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, background: T.steel, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{p.initials}</span>
                <span style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>{p.title}</div>
                </span>
                {persona === p.id && <Icon kind="check" size={14} color={T.accent} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-label="Toggle theme" style={{
        background: 'transparent', border: 'none', cursor: 'pointer', padding: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon kind={theme === 'dark' ? 'sun' : 'moon'} size={16} color="rgba(255,255,255,0.85)" />
      </button>

      <button onClick={() => setNotifOpen(o => !o)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, position: 'relative' }}>
        <Icon kind="bell" size={16} color="rgba(255,255,255,0.85)" />
        {liveEvent && <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: 999, background: T.lime }} />}
      </button>
    </header>
  );
}

// Breadcrumb derived from route
function Breadcrumb({ route, navigate }) {
  const crumbs = [];
  crumbs.push({ label: 'Portfolio', go: () => navigate('portfolio') });
  if (route.name === 'client') {
    const c = getClient(route.params.clientId);
    crumbs.push({ label: c?.short || 'Client' });
  } else if (route.name === 'site') {
    const s = getSite(route.params.siteId);
    const c = s ? getClient(s.clientId) : null;
    if (c) crumbs.push({ label: c.short, go: () => navigate('client', { clientId: c.id }) });
    if (s) crumbs.push({ label: s.name.split('·').slice(-1)[0].trim() });
  } else if (route.name === 'equipment') {
    const e = getEquipment(route.params.equipmentId);
    const s = e ? getSite(e.siteId) : null;
    const c = s ? getClient(s.clientId) : null;
    if (c) crumbs.push({ label: c.short, go: () => navigate('client', { clientId: c.id }) });
    if (s) crumbs.push({ label: s.name.split('·').slice(-1)[0].trim(), go: () => navigate('site', { siteId: s.id }) });
    if (e) crumbs.push({ label: e.id });
  } else if (route.name === 'events') {
    crumbs[0] = { label: 'Portfolio', go: () => navigate('portfolio') };
    crumbs.push({ label: 'DR Events' });
  } else if (route.name === 'event-detail') {
    crumbs[0] = { label: 'Portfolio', go: () => navigate('portfolio') };
    crumbs.push({ label: 'DR Events', go: () => navigate('events') });
    crumbs.push({ label: route.params.eventId === 'live' ? 'Live event' : route.params.eventId });
  } else if (route.name === 'enrollment') {
    crumbs.push({ label: 'Enrollment Pipeline' });
  } else if (route.name === 'clients') {
    crumbs.push({ label: 'Clients' });
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 28, fontSize: 13, color: 'rgba(255,255,255,0.72)', fontFamily: sansT }}>
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>}
          {c.go ? (
            <span style={{ color: 'rgba(255,255,255,0.72)', cursor: 'pointer' }} onClick={c.go} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.72)'}>{c.label}</span>
          ) : (
            <span style={{ color: '#fff' }}>{c.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────
function Sidebar() {
  const { route, navigate, persona } = useApp();
  const items = [
    { k: 'portfolio',  label: 'Portfolio',  icon: 'home',     active: route.name === 'portfolio' },
    { k: 'mysites',    label: 'My Sites',   icon: 'pin',      active: false, hidden: persona !== 'pam' },
    { k: 'clients',    label: 'Clients',    icon: 'building', active: route.name === 'clients' || route.name === 'client' || route.name === 'site' },
    { k: 'equipment',  label: 'Equipment',  icon: 'bolt',     active: route.name === 'equipment' || route.name === 'equipment-overview' || route.name === 'equipment-bucket' },
    { k: 'events',     label: 'DR Events',  icon: 'event',    active: route.name === 'events' || route.name === 'event-detail' },
    { k: 'enrollment', label: 'Enrollment', icon: 'plus',     active: route.name === 'enrollment' },
    { k: 'reports',    label: 'Reports',    icon: 'list',     active: false },
  ].filter(i => !i.hidden);

  return (
    <aside style={{ width: 208, background: T.paper, borderRight: `1px solid ${T.border}`, padding: '12px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      {items.map(it => (
        <div key={it.k} onClick={() => {
          if (it.k === 'portfolio') navigate('portfolio');
          else if (it.k === 'clients') navigate('clients');
          else if (it.k === 'equipment') navigate('equipment-overview');
          else if (it.k === 'events') navigate('events');
          else if (it.k === 'enrollment') navigate('enrollment');
          else if (it.k === 'mysites') navigate('portfolio');
        }} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px',
          borderLeft: it.active ? `3px solid ${T.steel}` : '3px solid transparent',
          background: it.active ? 'rgba(85,127,127,0.08)' : 'transparent',
          color: it.active ? T.accent : T.ink3,
          fontFamily: sansT, fontSize: 13.5, fontWeight: it.active ? 600 : 500,
          cursor: 'pointer',
        }} onMouseEnter={e => { if (!it.active) e.currentTarget.style.background = T.borderSoft; }} onMouseLeave={e => { if (!it.active) e.currentTarget.style.background = 'transparent'; }}>
          <Icon kind={it.icon} size={16} color={it.active ? T.accent : T.ink3} />
          <span>{it.label}</span>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ padding: '12px 16px', fontFamily: sansT, fontSize: 10.5, color: T.ink4, borderTop: `1px solid ${T.border}` }}>
        <div style={{ fontWeight: 600, color: T.ink3 }}>EDC v0.4.2-demo</div>
        <div style={{ marginTop: 2 }}>Connected · SkySpark, eWay</div>
      </div>
    </aside>
  );
}

// ─── Live event banner (page-level) ───────────────────────────
function EventBanner() {
  const { liveEvent, navigate, endLiveEvent } = useApp();
  if (!liveEvent) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 24px', background: T.lime, borderBottom: `1px solid ${T.onLime}`, fontFamily: sansT, flexShrink: 0 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.onLime }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: T.onLime, boxShadow: '0 0 0 3px rgba(9,43,36,0.18)', animation: 'edcPulse 1.6s ease-in-out infinite' }} />
        Live Event
      </span>
      <span style={{ fontSize: 13, color: T.onLime }}>
        {liveEvent.iso} {liveEvent.program} · {liveEvent.siteCount} sites · <span style={{ fontFamily: monoT, fontWeight: 700 }}>{fmtMw(liveEvent.calledMw)}</span> called · started {liveEvent.startedAt} CT · ends ~{liveEvent.endsAt} CT
      </span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 12, color: T.onLime, display: 'flex', alignItems: 'center', gap: 8 }}>
        Performance
        <span style={{ fontFamily: monoT, fontWeight: 700, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{fmtPct(liveEvent.perf)}</span>
      </span>
      <button onClick={() => navigate('event-detail', { eventId: 'live' })} style={{ padding: '6px 14px', background: T.onLime, color: '#fff', border: 'none', borderRadius: 4, fontFamily: sansT, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        Open Event →
      </button>
      <button onClick={endLiveEvent} style={{ padding: '6px 12px', background: 'transparent', color: T.onLime, border: `1px solid ${T.onLime}`, borderRadius: 4, fontFamily: sansT, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>
        End event (demo)
      </button>
    </div>
  );
}

// ─── Toast (transient) ────────────────────────────────────────
function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const bg = toast.kind === 'event' ? T.lime : toast.kind === 'ok' ? T.ocean : T.ocean;
  const fg = toast.kind === 'event' ? T.onLime : T.onOcean;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      padding: '12px 18px', background: bg, color: fg, borderRadius: 6,
      fontFamily: sansT, fontSize: 13, fontWeight: 600, zIndex: 200,
      boxShadow: '0 8px 24px rgba(0,0,0,0.20)', display: 'flex', alignItems: 'center', gap: 10,
      animation: 'edcSlideUp 0.32s cubic-bezier(.2,.8,.2,1)',
    }}>
      <Icon kind={toast.kind === 'event' ? 'flame' : 'check'} size={16} color={fg} />
      {toast.text}
    </div>
  );
}

// ─── Shared atoms (lifted from mid-fi) ────────────────────────
const Eyebrow = ({ children, style }) => (
  <div style={{ fontFamily: sansT, fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: T.ink3, ...style }}>{children}</div>
);
const Num = ({ children, size = 24, color, style }) => (
  <span style={{ fontFamily: monoT, fontWeight: 600, fontSize: size, lineHeight: 1.05, color: color || T.accent, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', ...style }}>{children}</span>
);
const StatusPill = ({ kind = 'neutral', children, style }) => {
  const map = {
    ok: [T.okBg, T.ok], warn: [T.warnBg, T.warn], err: [T.errBg, T.err],
    info: [T.infoBg, T.info], neutral: [T.borderSoft, T.ink2],
    accent: [T.lime, T.onLime],
  };
  const [bg, fg] = map[kind] || map.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999, background: bg, color: fg,
      fontFamily: sansT, fontSize: 11, fontWeight: 600, letterSpacing: '0.02em', ...style,
    }}>{children}</span>
  );
};
const VerticalChip = ({ vertical }) => {
  const map = {
    Federal:    [T.iced, T.accent],
    Healthcare: ['rgba(214,239,75,0.30)', T.accent],
    'Higher Ed':['rgba(85,127,127,0.14)', T.steel],
    Municipal:  ['rgba(211,204,196,0.55)', T.accent],
  };
  const [bg, fg] = map[vertical] || [T.borderSoft, T.ink2];
  return <span style={{ padding: '1px 8px', borderRadius: 999, background: bg, color: fg, fontFamily: sansT, fontSize: 11, fontWeight: 600 }}>{vertical}</span>;
};
const StatusForEquip = ({ status }) => {
  const m = { 'Enrolled': 'ok', 'Pipeline': 'neutral', 'Pending review': 'warn' };
  return <StatusPill kind={m[status] || 'neutral'}>{status}</StatusPill>;
};
const Btn = ({ children, kind = 'default', size = 'md', icon, onClick, style, disabled }) => {
  const sty = {
    default: { background: T.paper, color: T.ink2, border: `1px solid ${T.border2}` },
    primary: { background: T.ocean, color: T.onOcean, border: `1px solid ${T.accent}` },
    accent:  { background: T.lime, color: T.onLime, border: `1px solid ${T.onLime}` },
    ghost:   { background: 'transparent', color: T.ink2, border: '1px solid transparent' },
    danger:  { background: T.paper, color: T.err, border: `1px solid ${T.border2}` },
  }[kind];
  const pad = size === 'sm' ? '5px 10px' : '7px 14px';
  const fs = size === 'sm' ? 12 : 12.5;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: pad, borderRadius: 4, fontFamily: sansT, fontSize: fs, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      opacity: disabled ? 0.5 : 1, ...sty, ...style,
    }}>
      {icon && <Icon kind={icon} size={fs} color={kind === 'primary' ? '#fff' : (kind === 'accent' ? T.onLime : T.ink2)} />}
      {children}
    </button>
  );
};
const Card = ({ title, eyebrow, action, children, style, padding = 16, noBorder }) => (
  <div style={{ background: T.paper, border: noBorder ? 'none' : `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', ...style }}>
    {(title || eyebrow) && (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${T.border}` }}>
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {title && <div style={{ fontFamily: sansT, fontSize: 13, fontWeight: 600, color: T.ink }}>{title}</div>}
        </div>
        {action}
      </div>
    )}
    <div style={{ padding }}>{children}</div>
  </div>
);
const KpiTile = ({ label, value, sub, accent, delta, deltaUp, clickable, onClick }) => (
  <div onClick={onClick} style={{
    padding: '14px 16px', background: T.paper, position: 'relative',
    borderLeft: accent ? `3px solid ${T.lime}` : '3px solid transparent',
    cursor: clickable || onClick ? 'pointer' : 'default',
    transition: 'background 120ms',
  }} onMouseEnter={e => { if (onClick) e.currentTarget.style.background = T.borderSoft; }} onMouseLeave={e => { if (onClick) e.currentTarget.style.background = T.paper; }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {delta && (
          <span style={{ fontFamily: monoT, fontSize: 10, color: deltaUp ? T.ok : T.ink3, fontWeight: 600 }}>
            {deltaUp ? '↑' : '↓'} {delta}
          </span>
        )}
        {(clickable || onClick) && <Icon kind="chevron" size={11} color={T.ink4} />}
      </div>
    </div>
    <div style={{ marginTop: 2 }}><Num size={26}>{value}</Num></div>
    <div style={{ fontFamily: sansT, fontSize: 11, color: T.ink3, marginTop: 2 }}>{sub}</div>
  </div>
);

// ─── Filter bar (interactive) ─────────────────────────────────
function FilterBar() {
  const { filters, setFilters, persona } = useApp();
  const [open, setOpen] = useState(null);

  const dropdowns = [
    { key: 'iso',       label: 'ISO',         opts: ['ERCOT', 'PJM', 'CAISO', 'NYISO', 'ISO-NE'], width: 110 },
    { key: 'state',     label: 'State',       opts: ['TX', 'CA', 'IL', 'NY', 'MA'], width: 100 },
    { key: 'vertical',  label: 'Client Type', opts: ['Healthcare', 'Higher Ed', 'Federal', 'Municipal'], width: 130 },
    { key: 'equipType', label: 'Equipment',   opts: ['BESS', 'Chiller', 'HP Chiller', 'Genset', 'AHU'], width: 130 },
    { key: 'status',    label: 'Status',      opts: ['Enrolled', 'Pipeline', 'Pending review'], width: 130 },
  ];

  const activeChips = Object.entries(filters).filter(([k, v]) => v != null);

  return (
    <div style={{ background: T.paper, borderBottom: `1px solid ${T.border}`, flexShrink: 0, position: 'relative', zIndex: 5 }}>
      <div style={{ display: 'flex', gap: 8, padding: '11px 22px', alignItems: 'center' }}>
        <button onClick={() => window.dispatchEvent(new Event('edc-open-search'))} style={{
          flex: '1 1 280px', maxWidth: 340,
          display: 'flex', alignItems: 'center', gap: 8,
          border: `1px solid ${T.border2}`, borderRadius: 4, padding: '6px 10px', background: T.paper,
          cursor: 'pointer', textAlign: 'left',
        }} onMouseEnter={e => e.currentTarget.style.borderColor = T.accent} onMouseLeave={e => e.currentTarget.style.borderColor = T.border2}>
          <Icon kind="search" size={14} color={T.ink4} />
          <span style={{ fontFamily: sansT, fontSize: 13, color: T.ink4 }}>Search clients, sites, equipment…</span>
          <span style={{ marginLeft: 'auto', fontFamily: monoT, fontSize: 10, color: T.ink4, border: `1px solid ${T.border}`, borderRadius: 3, padding: '1px 5px' }}>⌘K</span>
        </button>
        {dropdowns.map(d => {
          const v = filters[d.key];
          const isOpen = open === d.key;
          return (
            <div key={d.key} style={{ position: 'relative' }}>
              <button onClick={() => setOpen(isOpen ? null : d.key)} style={{
                width: d.width, padding: '5px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
                border: `1px solid ${v ? T.accent : T.border2}`, borderRadius: 4,
                background: v ? T.icedSoft : T.paper,
                fontFamily: sansT, fontSize: 13, color: T.ink, cursor: 'pointer',
              }}>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: T.ink3 }}>{d.label}</span>
                  <span style={{ fontSize: 12 }}>{v || (d.key === 'status' ? 'All Statuses' : d.key === 'equipType' ? 'All Equipment' : d.key === 'vertical' ? 'All Client Types' : d.key === 'state' ? 'All States' : d.key === 'iso' ? 'All ISOs' : `All ${d.label.toLowerCase()}s`)}</span>
                </span>
                <Icon kind="chev-d" size={11} color={T.ink3} />
              </button>
              {isOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: T.paper, border: `1px solid ${T.border}`, borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: d.width, padding: 4, zIndex: 50 }}>
                  <div onClick={() => { setFilters(f => ({ ...f, [d.key]: null })); setOpen(null); }} style={{ padding: '7px 10px', fontFamily: sansT, fontSize: 12.5, color: T.ink2, cursor: 'pointer', borderRadius: 4 }}>{d.key === 'status' ? 'All Statuses' : d.key === 'equipType' ? 'All Equipment' : d.key === 'vertical' ? 'All Client Types' : d.key === 'state' ? 'All States' : d.key === 'iso' ? 'All ISOs' : `All ${d.label.toLowerCase()}s`}</div>
                  {d.opts.map(o => (
                    <div key={o} onClick={() => { setFilters(f => ({ ...f, [d.key]: o })); setOpen(null); }} style={{ padding: '7px 10px', fontFamily: sansT, fontSize: 12.5, color: T.ink, cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, background: v === o ? T.icedSoft : 'transparent' }}>
                      {v === o && <Icon kind="check" size={12} color={T.accent} />}
                      <span style={{ marginLeft: v === o ? 0 : 20 }}>{o}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ flex: 1 }} />
      </div>
      {(activeChips.length > 0 || persona === 'pam') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 22px 11px', flexWrap: 'wrap' }}>
          <Eyebrow style={{ marginRight: 4 }}>Filters</Eyebrow>
          {persona === 'pam' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 4px 3px 10px', borderRadius: 999,
              background: T.lime, color: T.accent, border: `1px solid ${T.accent}`,
              fontFamily: sansT, fontSize: 11, fontWeight: 600,
            }}>
              <span style={{ color: T.ink3, fontWeight: 500 }}>Scope:</span>
              <span>My Sites · {pamSiteIds().length}</span>
            </span>
          )}
          {activeChips.map(([k, v]) => (
            <span key={k} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 4px 3px 10px', borderRadius: 999,
              background: T.icedSoft, color: T.accent, border: `1px solid ${T.border}`,
              fontFamily: sansT, fontSize: 11, fontWeight: 600,
            }}>
              <span style={{ color: T.ink3, fontWeight: 500 }}>{dropdowns.find(d => d.key === k)?.label}:</span>
              <span>{v}</span>
              <span onClick={() => setFilters(f => ({ ...f, [k]: null }))} style={{ width: 16, height: 16, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: T.ink3, cursor: 'pointer', fontSize: 11 }}>×</span>
            </span>
          ))}
          {activeChips.length > 0 && <span onClick={() => setFilters({ iso: null, state: null, vertical: null, equipType: null, status: null })} style={{ marginLeft: 4, fontFamily: sansT, fontSize: 11, color: T.steel, textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Clear all</span>}
        </div>
      )}
    </div>
  );
}

// ─── Title strip (page header bar) ───────────────────────────
const TitleStrip = ({ eyebrow, title, sub, actions }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '20px 24px 16px', background: T.paper, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
    <div>
      {eyebrow && <Eyebrow style={{ marginBottom: 4 }}>{eyebrow}</Eyebrow>}
      <h1 style={{ margin: 0, fontFamily: sansT, fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', color: T.ink }}>{title}</h1>
      {sub && <div style={{ fontSize: 12.5, color: T.ink3, marginTop: 5 }}>{sub}</div>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
  </div>
);

Object.assign(window, {
  AppCtx, AppProvider, useApp,
  Header, Sidebar, EventBanner, Toast, FilterBar, TitleStrip,
  Icon, Eyebrow, Num, StatusPill, VerticalChip, StatusForEquip, Btn, Card, KpiTile,
});
