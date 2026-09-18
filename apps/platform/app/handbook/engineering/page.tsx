import type { Metadata } from "next";
import { ENGINEERING_PRINCIPLES, engineeringPrincipleSummary } from "../../../lib/engineering-principles";

export const metadata:Metadata={
  title:"Engineering Handbook",
  description:"Authoritative engineering, AI, security, regulatory, data-entry, API, testing, and deployment principles for the Comeaux platform."
};

export default function EngineeringPrinciplesPage(){
  const summary=engineeringPrincipleSummary();
  return <section className="section">
    <span className="eyebrow">Governance handbook • version {summary.version}</span>
    <h1>Engineering principles</h1>
    <p className="lead">The platform-wide contract for architecture, data entry, AI assistance, access control, regulatory truth, commerce, learning, APIs, workers, observability, testing, deployment, artifacts, resilience, and the zero-cost mandate.</p>
    <div className="metricGrid" style={{maxWidth:"760px",margin:"1.5rem 0"}}>
      <div className="metric"><strong>{summary.domainCount}</strong><span>engineering domains</span></div>
      <div className="metric"><strong>{summary.mandateCount}</strong><span>enforceable mandates</span></div>
    </div>
    <div className="notice"><strong>Truth-state discipline:</strong> {ENGINEERING_PRINCIPLES.truthStates.join(" → ")}. A workflow advances only when evidence for the new state exists.</div>
    <div className="grid" style={{marginTop:"1.5rem"}}>
      {ENGINEERING_PRINCIPLES.domains.map(domain=><article className="card" key={domain.id}>
        <span className="badge">{domain.id}</span>
        <h3>{domain.name}</h3>
        <ol>{domain.mandates.map(rule=><li key={rule} style={{marginBottom:".65rem",lineHeight:1.55}}>{rule}</li>)}</ol>
      </article>)}
    </div>
    <div className="panel" style={{marginTop:"1.5rem"}}>
      <h2>Universal mandates</h2>
      <ol>{ENGINEERING_PRINCIPLES.universalMandates.map(rule=><li key={rule} style={{marginBottom:".65rem"}}>{rule}</li>)}</ol>
      <p><a className="button buttonSecondary" href="/api/platform/engineering-principles">Machine-readable registry</a></p>
    </div>
  </section>;
}
