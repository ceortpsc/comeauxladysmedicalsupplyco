export type Scenario = {id:string;prompt:string;expected:string;safety:string};

const SCENARIOS: Record<string,Scenario> = {
  "resident-rights": {id:"resident-rights",prompt:"A resident declines routine care and appears frustrated. What should the learner do first?",expected:"Respect the refusal, preserve dignity, clarify the resident's concern, ensure immediate safety and report/document according to role and facility policy.",safety:"Do not coerce care or exceed assigned scope."},
  "change-in-condition": {id:"change-in-condition",prompt:"A learner notices a meaningful change from the resident's usual condition during routine care. What is the safe response?",expected:"Stop nonessential activity, ensure immediate safety, promptly report objective observations to the supervising licensed nurse and document within authorized workflow.",safety:"The simulation does not diagnose or prescribe treatment."},
  "medication-question": {id:"medication-question",prompt:"During a medication-related workflow, the order or label appears inconsistent with the expected record. What is the appropriate action?",expected:"Do not proceed based on assumption. Pause the workflow and escalate the discrepancy to the authorized supervising nurse/pharmacist according to policy.",safety:"No dosage calculation or medication-administration instructions are provided in unsupervised simulation."}
};

export function createScriptedScenario(id:string):Scenario{return SCENARIOS[id]||SCENARIOS["change-in-condition"]}

export interface SimulationProvider { generate(topic:string,context?:Record<string,unknown>):Promise<Scenario> }

export class ScriptedSimulationProvider implements SimulationProvider { async generate(topic:string){return createScriptedScenario(topic)} }
