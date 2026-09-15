"use client";

import { useMemo, useState } from "react";

type Adapter = {
  id:string;
  label:string;
  category:string;
  agencyOrProvider:string;
  mode:string;
  officialUrl:string|null;
  directWrite:boolean;
  externalFeeRequired:boolean;
  zeroCostActions:string[];
  billableActions:string[];
  disclosure:string;
};

export default function IntegrationConsoleClient({adapters}:{adapters:Adapter[]}) {
  const [adapterId,setAdapterId]=useState(adapters[0]?.id||"");
  const [payloadText,setPayloadText]=useState("{}\n");
  const [result,setResult]=useState<unknown>(null);
  const [busy,setBusy]=useState(false);
  const adapter=useMemo(()=>adapters.find(item=>item.id===adapterId),[adapters,adapterId]);

  async function execute(action:"prepare"|"handoff") {
    setBusy(true);
    setResult(null);
    try {
      const payload=JSON.parse(payloadText);
      const endpoint=action==="handoff"?"/api/integrations/handoff":"/api/integrations/prepare";
      const response=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({adapterId,action,payload})});
      const body=await response.json();
      setResult(body);
    } catch (error) {
      setResult({ok:false,error:error instanceof Error?error.message:"Invalid request"});
    } finally {
      setBusy(false);
    }
  }

  return <section className="section">
    <span className="eyebrow">Internal → External Control Console</span>
    <h1>Prepare, validate, and hand off without fabricating external success.</h1>
    <p className="lead">This console enforces the $0-only mandate. Do not enter SSNs, ITINs, passwords, card data, bank data, driver-license numbers, API keys, or other secrets. Prohibited fields are redacted by the gateway before evidence persistence.</p>
    <div className="grid">
      <div className="card">
        <h3>1. Select adapter</h3>
        <select value={adapterId} onChange={event=>setAdapterId(event.target.value)} style={{width:"100%",padding:".8rem"}}>
          {adapters.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        {adapter&&<div className="list" style={{marginTop:"1rem"}}>
          <div className="listItem"><strong>{adapter.agencyOrProvider}</strong><br/><small>{adapter.mode} • direct write: {String(adapter.directWrite)}</small></div>
          <div className="listItem"><strong>Zero-cost actions</strong><br/><small>{adapter.zeroCostActions.join(", ")||"none"}</small></div>
          <div className="listItem"><strong>Externally billable actions</strong><br/><small>{adapter.billableActions.join(", ")||"none"}</small></div>
        </div>}
      </div>
      <div className="card">
        <h3>2. Internal payload</h3>
        <textarea value={payloadText} onChange={event=>setPayloadText(event.target.value)} rows={16} spellCheck={false} style={{width:"100%",padding:".8rem",fontFamily:"ui-monospace,monospace"}}/>
      </div>
      <div className="card">
        <h3>3. Governed action</h3>
        <div className="actions">
          <button className="button buttonSecondary" disabled={busy} onClick={()=>execute("prepare")}>Prepare envelope</button>
          <button className="button buttonPrimary" disabled={busy} onClick={()=>execute("handoff")}>Prepare official handoff</button>
        </div>
        {adapter&&<p className="notice" style={{marginTop:"1rem"}}>{adapter.disclosure}</p>}
      </div>
    </div>
    <div className="panel" style={{marginTop:"1rem"}}>
      <h2>Execution result</h2>
      <pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",fontSize:".82rem"}}>{result?JSON.stringify(result,null,2):"No action executed yet."}</pre>
    </div>
  </section>;
}
