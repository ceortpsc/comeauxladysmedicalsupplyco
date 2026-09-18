"use client";

import { FormEvent, useState } from "react";

export default function ContactClient(){
  const [result,setResult]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setBusy(true); setResult(null);
    const form=new FormData(event.currentTarget);
    const values=Object.fromEntries(form.entries());
    try{
      const response=await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({values})});
      const body=await response.json(); setResult(JSON.stringify(body,null,2));
    }finally{setBusy(false)}
  }
  return <section className="section">
    <div className="eyebrow">Contact Us</div><h1>Human support intake</h1>
    <p className="lead">Use this form to prepare a validated support packet. In the current $0 preview no outbound ticket/email provider is connected, so the application will not falsely claim delivery.</p>
    <div className="notice">Do not include passwords, SSNs, ITINs, card/bank details, API keys, or protected health information.</div>
    <form className="panel formGrid" onSubmit={submit} style={{marginTop:"1.5rem"}}>
      <label>Name<input name="name" required/></label>
      <label>Email<input name="email" type="email" required/></label>
      <label>Phone<input name="phone" inputMode="tel"/></label>
      <label>Topic<select name="topic" defaultValue="Technical support"><option>Order & product</option><option>Training & LMS</option><option>Facility support</option><option>Business services</option><option>Technical support</option><option>Billing or invoice</option><option>Other</option></select></label>
      <label className="formFull">Message<textarea name="message" required minLength={10} maxLength={4000}/></label>
      <div className="actions formFull"><button className="button buttonPrimary" disabled={busy}>{busy?"Validating…":"Prepare support request"}</button></div>
    </form>
    {result&&<pre style={{marginTop:"1.5rem"}}>{JSON.stringify(result,null,2)}</pre>}
  </section>;
}
