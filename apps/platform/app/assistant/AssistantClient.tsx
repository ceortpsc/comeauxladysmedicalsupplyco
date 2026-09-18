"use client";

import { FormEvent, useState } from "react";

type Reply={
  persona:{displayName:string;role:string;disclosure:string};
  intent:string;
  answer:string;
  nextActions:string[];
  humanReviewRequired:boolean;
  confidence:number;
  policyNotices:string[];
};

export default function AssistantClient(){
  const [message,setMessage]=useState("");
  const [reply,setReply]=useState<Reply|null>(null);
  const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent){
    event.preventDefault();
    setBusy(true); setReply(null);
    try{
      const response=await fetch("/api/assistant/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({message})});
      const body=await response.json();
      if(!response.ok) throw new Error(body.error||"Request failed");
      setReply(body.reply);
    }catch(error){
      setReply({persona:{displayName:"Andreaa Chan'nel",role:"AI Support & Consultation Assistant",disclosure:"AI can make mistakes."},intent:"error",answer:error instanceof Error?error.message:"Unable to answer.",nextActions:["Try again or use Contact Us"],humanReviewRequired:true,confidence:0,policyNotices:["Do not enter secrets or protected health information."]});
    }finally{setBusy(false)}
  }
  return <section className="section">
    <div className="eyebrow">AI support • governed consultation</div>
    <h1>Andreaa Chan&apos;nel</h1>
    <p className="lead">A policy-governed AI support interface for products, training, facility workflows, business services, integrations, billing states, and technical navigation.</p>
    <div className="notice"><strong>AI notice:</strong> Andreaa Chan&apos;nel is an AI assistant, not a human employee or licensed clinician, attorney, tax professional, regulator, or government representative. AI can make mistakes. Do not enter passwords, SSNs, ITINs, full card data, bank credentials, API keys, or protected health information.</div>
    <form className="panel" onSubmit={submit} style={{marginTop:"1.5rem"}}>
      <label>How can Andreaa help?
        <textarea value={message} onChange={event=>setMessage(event.target.value)} maxLength={4000} required placeholder="Ask about products, training, facility support, a filing workflow, integrations, invoices, or the application."/>
      </label>
      <div className="actions"><button className="button buttonPrimary" disabled={busy}>{busy?"Reviewing…":"Ask Andreaa"}</button><a className="button buttonSecondary" href="/contact">Contact a human</a></div>
    </form>
    {reply&&<article className="panel" style={{marginTop:"1.5rem"}}>
      <span className="badge">{reply.intent} • confidence {Math.round(reply.confidence*100)}%</span>
      <h2>{reply.persona.displayName}</h2>
      <p className="lead">{reply.answer}</p>
      {reply.humanReviewRequired&&<p className="notice">Human/professional review is required before relying on this response for a regulated or high-impact action.</p>}
      <h3>Next actions</h3>
      <ul>{reply.nextActions.map(action=><li key={action}>{action}</li>)}</ul>
      <small>{reply.policyNotices.join(" ")}</small>
    </article>}
  </section>;
}
