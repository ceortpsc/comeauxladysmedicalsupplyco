"use client";

import {useEffect,useState} from "react";

type Theme={title:string;slug:string;sourceMode:string;focus:string[];palette:{name:string;primary:string;accent:string;background:string};disclosure:string;generatedAt?:string;expiresAt?:string};

export default function WhatsHotPage(){
  const [theme,setTheme]=useState<Theme|null>(null);
  const [source,setSource]=useState("loading");
  useEffect(()=>{fetch("/api/runtime/theme",{cache:"no-store"}).then(r=>r.json()).then(data=>{setTheme(data.theme);setSource(data.source)}).catch(()=>setSource("unavailable"));},[]);
  return <section className="section">
    <p className="eyebrow">Real-time merchandising engine</p>
    <h1>What’s Hot Now</h1>
    <p className="lead">Policy-governed themes for nursing supplies, training, LTC readiness and care-team campaigns. External trend claims are only enabled when configured signals exist.</p>
    <div className="grid">
      <article className="card"><span className="badge">{source}</span><h3>{theme?.title||"Loading current theme…"}</h3><p>{theme?.disclosure||"Retrieving the current governed theme."}</p></article>
      <article className="card"><h3>Focus</h3><p>{theme?.focus?.join(" • ")||"—"}</p></article>
      <article className="card"><h3>Palette</h3><p>{theme?`${theme.palette.name} · ${theme.palette.primary} · ${theme.palette.accent}`:"—"}</p></article>
    </div>
    <div className="notice" style={{marginTop:"1rem"}}>This engine generates merchandising and learning themes. It does not represent unverified social-media or internet trends as real-time facts.</div>
  </section>;
}
