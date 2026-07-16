// EDC demo · Command palette (⌘K) — fuzzy search across clients/sites/equipment/programs/actions

const { useState: useStateS, useEffect: useEffectS, useMemo: useMemoS, useRef: useRefS } = React;

function SearchPalette() {
  const { navigate, setDrawer } = useApp();
  const [open, setOpen] = useStateS(false);
  const [q, setQ] = useStateS('');
  const [active, setActive] = useStateS(0);
  const inputRef = useRefS(null);

  // Open with ⌘K / Ctrl+K · close with Esc
  useEffectS(() => {
    const onKey = (e) => {
      const cmdK = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K');
      if (cmdK) { e.preventDefault(); setOpen(o => !o); return; }
      if (e.key === 'Escape' && open) { e.preventDefault(); setOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Listen for the header search-box click (sets a global event)
  useEffectS(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('edc-open-search', onOpen);
    return () => window.removeEventListener('edc-open-search', onOpen);
  }, []);

  useEffectS(() => {
    if (open) {
      setQ(''); setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // Build searchable index
  const index = useMemoS(() => {
    const out = [];
    CLIENTS.forEach(c => out.push({
      kind: 'client', id: c.id,
      label: c.name, sub: `${c.vertical} · ${c.region} · ${c.primaryISO} · ${sitesForClient(c.id).length} sites`,
      tokens: [c.name, c.short, c.vertical, c.region, c.primaryISO].join(' ').toLowerCase(),
      go: () => navigate('client', { clientId: c.id }),
    }));
    SITES.forEach(s => {
      const c = getClient(s.clientId);
      out.push({
        kind: 'site', id: s.id,
        label: s.name, sub: `${s.city}, ${s.state} · ${s.utility} · ${s.iso} · ${s.peakKw.toLocaleString()} kW peak`,
        tokens: [s.name, s.city, s.state, s.utility, s.iso, s.esiId, c?.name, c?.short].join(' ').toLowerCase(),
        go: () => navigate('site', { siteId: s.id }),
      });
    });
    EQUIPMENT.forEach(e => {
      const s = getSite(e.siteId); const c = s ? getClient(s.clientId) : null;
      out.push({
        kind: 'equipment', id: e.id,
        label: `${e.id} · ${e.make} ${e.model}`,
        sub: `${e.type} · ${e.kw.toLocaleString()} kW · ${s?.name} · ${e.status}`,
        tokens: [e.id, e.make, e.model, e.type, s?.name, c?.name].join(' ').toLowerCase(),
        go: () => navigate('equipment', { equipmentId: e.id }),
      });
    });
    PROGRAMS.forEach(p => out.push({
      kind: 'program', id: p.id,
      label: `${p.iso} ${p.name}`, sub: `${p.desc} · $${p.rate} ${p.unit}`,
      tokens: [p.iso, p.name, p.desc].join(' ').toLowerCase(),
      go: () => navigate('portfolio'),
    }));
    // Actions
    out.push({ kind: 'action', id: 'a-portfolio',  label: 'Go to Portfolio',         sub: 'Dashboard · KPIs · map',   tokens: 'portfolio dashboard home', go: () => navigate('portfolio') });
    out.push({ kind: 'action', id: 'a-clients',    label: 'Go to Clients',           sub: 'Client portfolio list',    tokens: 'clients list',          go: () => navigate('clients') });
    out.push({ kind: 'action', id: 'a-events',     label: 'Go to DR Events',         sub: 'Event log · settlements',  tokens: 'events dr events log',  go: () => navigate('events') });
    out.push({ kind: 'action', id: 'a-enrollment', label: 'Go to Enrollment',        sub: 'Pipeline · ready to enroll', tokens: 'enrollment pipeline', go: () => navigate('enrollment') });
    out.push({ kind: 'action', id: 'a-onboard',    label: 'Onboard new client',      sub: '6-step wizard',            tokens: 'onboard new client wizard', go: () => setDrawer({ kind: 'onboarding' }) });
    return out;
  }, [navigate, setDrawer]);

  // Filter
  const results = useMemoS(() => {
    const term = q.trim().toLowerCase();
    if (!term) {
      // Default groups: actions + recent (just show actions)
      return index.filter(r => r.kind === 'action').slice(0, 6);
    }
    const tokens = term.split(/\s+/).filter(Boolean);
    const scored = index.map(r => {
      let score = 0;
      let matched = true;
      for (const t of tokens) {
        if (!r.tokens.includes(t)) { matched = false; break; }
        // Boost: starts-with on label
        if (r.label.toLowerCase().startsWith(t)) score += 8;
        // Boost: word boundary in label
        if (new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(r.label)) score += 4;
        score += 1;
      }
      return matched ? { r, score } : null;
    }).filter(Boolean);
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 16).map(s => s.r);
  }, [q, index]);

  useEffectS(() => { setActive(0); }, [q]);

  if (!open) return null;

  const choose = (r) => {
    if (!r) return;
    r.go();
    setOpen(false);
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(results.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[active]); }
  };

  const groups = q.trim() ? null : [{ title: 'Quick actions', items: results }];
  const grouped = groups || groupByKind(results);

  return (
    <>
      <div onClick={() => setOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(9,43,36,0.55)', backdropFilter: 'blur(2px)',
        zIndex: 250, animation: 'edcFadeIn 140ms',
      }} />
      <div style={{
        position: 'fixed', top: '12vh', left: '50%', transform: 'translateX(-50%)',
        width: 'min(640px, 92vw)', background: T.paper, borderRadius: 8,
        boxShadow: '0 24px 64px rgba(0,0,0,0.32)', zIndex: 251,
        animation: 'edcSlideUp 200ms cubic-bezier(.2,.8,.2,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        border: `1px solid ${T.border}`, maxHeight: '70vh',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: `1px solid ${T.border}` }}>
          <Icon kind="search" size={18} color={T.steel} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey}
            placeholder="Search clients, sites, equipment, programs…"
            style={{
              flex: 1, border: 'none', outline: 'none', fontFamily: sansT,
              fontSize: 16, color: T.ink, background: 'transparent',
            }} />
          <span style={{ fontFamily: monoT, fontSize: 10, color: T.ink4, border: `1px solid ${T.border}`, borderRadius: 3, padding: '1px 5px' }}>esc</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {results.length === 0 && (
            <div style={{ padding: '32px 18px', textAlign: 'center', fontFamily: sansT, fontSize: 13, color: T.ink3 }}>
              No matches for <b style={{ color: T.ink2 }}>"{q}"</b>
            </div>
          )}
          {grouped.map((g, gi) => (
            <div key={gi}>
              <div style={{ padding: '8px 18px 4px', fontFamily: sansT, fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: T.ink3 }}>{g.title}</div>
              {g.items.map((r) => {
                const idx = results.indexOf(r);
                const isActive = idx === active;
                return (
                  <div key={r.kind + ':' + r.id}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => choose(r)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '8px 18px', cursor: 'pointer',
                      background: isActive ? T.icedSoft : 'transparent',
                      borderLeft: isActive ? `3px solid ${T.accent}` : '3px solid transparent',
                    }}>
                    <KindBadge kind={r.kind} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: sansT, fontSize: 13.5, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Highlight text={r.label} q={q} />
                      </div>
                      <div style={{ fontFamily: sansT, fontSize: 11.5, color: T.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</div>
                    </span>
                    {isActive && <span style={{ fontFamily: monoT, fontSize: 10, color: T.ink3 }}>↵</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: '8px 18px', borderTop: `1px solid ${T.border}`, background: T.bgAlt, display: 'flex', justifyContent: 'space-between', fontFamily: sansT, fontSize: 11, color: T.ink3 }}>
          <span><kbd style={kbd}>↑</kbd> <kbd style={kbd}>↓</kbd> navigate · <kbd style={kbd}>↵</kbd> open · <kbd style={kbd}>esc</kbd> close</span>
          <span>{index.length} indexed</span>
        </div>
      </div>
    </>
  );
}

const kbd = {
  fontFamily: '"Geist Mono", monospace', fontSize: 10, color: T.ink2,
  border: `1px solid ${T.border}`, borderRadius: 3, padding: '1px 5px', background: T.paper,
};

function groupByKind(rows) {
  const order = ['action', 'client', 'site', 'equipment', 'program'];
  const titles = { action: 'Actions', client: 'Clients', site: 'Sites', equipment: 'Equipment', program: 'Programs' };
  const out = [];
  for (const k of order) {
    const items = rows.filter(r => r.kind === k);
    if (items.length) out.push({ title: titles[k], items });
  }
  return out;
}

function KindBadge({ kind }) {
  const map = {
    client:    { icon: 'building', bg: T.iced,           fg: T.accent },
    site:      { icon: 'pin',      bg: 'rgba(85,127,127,0.15)', fg: T.steel },
    equipment: { icon: 'bolt',     bg: 'rgba(214,239,75,0.32)', fg: T.accent },
    program:   { icon: 'event',    bg: T.borderSoft,     fg: T.ink2 },
    action:    { icon: 'arrow-r',  bg: T.icedSoft,       fg: T.accent },
  };
  const c = map[kind] || map.action;
  return (
    <span style={{ width: 28, height: 28, borderRadius: 4, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon kind={c.icon} size={14} color={c.fg} />
    </span>
  );
}

function Highlight({ text, q }) {
  const term = (q || '').trim();
  if (!term) return <>{text}</>;
  const tokens = term.split(/\s+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!tokens.length) return <>{text}</>;
  const re = new RegExp('(' + tokens.join('|') + ')', 'ig');
  const parts = text.split(re);
  return (
    <>{parts.map((p, i) => re.test(p) ? <mark key={i} style={{ background: 'rgba(214,239,75,0.55)', color: T.accent, padding: 0 }}>{p}</mark> : <span key={i}>{p}</span>)}</>
  );
}

Object.assign(window, { SearchPalette });
