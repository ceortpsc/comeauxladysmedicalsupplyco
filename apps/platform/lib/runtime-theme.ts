export type RuntimeTheme={
  id:string;
  title:string;
  slug:string;
  sourceMode:"calendar_rules"|"configured_signals";
  signals:string[];
  focus:string[];
  palette:{name:string;primary:string;accent:string;background:string};
  generatedAt:string;
  expiresAt:string;
  disclosure:string;
};

const rules=[
  {months:[1,2],slug:"winter-readiness",title:"Winter Clinical Readiness",focus:["skin integrity","hydration","infection prevention"]},
  {months:[3,4],slug:"spring-survey-readiness",title:"Spring Survey Readiness",focus:["QAPI","competency refreshers","documentation"]},
  {months:[5,6],slug:"nurse-care-team",title:"Nurse & Care Team Appreciation",focus:["recognition","uniforms","onboarding kits"]},
  {months:[7,8],slug:"skills-lab",title:"Skills Lab & Back-to-Training",focus:["CNA skills","medication aide study","assessment tools"]},
  {months:[9,10],slug:"fall-prevention",title:"Fall Prevention & LTC Safety",focus:["fall risk","mobility","resident safety"]},
  {months:[11,12],slug:"year-end-compliance",title:"Year-End Compliance & Staff Readiness",focus:["annual training","competencies","policy review"]}
];

export function generateRuntimeTheme(signals:string[]=[]):RuntimeTheme{
  const now=new Date();
  const month=now.getUTCMonth()+1;
  const rule=rules.find(r=>r.months.includes(month))??rules[0];
  const clean=signals.map(String).map(s=>s.trim()).filter(Boolean).slice(0,8);
  const signalMode=clean.length>0;
  return {
    id:`theme-${now.toISOString().slice(0,13).replace(/[:T]/g,"-")}`,
    title:signalMode?`What's Hot Now: ${clean[0]}`:rule.title,
    slug:rule.slug,
    sourceMode:signalMode?"configured_signals":"calendar_rules",
    signals:clean,
    focus:signalMode?[...new Set([...clean,...rule.focus])].slice(0,6):rule.focus,
    palette:{name:"Care Team Purple",primary:"#32113F",accent:"#EC4FA0",background:"#FFFFFF"},
    generatedAt:now.toISOString(),
    expiresAt:new Date(now.getTime()+60*60*1000).toISOString(),
    disclosure:signalMode
      ?"Generated from configured signals; human review is required before publishing factual trend claims."
      :"Generated from calendar and policy-safe merchandising rules. It is not a claim of live internet trend data."
  };
}
