// Fake data store — 5 hand-crafted clients with sites, equipment, events.
// Real ISO program names + realistic MW figures. In-memory; persona switch
// re-scopes default filters but data is shared.

// ─── Tokens (lifted from midfi-shared) ────────────────────────
// `T` is mutated in place by the theme toggle (see applyTheme below).
// Inline styles read T values at render time, so swapping properties
// then re-rendering the app propagates everywhere.
const T = {
  paper: '#FFFFFF', bg: '#F9FAFB', bgAlt: '#F0F5F5',
  ink: '#111827', ink2: '#374151', ink3: '#6B7280', ink4: '#9CA3AF',
  border: '#E5E7EB', border2: '#D1D5DB', borderSoft: '#F3F4F6',
  ocean: '#092B24', oceanHv: '#0B3A30', steel: '#557F7F', steelHv:'#456969',
  // T.accent = text/border accent. Light: forest, Dark: lime. Used in 99% of
  // places the brand color shows up as ink rather than as a surface.
  accent: '#092B24', accentHv: '#0B3A30',
  // 'onLime' = text color used on T.lime backgrounds. Stays dark in both modes.
  onLime: '#092B24',
  // 'onOcean' = text color used on T.ocean backgrounds. White on dark forest.
  onOcean: '#FFFFFF',
  iced: '#D3E7E0', icedSoft:'#F0F5F5',
  lime: '#D6EF4B', limeHv: '#C5DE3A',
  ok: '#166534', okBg: '#DCFCE7',
  warn:'#92400E', warnBg:'#FEF3C7',
  err: '#991B1B', errBg:'#FEE2E2',
  info:'#1E40AF', infoBg:'#DBEAFE',
};
// Snapshots for theme swapping.
const LIGHT_TOKENS = { ...T };
const DARK_TOKENS = {
  // Body bg = the forest green from light-mode top bar.
  paper: '#0F3530', bg: '#092B24', bgAlt: '#143E36',
  ink: '#F3F4F6', ink2: '#D1D5DB', ink3: '#9CA3AF', ink4: '#7B8B85',
  border: '#1E4A40', border2: '#2F5C50', borderSoft: '#103530',
  // ocean stays forest so it works as a SURFACE color (header, primary btn, toast).
  ocean: '#092B24', oceanHv: '#0B3A30',
  // accent flips to lime so text/borders pop against the forest bg.
  accent: '#D6EF4B', accentHv: '#E5F77A',
  steel: '#9CBCBC', steelHv: '#B8D2D2',
  onLime: '#092B24',
  // White text on the forest 'ocean' surfaces still works in dark.
  onOcean: '#FFFFFF',
  iced: '#143E36', icedSoft: '#103530',
  lime: '#D6EF4B', limeHv: '#C5DE3A',
  ok: '#86EFAC', okBg: '#0F3525',
  warn: '#FCD34D', warnBg: '#3A2A0A',
  err: '#FCA5A5', errBg: '#3A1A1A',
  info: '#93C5FD', infoBg: '#0F1F3A',
};
function applyTheme(name) {
  const src = name === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
  Object.assign(T, src);
  if (typeof document !== 'undefined' && document.body) {
    document.body.style.background = T.bg;
    document.body.style.color = T.ink;
    document.body.style.colorScheme = name === 'dark' ? 'dark' : 'light';
  }
}
const sansT = '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const monoT = '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

// ─── ISO programs (real names, realistic $/kW-yr) ─────────────
const PROGRAMS = [
  { id: 'ercot-4cp',     iso: 'ERCOT',   name: '4CP',      desc: 'Coincident peak demand reduction · 4 days/yr',          rate: 112, unit: '$/kW-yr' },
  { id: 'ercot-ecrs',    iso: 'ERCOT',   name: 'ECRS',     desc: 'Contingency reserve · 10-min dispatch',                  rate: 48,  unit: '$/kW-yr' },
  { id: 'ercot-ers',     iso: 'ERCOT',   name: 'ERS',      desc: 'Emergency reserve · 30-min · winter & summer seasons',   rate: 28,  unit: '$/kW-yr' },
  { id: 'pjm-elrp',      iso: 'PJM',     name: 'ELRP',     desc: 'Emergency Load Response Program',                        rate: 84,  unit: '$/kW-yr' },
  { id: 'pjm-syncreserve',iso: 'PJM',    name: 'Sync Reserve', desc: '10-min synchronized reserve',                       rate: 56,  unit: '$/kW-yr' },
  { id: 'caiso-pdr',     iso: 'CAISO',   name: 'PDR',      desc: 'Proxy Demand Resource',                                  rate: 92,  unit: '$/kW-yr' },
  { id: 'caiso-dsgs',    iso: 'CAISO',   name: 'DSGS',     desc: 'Demand Side Grid Support · summer reliability',          rate: 64,  unit: '$/kW-yr' },
  { id: 'caiso-rdrr',    iso: 'CAISO',   name: 'RDRR',     desc: 'Reliability Demand Response Resource',                   rate: 38,  unit: '$/kW-yr' },
  { id: 'nyiso-sclr',    iso: 'NYISO',   name: 'SCR',      desc: 'Special Case Resource · capacity',                       rate: 76,  unit: '$/kW-yr' },
  { id: 'nyiso-dadrp',   iso: 'NYISO',   name: 'DADRP',    desc: 'Day-Ahead Demand Response',                              rate: 22,  unit: '$/kW-yr' },
  { id: 'isone-cap',     iso: 'ISO-NE',  name: 'FCM',      desc: 'Forward Capacity Market',                                rate: 94,  unit: '$/kW-yr' },
  { id: 'cnp-lm',        iso: 'CenterPoint', name: 'LM',   desc: 'Utility load management · summer peaks only',            rate: 14,  unit: '$/kW-yr' },
];

// ─── 5 hand-crafted clients ───────────────────────────────────
// Each: id, name, vertical, region, contacts, sites
const CLIENTS = [
  {
    id: 'hca',
    name: 'HCA Healthcare',
    short: 'HCA',
    vertical: 'Healthcare',
    region: 'TX',
    primaryISO: 'ERCOT',
    pamOwner: false,
    contact: { name: 'Sarah Reyes', title: 'Energy Director', email: 's.reyes@hcahealthcare.com', phone: '+1 832-555-0144' },
    assetManager: { name: 'Marcus Holloway', title: 'Asset Manager · ENFRA', email: 'm.holloway@enfra.com', phone: '+1 713-555-0102', coverage: '12 BESS · 4 gensets · 6 chillers', since: 'Mar 2024' },
    notes: '23 facilities under MSA · primary contact handles all enrollment approvals',
  },
  {
    id: 'caltech',
    name: 'California Institute of Technology',
    short: 'Caltech',
    vertical: 'Higher Ed',
    region: 'CA',
    primaryISO: 'CAISO',
    pamOwner: true,
    contact: { name: 'David Park', title: 'Director of Facilities', email: 'd.park@caltech.edu', phone: '+1 626-555-0119' },
    assetManager: { name: 'Priya Natarajan', title: 'Asset Manager · ENFRA', email: 'p.natarajan@enfra.com', phone: '+1 626-555-0233', coverage: '4 chillers · 1 AHU · 1 PV array', since: 'Sep 2024' },
    notes: 'Single campus, lots of distinct labs. Beckman has the heaviest cooling load.',
  },
  {
    id: 'va-sd',
    name: 'VA San Diego Healthcare',
    short: 'VA San Diego',
    vertical: 'Federal',
    region: 'CA',
    primaryISO: 'CAISO',
    pamOwner: true,
    contact: { name: 'Maj. James O\u2019Connell', title: 'Energy Manager', email: 'james.oconnell@va.gov', phone: '+1 858-555-0177' },
    assetManager: { name: 'Elena Vasquez', title: 'Asset Manager · ENFRA', email: 'e.vasquez@enfra.com', phone: '+1 858-555-0411', coverage: '1 genset · 2 chillers · 1 BESS · 1 PV', since: 'Jan 2025' },
    notes: 'FEMP-aligned. Dispatch must not interfere with mission-critical loads.',
  },
  {
    id: 'utaustin',
    name: 'University of Texas at Austin',
    short: 'UT Austin',
    vertical: 'Higher Ed',
    region: 'TX',
    primaryISO: 'ERCOT',
    pamOwner: false,
    contact: { name: 'Linda Chen', title: 'Chief Energy Officer', email: 'l.chen@austin.utexas.edu', phone: '+1 512-555-0193' },
    assetManager: { name: 'Daniel Reyes', title: 'Asset Manager · ENFRA', email: 'd.reyes@enfra.com', phone: '+1 512-555-0388', coverage: '3 chillers · 1 AHU · 1 PV array', since: 'Jun 2024' },
    notes: 'Welch Hall has dual chiller plant. Considering 4CP enrollment for next season.',
  },
  {
    id: 'advocate',
    name: 'Advocate Health',
    short: 'Advocate',
    vertical: 'Healthcare',
    region: 'IL',
    primaryISO: 'PJM',
    pamOwner: false,
    contact: { name: 'Tom Wesley', title: 'VP Sustainability', email: 't.wesley@advocatehealth.com', phone: '+1 312-555-0166' },
    assetManager: { name: 'Aisha Bradford', title: 'Asset Manager · ENFRA', email: 'a.bradford@enfra.com', phone: '+1 312-555-0507', coverage: '2 BESS · 1 genset · 3 chillers', since: 'Nov 2023' },
    notes: '3 hospitals on PJM ELRP. Christ Med Ctr is the largest contributor.',
  },
];

// ─── Sites ────────────────────────────────────────────────────
const SITES = [
  // HCA
  { id: 'hca-tmc',     clientId: 'hca',     name: 'HCA Memorial · TMC Main',  city: 'Houston',    state: 'TX', utility: 'CenterPoint', iso: 'ERCOT',  beds: 412, peakKw: 18400, esiId: '10443720008842' },
  { id: 'hca-bell',    clientId: 'hca',     name: 'HCA Memorial · Bellaire',  city: 'Bellaire',   state: 'TX', utility: 'CenterPoint', iso: 'ERCOT',  beds: 218, peakKw: 9200,  esiId: '10443720008211' },
  { id: 'hca-sl',      clientId: 'hca',     name: 'HCA Memorial · Sugar Land',city: 'Sugar Land', state: 'TX', utility: 'CenterPoint', iso: 'ERCOT',  beds: 184, peakKw: 7600,  esiId: '10443720008315' },
  // Caltech
  { id: 'cal-beckman', clientId: 'caltech', name: 'Caltech · Beckman Inst.',  city: 'Pasadena',   state: 'CA', utility: 'SCE',         iso: 'CAISO',  peakKw: 4600,  esiId: 'SCE-244-9881' },
  { id: 'cal-keck',    clientId: 'caltech', name: 'Caltech · Keck Lab',       city: 'Pasadena',   state: 'CA', utility: 'SCE',         iso: 'CAISO',  peakKw: 2100,  esiId: 'SCE-244-9882' },
  // VA San Diego
  { id: 'vasd-main',   clientId: 'va-sd',   name: 'VA San Diego · La Jolla',  city: 'La Jolla',   state: 'CA', utility: 'SDG&E',       iso: 'CAISO',  beds: 296, peakKw: 6400,  esiId: 'SDG-7714-2' },
  { id: 'vasd-cmc',    clientId: 'va-sd',   name: 'VA · Mission Valley CBOC', city: 'San Diego',  state: 'CA', utility: 'SDG&E',       iso: 'CAISO',  peakKw: 1100,  esiId: 'SDG-7714-9' },
  // UT Austin
  { id: 'ut-welch',    clientId: 'utaustin',name: 'UT Austin · Welch Hall',   city: 'Austin',     state: 'TX', utility: 'Austin Energy', iso: 'ERCOT', peakKw: 5800,  esiId: 'AE-99-3741' },
  { id: 'ut-jester',   clientId: 'utaustin',name: 'UT Austin · Jester Center',city: 'Austin',     state: 'TX', utility: 'Austin Energy', iso: 'ERCOT', peakKw: 3200,  esiId: 'AE-99-3742' },
  // Advocate
  { id: 'adv-christ',  clientId: 'advocate',name: 'Advocate · Christ Med Ctr',city: 'Oak Lawn',   state: 'IL', utility: 'ComEd',       iso: 'PJM',    beds: 749, peakKw: 14200, esiId: 'COM-330-887' },
  { id: 'adv-luth',    clientId: 'advocate',name: 'Advocate · Lutheran Gen',  city: 'Park Ridge', state: 'IL', utility: 'ComEd',       iso: 'PJM',    beds: 638, peakKw: 11800, esiId: 'COM-330-921' },
  { id: 'adv-illmc',   clientId: 'advocate',name: 'Advocate · Illinois Masonic', city: 'Chicago', state: 'IL', utility: 'ComEd',       iso: 'PJM',    beds: 408, peakKw: 8900,  esiId: 'COM-330-664' },
];

// ─── Equipment ────────────────────────────────────────────────
const EQUIPMENT = [
  // HCA TMC — BESS pair + chillers + genset
  { id: 'BESS-12', siteId: 'hca-tmc',  type: 'BESS',     make: 'Tesla',   model: 'Megapack 2XL', kw: 1900, kwh: 3916, status: 'Enrolled',  programId: 'ercot-4cp' },
  { id: 'BESS-13', siteId: 'hca-tmc',  type: 'BESS',     make: 'Tesla',   model: 'Megapack 2XL', kw: 1900, kwh: 3916, status: 'Pipeline',  programId: null },
  { id: 'CH-04',   siteId: 'hca-tmc',  type: 'Chiller',  make: 'Trane',   model: 'CVHF-1500',    kw: 850,  status: 'Enrolled',  programId: 'ercot-ecrs' },
  { id: 'GEN-MH-01',siteId: 'hca-tmc', type: 'Genset',   make: 'Cummins', model: 'QSK60-G6',     kw: 2000, status: 'Enrolled',  programId: 'ercot-4cp' },
  // HCA Bellaire
  { id: 'CH-09',   siteId: 'hca-bell', type: 'Chiller',  make: 'York',    model: 'YK-1100',      kw: 720,  status: 'Enrolled',  programId: 'ercot-4cp' },
  { id: 'GEN-02',  siteId: 'hca-bell', type: 'Genset',   make: 'Cummins', model: 'QSK45',        kw: 1500, status: 'Pipeline',  programId: null },
  // HCA Sugar Land
  { id: 'CH-15',   siteId: 'hca-sl',   type: 'Chiller',  make: 'Trane',   model: 'CVHF-1100',    kw: 600,  status: 'Enrolled',  programId: 'ercot-ecrs' },
  // Caltech Beckman
  { id: 'CH-BK1',  siteId: 'cal-beckman',type:'Chiller', make: 'Trane',   model: 'CVHF-1500',    kw: 850,  status: 'Enrolled',  programId: 'caiso-dsgs' },
  { id: 'CH-BK2',  siteId: 'cal-beckman',type:'Chiller', make: 'Trane',   model: 'CVHF-1500',    kw: 850,  status: 'Enrolled',  programId: 'caiso-pdr' },
  { id: 'HPCH-BK1',siteId: 'cal-beckman',type:'HP Chiller',make:'Trane',  model: 'Ascend ACX-180',kw: 180, status: 'Enrolled',  programId: 'caiso-dsgs' },
  { id: 'AHU-BK1', siteId: 'cal-beckman',type:'AHU',     make: 'York',    model: 'YK Air Handler',kw: 220, status: 'Pipeline',  programId: null },
  // Caltech Keck
  { id: 'CH-KE1',  siteId: 'cal-keck', type: 'Chiller',  make: 'Trane',   model: 'CVHF-700',     kw: 420,  status: 'Enrolled',  programId: 'caiso-pdr' },
  // VA San Diego La Jolla
  { id: 'GEN-04',  siteId: 'vasd-main',type: 'Genset',   make: 'Cummins', model: 'QSK60-G6',     kw: 2000, status: 'Pipeline',  programId: null },
  { id: 'CH-VA1',  siteId: 'vasd-main',type: 'Chiller',  make: 'Trane',   model: 'CVHF-1500',    kw: 850,  status: 'Enrolled',  programId: 'caiso-rdrr' },
  { id: 'HPCH-VA1',siteId: 'vasd-main',type: 'HP Chiller',make:'Carrier', model: 'AquaForce 30XW-V',kw: 220, status: 'Pipeline', programId: null },
  // VA CBOC
  { id: 'BESS-VA', siteId: 'vasd-cmc', type: 'BESS',     make: 'Powin',   model: 'Stack750',     kw: 750,  kwh: 2100, status: 'Pipeline', programId: null },
  // UT Austin Welch
  { id: 'AHU-22',  siteId: 'ut-welch', type: 'AHU',      make: 'York',    model: 'YK Air Handler',kw: 240, status: 'Pending review', programId: 'ercot-4cp' },
  { id: 'CH-UT1',  siteId: 'ut-welch', type: 'Chiller',  make: 'Trane',   model: 'CVHF-1500',    kw: 850,  status: 'Enrolled',  programId: 'ercot-4cp' },
  { id: 'CH-UT2',  siteId: 'ut-welch', type: 'Chiller',  make: 'Trane',   model: 'CVHF-1500',    kw: 850,  status: 'Enrolled',  programId: 'ercot-ecrs' },
  { id: 'HPCH-UT1',siteId: 'ut-welch', type: 'HP Chiller',make:'Daikin',  model: 'Trailblazer AGZ-200',kw: 200,status: 'Enrolled', programId: 'ercot-ecrs' },
  // UT Jester
  { id: 'CH-JE1',  siteId: 'ut-jester',type: 'Chiller',  make: 'Carrier', model: '23XRV-700',    kw: 420,  status: 'Pipeline',  programId: null },
  // Advocate Christ
  { id: 'BESS-AC1',siteId: 'adv-christ',type:'BESS',     make: 'Tesla',   model: 'Megapack 2',   kw: 1500, kwh: 3100, status: 'Enrolled', programId: 'pjm-elrp' },
  { id: 'GEN-AC1', siteId: 'adv-christ',type:'Genset',   make: 'Cummins', model: 'QSK60-G6',     kw: 2000, status: 'Enrolled',  programId: 'pjm-elrp' },
  { id: 'CH-AC1',  siteId: 'adv-christ',type:'Chiller',  make: 'Trane',   model: 'CVHF-1500',    kw: 850,  status: 'Enrolled',  programId: 'pjm-syncreserve' },
  // Advocate Lutheran
  { id: 'BESS-AL1',siteId: 'adv-luth',  type:'BESS',     make: 'Tesla',   model: 'Megapack 2XL', kw: 1900, kwh: 3916, status: 'Enrolled', programId: 'pjm-elrp' },
  { id: 'CH-AL1',  siteId: 'adv-luth',  type:'Chiller',  make: 'York',    model: 'YK-1100',      kw: 720,  status: 'Enrolled',  programId: 'pjm-elrp' },
  // Advocate Illinois Masonic
  { id: 'CH-IM1',  siteId: 'adv-illmc', type:'Chiller',  make: 'Trane',   model: 'CVHF-1100',    kw: 600,  status: 'Pending review', programId: 'pjm-elrp' },
  // Solar PV — new asset class
  { id: 'PV-TMC-1',siteId: 'hca-tmc',  type: 'Solar',   make: 'SunPower',model: 'Helix Carport',kw: 1200, status: 'Enrolled',  programId: 'ercot-4cp' },
  { id: 'PV-CAL-1',siteId: 'cal-beckman',type:'Solar',  make: 'SunPower',model: 'Maxeon-6 Roof',kw: 850,  status: 'Enrolled',  programId: 'caiso-pdr' },
  { id: 'PV-VA-1', siteId: 'vasd-main',type: 'Solar',   make: 'First Solar',model:'Series 6',  kw: 1450, status: 'Enrolled',  programId: 'caiso-dsgs' },
  { id: 'PV-AC-1', siteId: 'adv-christ',type:'Solar',   make: 'SunPower',model: 'Maxeon-6 Roof',kw: 720,  status: 'Pipeline',  programId: null },
  { id: 'PV-UT-1', siteId: 'ut-jester',type: 'Solar',   make: 'SunPower',model: 'Helix Carport',kw: 540,  status: 'Pipeline',  programId: null },
];

// ─── Equipment-type buckets ───────────────────────────────────
// Maps the 4 dashboard buckets to underlying type values.
const EQUIP_BUCKETS = [
  { id: 'bess',       label: 'BESS',          types: ['BESS'],            sub: 'Battery energy storage' },
  { id: 'generators', label: 'Generators',    types: ['Genset'],          sub: 'Diesel & natural-gas gensets' },
  { id: 'solar',      label: 'Solar',         types: ['Solar'],           sub: 'PV arrays & carports' },
  { id: 'facilities', label: 'Facilities DM', types: ['Chiller', 'HP Chiller', 'AHU'],  sub: 'Chillers, heat pumps & HVAC' },
];
function bucketFor(type) { return EQUIP_BUCKETS.find(b => b.types.includes(type)); }

// Per-asset "available now" snapshot. Real version would come from SkySpark live status.
// Deterministic by id-hash so it's stable across renders. Some offline (0), some derated.
function availableKwFor(eq) {
  if (eq.status !== 'Enrolled') return 0; // not enrolled = not dispatchable
  // Hash id into a 0–1
  let h = 0;
  for (let i = 0; i < eq.id.length; i++) h = (h * 31 + eq.id.charCodeAt(i)) >>> 0;
  const r = (h % 100) / 100;
  if (r < 0.10) return 0;                        // 10% offline
  if (r < 0.30) return Math.round(eq.kw * 0.75); // 20% derated
  return eq.kw;                                  // 70% fully available
}

// ─── DR Events (historical + a "pending" one we can fire) ────
// Performance ratio = actual / nominated, 1.0 = perfect.
const SEED_EVENTS = [
  { id: 'evt-25-08-14', iso: 'ERCOT',  program: '4CP',       date: '2025-08-14', start: '14:02', end: '17:00', siteCount: 14, calledMw: 28.4, perf: 0.964, status: 'Settled' },
  { id: 'evt-25-08-07', iso: 'ERCOT',  program: '4CP',       date: '2025-08-07', start: '15:11', end: '17:30', siteCount: 12, calledMw: 24.1, perf: 0.992, status: 'Settled' },
  { id: 'evt-25-07-22', iso: 'PJM',    program: 'ELRP',      date: '2025-07-22', start: '13:30', end: '16:30', siteCount: 4,  calledMw: 8.6,  perf: 1.012, status: 'Settled' },
  { id: 'evt-25-07-09', iso: 'CAISO',  program: 'DSGS',      date: '2025-07-09', start: '17:45', end: '20:00', siteCount: 3,  calledMw: 4.2,  perf: 0.881, status: 'Settled · Penalty' },
  { id: 'evt-25-06-28', iso: 'ERCOT',  program: 'ECRS',      date: '2025-06-28', start: '16:14', end: '16:24', siteCount: 6,  calledMw: 5.1,  perf: 0.974, status: 'Settled' },
  { id: 'evt-25-06-15', iso: 'ERCOT',  program: '4CP',       date: '2025-06-15', start: '15:00', end: '17:00', siteCount: 11, calledMw: 22.8, perf: 0.953, status: 'Settled' },
];

// ─── Live event payload (what "Fire an event" creates) ────────
const LIVE_EVENT_TEMPLATE = {
  id: 'evt-live',
  iso: 'ERCOT',
  program: '4CP',
  programName: 'ERCOT 4CP',
  startedAt: null,
  endsAt: null,
  notifWindow: '2 hr',
  siteCount: 14,
  calledMw: 28.4,
  perf: 0.964,
  status: 'Active',
  // Per-site rollup (used in event-detail)
  sites: [
    { siteId: 'hca-tmc',    nomKw: 4750, actualKw: 4612, perf: 0.971 },
    { siteId: 'hca-bell',   nomKw: 1500, actualKw: 1488, perf: 0.992 },
    { siteId: 'hca-sl',     nomKw: 600,  actualKw: 580,  perf: 0.967 },
    { siteId: 'ut-welch',   nomKw: 2200, actualKw: 2082, perf: 0.946 },
    { siteId: 'ut-jester',  nomKw: 0,    actualKw: 0,    perf: null },
  ],
};

// ─── Selectors ────────────────────────────────────────────────
function getClient(id) { return CLIENTS.find(c => c.id === id); }
function getSite(id)   { return SITES.find(s => s.id === id); }
function getEquipment(id) { return EQUIPMENT.find(e => e.id === id); }
function getProgram(id){ return PROGRAMS.find(p => p.id === id); }
function sitesForClient(cid){ return SITES.filter(s => s.clientId === cid); }
function equipmentForSite(sid){ return EQUIPMENT.filter(e => e.siteId === sid); }
function equipmentForClient(cid){
  const sids = sitesForClient(cid).map(s => s.id);
  return EQUIPMENT.filter(e => sids.includes(e.siteId));
}

// ─── Portfolio rollups ────────────────────────────────────────
function portfolioStats(filterFn) {
  const eq = filterFn ? EQUIPMENT.filter(filterFn) : EQUIPMENT;
  const enrolled = eq.filter(e => e.status === 'Enrolled');
  const sites = new Set(eq.map(e => e.siteId));
  const clients = new Set([...sites].map(sid => getSite(sid)?.clientId).filter(Boolean));
  const peakKw = [...sites].reduce((sum, sid) => sum + (getSite(sid)?.peakKw || 0), 0);
  const enrolledKw = enrolled.reduce((sum, e) => sum + (e.kw || 0), 0);
  const pendingCount = eq.filter(e => e.status === 'Pending review').length;
  const pipelineCount = eq.filter(e => e.status === 'Pipeline').length;
  const annualRev = enrolled.reduce((sum, e) => {
    const p = getProgram(e.programId);
    return sum + (p ? e.kw * p.rate : 0);
  }, 0);
  const clientShareRev = annualRev * 0.7; // Client's share after ENFRA + CPower
  return {
    sites: sites.size,
    clients: clients.size,
    equipment: eq.length,
    enrolled: enrolled.length,
    peakMw: peakKw / 1000,
    enrolledMw: enrolledKw / 1000,
    pendingCount,
    pipelineCount,
    annualRev,
    clientShareRev,
  };
}

// PAM-mode default scope: only sites where the client has pamOwner === true.
function pamSiteIds() {
  return SITES.filter(s => {
    const c = getClient(s.clientId);
    return c && c.pamOwner;
  }).map(s => s.id);
}

// Format helpers
const fmtMw   = mw => `${mw.toFixed(1)} MW`;
const fmtKw   = kw => `${kw.toLocaleString()} kW`;
const fmt$    = n  => '$' + Math.round(n).toLocaleString();
const fmt$M   = n  => '$' + (n / 1e6).toFixed(2) + 'M';
const fmtPct  = p  => (p * 100).toFixed(1) + '%';

Object.assign(window, {
  T, sansT, monoT,
  LIGHT_TOKENS, DARK_TOKENS, applyTheme,
  PROGRAMS, CLIENTS, SITES, EQUIPMENT, SEED_EVENTS, LIVE_EVENT_TEMPLATE,
  EQUIP_BUCKETS, bucketFor, availableKwFor,
  getClient, getSite, getEquipment, getProgram,
  sitesForClient, equipmentForSite, equipmentForClient,
  portfolioStats, pamSiteIds,
  fmtMw, fmtKw, fmt$, fmt$M, fmtPct,
});
