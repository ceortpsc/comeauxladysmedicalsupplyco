import { ANDREAA_CHAN_NEL } from "@comeaux/ai-core";

const rules=[
  ["Truth-state discipline","Prepared, validated, reviewed, handed off, submitted, accepted, verified, paid, and completed are distinct states."],
  ["Human authority","AI never signs, attests, represents licensure, or substitutes for an authorized external or licensed professional."],
  ["Sensitive data","General forms/chat prohibit passwords, SSNs/ITINs, card/bank credentials, API keys, identity-document numbers, and PHI."],
  ["$0 infrastructure","Paid-only resources and fee-bearing actions remain blocked/configuration-only unless separately authorized."],
  ["Regulated workflows","Current official rules and facility/program type control deadlines and submission requirements; do not rely on stale templates."],
  ["Clinical scope","Educational/support content does not diagnose, prescribe, or provide unsupervised medication-administration procedure."],
  ["Audit evidence","External success requires authoritative evidence such as provider/state confirmation IDs, receipts, or verified connector responses."]
] as const;

export default function GovernancePage(){return <section className="section">
  <div className="eyebrow">Governance • policy • handbook</div><h1>Operating rules and decision boundaries</h1>
  <p className="lead">These controls govern catalog, learning, AI support, business services, integrations, and facility-support workflows.</p>
  <div className="grid">{rules.map(([title,copy])=><article className="card" key={title}><span className="badge">Mandatory</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
  <section className="panel" style={{marginTop:"1.5rem"}}><h2>{ANDREAA_CHAN_NEL.displayName} AI policy</h2><p>{ANDREAA_CHAN_NEL.disclosure}</p><ul>{ANDREAA_CHAN_NEL.operatingRules.map(rule=><li key={rule}>{rule}</li>)}</ul></section>
  <div className="actions"><a className="button buttonSecondary" href="/handbook/engineering">Engineering handbook</a><a className="button buttonSecondary" href="/api/platform/engineering-principles">Engineering principles API</a><a className="button buttonPrimary" href="/assistant">Open AI support</a></div>
</section>}
