import { CATALOG_SUMMARY, CATEGORIES, PRODUCTS } from "@comeaux/catalog";

export const revalidate = 300;

export default function StorePage(){
  return <section className="section">
    <div className="eyebrow">Luxury commerce • fully seeded catalog</div>
    <h1>Premium nursing, facility & training essentials</h1>
    <p className="lead">Twelve seeded products across all nine departments. Every product starts with 12 units, indexed SKU data, visual assets, luxury pricing, and explicit color/design options.</p>
    <div className="metricGrid" style={{marginTop:"1.5rem"}}>
      <div className="metric"><strong>{CATALOG_SUMMARY.productCount}</strong><span>seed products</span></div>
      <div className="metric"><strong>{CATALOG_SUMMARY.departmentCount}</strong><span>supply departments</span></div>
      <div className="metric"><strong>{CATALOG_SUMMARY.seededQuantityPerProduct}</strong><span>units per seeded product</span></div>
      <div className="metric"><strong>{CATALOG_SUMMARY.totalSeedUnits}</strong><span>total seeded units</span></div>
    </div>
    <div className="actions">{CATEGORIES.map(c=><span className="badge" key={c.id}>{c.name}</span>)}</div>
    <div className="productGrid">
      {PRODUCTS.map(p=><article className="card productCard" key={p.sku}>
        <div className="productMedia"><img src={p.media[0]?.src} alt={p.media[0]?.alt||p.name}/></div>
        <div className="productBody">
          <div className="productMeta"><span className="badge">{p.category}</span><code>{p.sku}</code></div>
          <h3>{p.name}</h3><p>{p.description}</p><p className="marketingLine">{p.marketingLine}</p>
          <div className="price">${(p.priceCents/100).toFixed(2)} <del>${(p.compareAtCents/100).toFixed(2)}</del></div>
          <p><strong>Seed stock:</strong> {p.quantityOnHand}</p>
          <div className="optionList">{p.options.map(option=><div key={option.id}><strong>{option.label}:</strong> {option.values.join(" • ")}</div>)}</div>
          <details><summary>Use & claim boundary</summary><p>{p.claimBoundary}</p></details>
        </div>
      </article>)}
    </div>
  </section>
}
