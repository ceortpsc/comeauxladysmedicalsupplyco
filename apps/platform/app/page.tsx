import Link from "next/link";
import { BRAND } from "@comeaux/brand";
import { CATEGORIES, PRODUCTS } from "@comeaux/catalog";
import { PROGRAMS } from "@comeaux/training";

export default function HomePage() {
  return <>
    <section className="hero">
      <div>
        <div className="eyebrow">A family company • Texas healthcare platform</div>
        <h1>Supply care teams. Train the workforce. Track every outcome.</h1>
        <p className="lead">{BRAND.description} The monorepo unifies commerce, training, AI-assisted simulation, clinic onboarding, account verification and regulatory evidence without confusing internal workflow completion with state approval.</p>
        <div className="actions"><Link className="button buttonPrimary" href="/store">Shop nursing supplies</Link><Link className="button buttonSecondary" href="/academy">Explore academy</Link></div>
      </div>
      <aside className="panel"><div className="eyebrow">Platform registry</div><h2>One source of truth</h2><div className="metricGrid"><div className="metric"><strong>{PRODUCTS.length}</strong><span>seed products</span></div><div className="metric"><strong>{CATEGORIES.length}</strong><span>departments</span></div><div className="metric"><strong>{PROGRAMS.length}</strong><span>program tracks</span></div><div className="metric"><strong>API</strong><span>contract-first</span></div></div></aside>
    </section>
    <section className="section"><div className="eyebrow">Operating surfaces</div><h2>Commerce + education + clinic operations</h2><div className="grid">{[["Medical supply commerce","Catalog, quantities, variants, bundles, clinic pricing, fulfillment and customization."],["Healthcare LMS","Enrollment, modules, knowledge checks, graded assessments, attendance and instructor sign-offs."],["AI-assisted simulation","Human-authored scenarios with provider adapters, safety gates and deterministic scripted fallback."],["Texas workflow","TULIP-ready school/class/student packets, audit trails and explicit external-submission status."],["Mobile delivery","Native iOS workspace and stable API bootstrap contracts."],["Cloud governance","Render, OpenAPI, Apigee API Hub and immutable artifact publication manifests."]].map(([title,copy])=><article className="card" key={title}><span className="badge">Enterprise module</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  </>;
}
