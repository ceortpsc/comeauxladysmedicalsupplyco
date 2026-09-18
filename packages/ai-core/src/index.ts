export type Scenario = {id:string;prompt:string;expected:string;safety:string};

const SCENARIOS: Record<string,Scenario> = {
  "resident-rights": {id:"resident-rights",prompt:"A resident declines routine care and appears frustrated. What should the learner do first?",expected:"Respect the refusal, preserve dignity, clarify the resident's concern, ensure immediate safety and report/document according to role and facility policy.",safety:"Do not coerce care or exceed assigned scope."},
  "change-in-condition": {id:"change-in-condition",prompt:"A learner notices a meaningful change from the resident's usual condition during routine care. What is the safe response?",expected:"Stop nonessential activity, ensure immediate safety, promptly report objective observations to the supervising licensed nurse and document within authorized workflow.",safety:"The simulation does not diagnose or prescribe treatment."},
  "medication-question": {id:"medication-question",prompt:"During a medication-related workflow, the order or label appears inconsistent with the expected record. What is the appropriate action?",expected:"Do not proceed based on assumption. Pause the workflow and escalate the discrepancy to the authorized supervising nurse/pharmacist according to policy.",safety:"No dosage calculation or medication-administration instructions are provided in unsupervised simulation."}
};

export function createScriptedScenario(id:string):Scenario{return SCENARIOS[id]||SCENARIOS["change-in-condition"]}

export interface SimulationProvider { generate(topic:string,context?:Record<string,unknown>):Promise<Scenario> }

export class ScriptedSimulationProvider implements SimulationProvider { async generate(topic:string){return createScriptedScenario(topic)} }

export const ANDREAA_CHAN_NEL = {
  id:"andreaa-channel",
  displayName:"Andreaa Chan'nel",
  role:"AI Support & Consultation Assistant",
  disclosure:"Andreaa Chan'nel is an AI assistant, not a human employee or licensed clinician, attorney, tax professional, regulator, or government representative. AI can make mistakes and may provide incomplete information.",
  operatingRules:[
    "State uncertainty and source boundaries.",
    "Do not claim that external filings, payments, credentials, approvals, emails, or regulatory submissions succeeded without authoritative evidence.",
    "Escalate regulated, legal, tax, clinical, billing-dispute, identity, and policy-exception matters for human review.",
    "Never request passwords, SSNs, ITINs, full card data, bank credentials, API keys, or protected health information in general chat.",
    "Use approved catalog, program, policy, and integration registries as the internal source of truth.",
    "Honor the $0-only infrastructure rule; billable actions remain blocked until separately authorized."
  ]
} as const;

export type SupportIntent = "catalog"|"learning"|"facility"|"business"|"integration"|"billing"|"technical"|"contact"|"general";
export type SupportReply = {
  persona:typeof ANDREAA_CHAN_NEL;
  intent:SupportIntent;
  answer:string;
  nextActions:string[];
  humanReviewRequired:boolean;
  confidence:number;
  policyNotices:string[];
};

function classifySupportIntent(message:string):SupportIntent{
  const text=message.toLowerCase();
  if (/product|sku|stock|scrub|supply|price|color|size/.test(text)) return "catalog";
  if (/course|class|academy|lms|training|cna|medication aide|module/.test(text)) return "learning";
  if (/facility|ltc|survey|qapi|incident|tulip|hhsc/.test(text)) return "facility";
  if (/llc|ein|business|formation|secretary of state/.test(text)) return "business";
  if (/api|integration|handoff|connector|webhook|openapi/.test(text)) return "integration";
  if (/invoice|billing|payment|refund|charge/.test(text)) return "billing";
  if (/bug|error|login|technical|server|browser|favicon|css/.test(text)) return "technical";
  if (/contact|call|email|representative|human/.test(text)) return "contact";
  return "general";
}

export function respondAsAndreaa(message:string):SupportReply{
  const cleaned=message.trim();
  const intent=classifySupportIntent(cleaned);
  const base:Record<SupportIntent,string>={
    catalog:"I can help locate products, explain seeded SKUs, colors, sizes, inventory states, and catalog claim boundaries. Product specifications must match the actual sourced item before fulfillment.",
    learning:"I can explain the four seeded learning tracks, LMS workflow, assessments, remediation, and approval gates. Program publication does not mean HHSC approval or credential issuance.",
    facility:"I can help organize facility-readiness workflows, policy references, evidence packets, and escalation paths. Regulatory reporting and licensed-clinical decisions require the authorized facility team and current rule verification.",
    business:"I can prepare and validate non-sensitive business filing data and route it to an official portal. Government attestation, identity verification, fees, submission, and acceptance remain external unless confirmed by an authorized connector.",
    integration:"I can explain the contract-first internal/external gateway, available adapters, validation, redaction, evidence hashes, and handoff states. Prepared is not the same as submitted or accepted.",
    billing:"I can explain invoice states and reconcile internal records. Live charging remains disabled under the $0-only mandate, and payment settlement must come from the authorized payment provider.",
    technical:"I can help identify application routes, APIs, build/runtime states, and known configuration boundaries. I should not claim a deployment is healthy without runtime evidence.",
    contact:"I can prepare a support/contact request and route you to the Contact Us surface. Delivery is not claimed until a configured provider returns evidence.",
    general:"I can help with products, training, facility support, business services, integrations, policies, and technical navigation. I will identify when a human or external authority must take over."
  };
  const highRisk=/diagnos|medication|dose|legal advice|lawsuit|tax advice|ssn|itin|password|card number|bank|identity document|emergency/i.test(cleaned);
  const notices=[ANDREAA_CHAN_NEL.disclosure];
  if(highRisk) notices.push("This request requires a stricter human/professional review boundary; do not place sensitive credentials or protected health information in chat.");
  return {
    persona:ANDREAA_CHAN_NEL,
    intent,
    answer:base[intent],
    nextActions:intent==="contact"?["Open Contact Us","Describe the request without secrets","Submit for human review"]:["Review the relevant platform page","Confirm authoritative source data","Escalate if an external or licensed decision is required"],
    humanReviewRequired:highRisk||["facility","business","billing"].includes(intent),
    confidence:highRisk?.7:.86,
    policyNotices:notices
  };
}
