import { CATEGORIES, PRODUCTS } from "@comeaux/catalog";

export const revalidate = 300;

export default function StorePage(){return <section className="section"><div className="eyebrow">Commerce • ISR catalog</div><h1>Nursing & clinical supplies</h1><p className="lead">Role-aware catalog seeded for LVNs, RNs, CNAs, Medication Aides, students and clinic onboarding teams.</p><div className="actions">{CATEGORIES.map(c=><span className="badge" key={c.id}>{c.name}</span>)}</div><div className="grid" style={{marginTop:"1.5rem"}}>{PRODUCTS.map(p=><article className="card" key={p.sku}><span className="badge">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p><div className="price">${(p.priceCents/100).toFixed(2)}</div><p>Seed quantity: {p.quantityOnHand} • {p.roleTags.join(" / ")}</p></article>)}</div></section>}
