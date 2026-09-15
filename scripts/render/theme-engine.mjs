const palettes = [
  {name:"Care Team Purple",primary:"#32113F",accent:"#EC4FA0",background:"#FFFFFF"},
  {name:"Clinical Pink",primary:"#6B2F8A",accent:"#D93786",background:"#FFF9FC"},
  {name:"Survey Ready",primary:"#111015",accent:"#7D3FB2",background:"#F7F3FA"},
  {name:"Wound Care Focus",primary:"#4A245A",accent:"#E94C9B",background:"#FFFFFF"}
];

const seasonal = [
  {months:[1,2],slug:"winter-readiness",title:"Winter Clinical Readiness",focus:["skin integrity","hydration","infection prevention"]},
  {months:[3,4],slug:"spring-survey-readiness",title:"Spring Survey Readiness",focus:["QAPI","competency refreshers","documentation"]},
  {months:[5,6],slug:"nurse-care-team",title:"Nurse & Care Team Appreciation",focus:["recognition","uniforms","onboarding kits"]},
  {months:[7,8],slug:"skills-lab",title:"Skills Lab & Back-to-Training",focus:["CNA skills","medication aide study","assessment tools"]},
  {months:[9,10],slug:"fall-prevention",title:"Fall Prevention & LTC Safety",focus:["fall risk","mobility","resident safety"]},
  {months:[11,12],slug:"year-end-compliance",title:"Year-End Compliance & Staff Readiness",focus:["annual training","competencies","policy review"]}
];

function hash(text){let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}

export function generateTheme({now=new Date(),signals=[]}={}){
  const month=now.getUTCMonth()+1;
  const rule=seasonal.find(x=>x.months.includes(month)) ?? seasonal[0];
  const normalizedSignals=signals.filter(Boolean).map(String).slice(0,8);
  const seed=`${now.toISOString().slice(0,10)}|${normalizedSignals.join("|")}|${rule.slug}`;
  const palette=palettes[hash(seed)%palettes.length];
  const signalMode=normalizedSignals.length>0;
  return {
    id:`theme-${now.toISOString().slice(0,10)}-${hash(seed).toString(16)}`,
    title: signalMode ? `What's Hot Now: ${normalizedSignals[0]}` : rule.title,
    slug: rule.slug,
    sourceMode: signalMode ? "configured_signals" : "calendar_rules",
    signals: normalizedSignals,
    focus: signalMode ? [...new Set([...normalizedSignals,...rule.focus])].slice(0,6) : rule.focus,
    palette,
    generatedAt:now.toISOString(),
    expiresAt:new Date(now.getTime()+60*60*1000).toISOString(),
    disclosure:signalMode
      ? "Generated from configured external/internal signals; review before publishing."
      : "Generated from calendar and policy-safe merchandising rules. It is not a claim of live internet trend data."
  };
}
