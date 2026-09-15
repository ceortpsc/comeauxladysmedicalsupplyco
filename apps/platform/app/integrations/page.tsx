import type { Metadata } from "next";
import { publicAdapterRegistry } from "@comeaux/external-gateway";
import IntegrationConsoleClient from "./IntegrationConsoleClient";

export const metadata: Metadata = {
  title: "Internal to External Gateway",
  description: "Governed preparation and official handoff software for business, tax identity, regulatory, credential, payment, IP, communications, and infrastructure workflows."
};

export default function IntegrationsPage(){
  return <>
    <section className="hero">
      <div>
        <span className="eyebrow">Integration Gateway</span>
        <h1>Internal records in. Governed external handoffs out.</h1>
        <p className="lead">One policy-controlled bridge for the external systems Comeaux workflows depend on. The gateway validates, redacts, hashes, gates costs, and preserves evidence while keeping legal attestations and official acceptance with the authorized external system.</p>
        <div className="actions"><a className="button buttonPrimary" href="#console">Open control console</a><a className="button buttonSecondary" href="/api/integrations">View adapter registry</a></div>
      </div>
      <aside className="panel">
        <span className="badge">$0-only policy enforced</span>
        <div className="metricGrid" style={{marginTop:"1rem"}}>
          <div className="metric"><strong>{publicAdapterRegistry().length}</strong><span>adapter boundaries</span></div>
          <div className="metric"><strong>0</strong><span>default direct-write government actions</span></div>
          <div className="metric"><strong>SHA-256</strong><span>handoff evidence hashing</span></div>
          <div className="metric"><strong>24h</strong><span>optional ephemeral envelope cache</span></div>
        </div>
      </aside>
    </section>
    <div id="console"><IntegrationConsoleClient adapters={publicAdapterRegistry()}/></div>
  </>;
}
