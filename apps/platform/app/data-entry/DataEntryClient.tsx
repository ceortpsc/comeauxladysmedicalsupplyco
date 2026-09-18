"use client";

import { useEffect, useMemo, useState } from "react";

type Field={id:string;label:string;kind:string;required:boolean;description:string;options?:string[]};
type FormDef={id:string;title:string;purpose:string;fields:Field[];disclaimer:string};

export default function DataEntryClient(){
  const [forms,setForms]=useState<FormDef[]>([]);
  const [formId,setFormId]=useState("");
  const [values,setValues]=useState<Record<string,unknown>>({});
  const [result,setResult]=useState<string|null>(null);
  useEffect(()=>{fetch("/api/data-entry/forms").then(r=>r.json()).then(body=>{setForms(body.forms||[]);setFormId(body.forms?.[0]?.id||"")})},[]);
  const form=useMemo(()=>forms.find(item=>item.id===formId),[forms,formId]);
  async function process(){
    const response=await fetch("/api/data-entry/process",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({formId,values,includeAiAssist:true})});
    setResult(JSON.stringify(await response.json(),null,2));
  }
  return <section className="section">
    <div className="eyebrow">Data Entry Engine</div><h1>Registry-driven forms with AI assist</h1>
    <p className="lead">All fields are versioned, validated, sensitivity-classified, and governed. AI suggestions are reviewable suggestions—not authoritative facts.</p>
    <div className="grid" style={{gridTemplateColumns:"minmax(240px,.7fr) minmax(0,1.3fr)"}}>
      <aside className="card"><h3>Form registry</h3><div className="list">{forms.map(item=><button key={item.id} className="button buttonSecondary" onClick={()=>{setFormId(item.id);setValues({});setResult(null)}}>{item.title}</button>)}</div></aside>
      <div className="panel">
        {form?<><span className="badge">{form.id}</span><h2>{form.title}</h2><p>{form.purpose}</p><p className="notice">{form.disclaimer}</p>
        <div className="formGrid">{form.fields.map(field=><label key={field.id}>{field.label}<small>{field.description}</small>{field.kind==="select"?<select value={String(values[field.id]??"")} onChange={e=>setValues(v=>({...v,[field.id]:e.target.value}))}><option value="">Select…</option>{field.options?.map(option=><option key={option}>{option}</option>)}</select>:field.kind==="textarea"?<textarea value={String(values[field.id]??"")} onChange={e=>setValues(v=>({...v,[field.id]:e.target.value}))}/>:<input type={field.kind==="email"?"email":field.kind==="number"||field.kind==="currency"?"number":"text"} value={String(values[field.id]??"")} onChange={e=>setValues(v=>({...v,[field.id]:field.kind==="number"||field.kind==="currency"?Number(e.target.value):e.target.value}))}/>}</label>)}</div>
        <div className="actions"><button className="button buttonPrimary" onClick={process}>Validate + AI assist</button></div></>:<p>Loading form registry…</p>}
      </div>
    </div>
    {result&&<pre style={{marginTop:"1.5rem"}}>{JSON.stringify(result,null,2)}</pre>}
  </section>
}
