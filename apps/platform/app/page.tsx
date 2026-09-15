import Link from "next/link";
import { BRAND } from "@comeaux/brand";
import { CATEGORIES, PRODUCTS } from "@comeaux/catalog";
import { PROGRAMS } from "@comeaux/training";

export default function HomePage() {
  return <>
    <section className="hero">
      <div>
        <div className="eyebrow">A family company • healthcare supply + LTC support platform</div>
        <h1>Supply care teams. Train the workforce. Support long-term care operations.</h1>
        <p className="lead">{BRAND.description} The platform unifies commerce, training, AI-assisted guidance, facility onboarding, account verification, governed external handoffs, and regulatory evidence without confusing internal workflow completion with official approval.</p>
        <div className="actions">
          <Link prefetch={false} className="button buttonPrimary" href="/store">Shop nursing supplies</Link>
          <Link prefetch={false} className="button buttonSecondary" href="/academy">Explore academy</Link>
          <Link prefetch={false} className="button buttonSecondary" href="/integrations">Open integration gateway</Link>
        </div>
      </div>
      <aside className="brandShowcase" aria-label="Comeaux Lady's Medical Supply Co. brand identity">
        <img className="heroWordmark" src={BRAND.assets.wordmark} alt={`${BRAND.name}. ${BRAND.tagline}`} width="540" height="360" />
        <p className="brandNote">Canonical wordmark for customer-facing and facility-facing surfaces. The compact monogram appears in navigation, favicon, and application identity.</p>
      </aside>
    </section>
    <section className="section">
      <div className="eyebrow">Operating surfaces</div>
      <h2>Commerce + education + LTC facility operations</h2>
      <div className="grid">{[
        ["Medical supply commerce","Catalog, quantities, variants, bundles, facility ordering, fulfillment and customization."],
        ["Healthcare LMS","Enrollment, modules, knowledge checks, graded assessments, attendance and instructor sign-offs."],
        ["AI-assisted guidance","Policy-governed guidance with safety boundaries, source discipline, human escalation and deterministic fallback."],
        ["Facility readiness","Incident preparation, evidence indexing, competency workflows, audit support, QAPI and official regulatory handoff boundaries."],
        ["Internal → external gateway","Validated, redacted and hashed packets for authorized official handoffs without fabricating submission or acceptance."],
        ["Cloud governance","Render runtime evidence, OpenAPI contracts, immutable artifact manifests, release gates and zero-cost infrastructure policy."]
      ].map(([title,copy]) => <article className="card" key={title}><span className="badge">Enterprise module</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
    <section className="section">
      <div className="eyebrow">Platform registry</div>
      <h2>One governed source of truth</h2>
      <div className="metricGrid" style={{marginTop:"1.4rem"}}>
        <div className="metric"><strong>{PRODUCTS.length}</strong><span>seed products</span></div>
        <div className="metric"><strong>{CATEGORIES.length}</strong><span>supply departments</span></div>
        <div className="metric"><strong>{PROGRAMS.length}</strong><span>learning program tracks</span></div>
        <div className="metric"><strong>API</strong><span>contract-first internal/external workflows</span></div>
      </div>
    </section>
  </>;
}
