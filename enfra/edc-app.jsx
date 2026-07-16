// EDC wireframes — main app file. Wires the design canvas with all variants.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "eventBanner": true,
  "portfolioVariant": "all",
  "showAnnotations": true,
  "pamMode": false,
  "showMidfi": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const portfolioCards = (() => {
    const all = [
      { id: 'A', node: <VariantA_Classic eventBanner={tweaks.eventBanner} />, label: 'A · Classic — KPIs + big map' },
      { id: 'B', node: <VariantB_MapHero eventBanner={tweaks.eventBanner} />, label: 'B · Map Hero' },
      { id: 'C', node: <VariantC_Split eventBanner={tweaks.eventBanner} />,   label: 'C · Split — map + leaderboards' },
      { id: 'D', node: <VariantD_Console eventBanner={tweaks.eventBanner} />, label: 'D · Operator Console' },
    ];
    if (tweaks.portfolioVariant === 'all') return all;
    return all.filter(v => v.id === tweaks.portfolioVariant);
  })();

  return (
    <>
      <DesignCanvas>
        <DCSection id="intro" title="ENFRA Demand Center · Wireframes" subtitle="Lo-fi exploration · 4 portfolio variants, 3 drilldown models, events, forms, filters">
          <DCArtboard id="readme" label="README" width={620} height={820}>
            <div style={{ padding: 36, fontFamily: handBody, color: SKETCH.ink, height: '100%', background: SKETCH.paper, overflow:'auto' }}>
              <SLabel eyebrow style={{ marginBottom: 6 }}>EDC · Wireframe pack</SLabel>
              <SHeading size={42}>ENFRA Demand Center</SHeading>
              <div style={{ height: 2, background: SKETCH.lime, width: 60, margin: '14px 0' }} />
              <p style={{ fontFamily: handBody, fontSize: 16, lineHeight: 1.5, color: SKETCH.ink2 }}>
                Backbone for ENFRA's Demand Management & Demand Response activities.
                Authority for all info on distributed energy resources (DERs) across the
                client portfolio.
              </p>
              <div style={{ height: 1, background: SKETCH.ruleSoft, margin: '20px 0' }} />
              <SLabel eyebrow>What's in this canvas</SLabel>
              <ol style={{ fontFamily: handBody, fontSize: 14, color: SKETCH.ink2, lineHeight: 1.7, paddingLeft: 20 }}>
                <li><b>Portfolio dashboard</b> — 4 layout variants (A · Classic, B · Map Hero, C · Split, D · Operator Console)</li>
                <li><b>Drilldown</b> — 3 navigation models for portfolio → client → site → equipment</li>
                <li><b>DR Events</b> — log + per-event detail with baseline-vs-actual</li>
                <li><b>Enrollment</b> — slide-over drawer (matches EaaS pattern)</li>
                <li><b>Onboarding</b> — multi-step new-client flow</li>
                <li><b>Filter bar patterns</b> — 3 stacked options w/ recommendation</li>
                <li><b>Mid-fi recommended</b> — Variant A polished into the ENFRA system</li>
              </ol>
              <div style={{ height: 1, background: SKETCH.ruleSoft, margin: '20px 0' }} />
              <SLabel eyebrow>Tweaks (top-right toolbar)</SLabel>
              <ul style={{ fontFamily: handBody, fontSize: 14, color: SKETCH.ink2, lineHeight: 1.7, paddingLeft: 20 }}>
                <li>Toggle <b>Live Event banner</b> on/off across all variants</li>
                <li>Filter portfolio canvas to a single variant (A / B / C / D / All)</li>
              </ul>
              <div style={{ height: 1, background: SKETCH.ruleSoft, margin: '20px 0' }} />
              <SLabel eyebrow>Reading the wireframes</SLabel>
              <p style={{ fontFamily: handBody, fontSize: 13.5, lineHeight: 1.55, color: SKETCH.inkSoft }}>
                Cream paper + charcoal ink = layout exploration. The single mid-fi card
                shows the recommended direction in real ENFRA color, type, and density.
                Click any artboard to focus it fullscreen; drag to reorder.
              </p>
              <div style={{ marginTop: 20, padding: 14, border: `1.5px solid ${SKETCH.ocean}`, background: 'rgba(214,239,75,0.18)', borderRadius: 4 }}>
                <SLabel eyebrow style={{ marginBottom: 6 }}>Open questions</SLabel>
                <SLines count={3} widths={[260, 220, 240]} />
                <div style={{ fontFamily: handBody, fontSize: 13, color: SKETCH.ink2, lineHeight: 1.5, marginTop: 6 }}>
                  · Should "Total Clients" tile be filterable by vertical?<br/>
                  · Live event: do PAMs need an inline "I'm watching this" ack?<br/>
                  · Onboarding step 4 — pre-seed equipment from eWay or always blank?
                </div>
              </div>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="portfolio" title="1 · Portfolio Dashboard" subtitle="The landing page · 4 layout variants">
          {portfolioCards.map(v => (
            <DCArtboard key={v.id} id={v.id} label={v.label} width={640} height={410}>
              {v.node}
            </DCArtboard>
          ))}
        </DCSection>

        <DCSection id="midfi" title="2 · Mid-fi · Recommended Direction" subtitle="Variant A polished into real ENFRA styling — first look">
          <DCArtboard id="midfi-a" label="Variant A polished — ENFRA system styling" width={640} height={410}>
            <MidRecommendedDashboard eventBanner={tweaks.eventBanner} />
          </DCArtboard>
        </DCSection>

        {tweaks.showMidfi && (
          <DCSection id="midfi-full" title="2b · Mid-fi · Full Build-out" subtitle="Polished ENFRA design system across every screen · click to focus fullscreen">
            <DCArtboard id="mf-portfolio" label={`Portfolio · ${tweaks.pamMode ? 'PAM view (My Sites pre-filtered)' : 'Demand Mgmt view (all clients)'}`} width={640} height={410}>
              <MidFiPortfolio eventBanner={tweaks.eventBanner} pamMode={tweaks.pamMode} showAnnotations={tweaks.showAnnotations} />
            </DCArtboard>
            <DCArtboard id="mf-drilldown" label="Site drilldown · Equipment tab · filter-rescope chips" width={640} height={410}>
              <MidFiSiteDrilldown eventBanner={tweaks.eventBanner} />
            </DCArtboard>
            <DCArtboard id="mf-events" label="DR Events log · YTD" width={640} height={410}>
              <MidFiEventsLog eventBanner={tweaks.eventBanner} />
            </DCArtboard>
            <DCArtboard id="mf-event-detail" label="Event detail · baseline vs actual + per-asset" width={640} height={410}>
              <MidFiEventDetail eventBanner={tweaks.eventBanner} />
            </DCArtboard>
          </DCSection>
        )}

        {tweaks.showMidfi && (
          <DCSection id="midfi-enroll" title="2c · Mid-fi · Equipment Enrollment (all 4 steps)" subtitle="Slide-over drawer · BESS-12 · Tesla Megapack 2XL · HCA Memorial Houston">
            <DCArtboard id="mf-en-1" label="Step 1 · Site selection" width={640} height={410}>
              <MidFiEnrollmentDrawer eventBanner={tweaks.eventBanner} step={1} />
            </DCArtboard>
            <DCArtboard id="mf-en-2" label="Step 2 · Equipment identification" width={640} height={410}>
              <MidFiEnrollmentDrawer eventBanner={tweaks.eventBanner} step={2} />
            </DCArtboard>
            <DCArtboard id="mf-en-3" label="Step 3 · Program selection & nomination" width={640} height={410}>
              <MidFiEnrollmentDrawer eventBanner={tweaks.eventBanner} step={3} />
            </DCArtboard>
            <DCArtboard id="mf-en-4" label="Step 4 · Financials & sign-off" width={640} height={410}>
              <MidFiEnrollmentDrawer eventBanner={tweaks.eventBanner} step={4} />
            </DCArtboard>
          </DCSection>
        )}

        {tweaks.showMidfi && (
          <DCSection id="midfi-onboard" title="2d · Mid-fi · Client Onboarding (all 6 steps)" subtitle="Memorial Hermann · 23 sites · 184 buildings · ~62 MW peak — every step rendered as its own artboard">
            <DCArtboard id="mf-ob-1" label="Step 1 · Client information" width={640} height={410}>
              <MidFiOnboardingWizard eventBanner={tweaks.eventBanner} step={1} />
            </DCArtboard>
            <DCArtboard id="mf-ob-2" label="Step 2 · Vertical & contacts" width={640} height={410}>
              <MidFiOnboardingWizard eventBanner={tweaks.eventBanner} step={2} />
            </DCArtboard>
            <DCArtboard id="mf-ob-3" label="Step 3 · Sites (23 imported)" width={640} height={410}>
              <MidFiOnboardingWizard eventBanner={tweaks.eventBanner} step={3} />
            </DCArtboard>
            <DCArtboard id="mf-ob-4" label="Step 4 · Equipment import (eWay)" width={640} height={410}>
              <MidFiOnboardingWizard eventBanner={tweaks.eventBanner} step={4} />
            </DCArtboard>
            <DCArtboard id="mf-ob-5" label="Step 5 · Programs (ISO mapping)" width={640} height={410}>
              <MidFiOnboardingWizard eventBanner={tweaks.eventBanner} step={5} />
            </DCArtboard>
            <DCArtboard id="mf-ob-6" label="Step 6 · Financials & sign-off" width={640} height={410}>
              <MidFiOnboardingWizard eventBanner={tweaks.eventBanner} step={6} />
            </DCArtboard>
          </DCSection>
        )}

        <DCSection id="drilldown" title="3 · Drilldown Models" subtitle="How users traverse Portfolio → Client → Site → Equipment">
          <DCArtboard id="dd1" label="Model 1 · Filter-bar re-scope (single page)" width={640} height={390}>
            <DrilldownModel1_FilterRescope />
          </DCArtboard>
          <DCArtboard id="dd2" label="Model 2 · Breadcrumb stack (discrete pages)" width={640} height={390}>
            <DrilldownModel2_Breadcrumb />
          </DCArtboard>
          <DCArtboard id="dd3" label="Model 3 · Master-detail (list + drawer)" width={640} height={390}>
            <DrilldownModel3_MasterDetail />
          </DCArtboard>
        </DCSection>

        <DCSection id="events" title="4 · DR Events" subtitle="Event log + per-event performance detail">
          <DCArtboard id="ev-log" label="Event log · timeline w/ performance bars" width={640} height={390}>
            <EventsLog_Timeline />
          </DCArtboard>
          <DCArtboard id="ev-detail" label="Event detail · baseline vs actual per asset" width={640} height={390}>
            <EventDetail />
          </DCArtboard>
        </DCSection>

        <DCSection id="forms" title="5 · Enrollment & Onboarding" subtitle="Write-new-record flows">
          <DCArtboard id="enroll" label="Enrollment · slide-over drawer" width={640} height={390}>
            <EnrollmentSlideOver />
          </DCArtboard>
          <DCArtboard id="onboard" label="Client onboarding · multi-step" width={640} height={390}>
            <ClientOnboarding />
          </DCArtboard>
        </DCSection>

        <DCSection id="filters" title="6 · Filter Bar Patterns" subtitle="3 options stacked for comparison">
          <DCArtboard id="filters-a" label="Filter bar patterns · A / B / C" width={640} height={390}>
            <FilterBarPatterns />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="View modes">
          <TweakToggle label="Show full mid-fi build-out (6 screens)" value={tweaks.showMidfi} onChange={v => setTweak('showMidfi', v)} />
          <TweakToggle label="PAM view (My Sites pre-filtered)" value={tweaks.pamMode} onChange={v => setTweak('pamMode', v)} />
          <TweakToggle label="Show stakeholder annotations" value={tweaks.showAnnotations} onChange={v => setTweak('showAnnotations', v)} />
        </TweakSection>
        <TweakSection title="Live event banner">
          <TweakToggle label="Show live event banner" value={tweaks.eventBanner} onChange={v => setTweak('eventBanner', v)} />
        </TweakSection>
        <TweakSection title="Portfolio dashboard">
          <TweakRadio
            label="Show variant"
            value={tweaks.portfolioVariant}
            onChange={v => setTweak('portfolioVariant', v)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'A',   label: 'A' },
              { value: 'B',   label: 'B' },
              { value: 'C',   label: 'C' },
              { value: 'D',   label: 'D' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
