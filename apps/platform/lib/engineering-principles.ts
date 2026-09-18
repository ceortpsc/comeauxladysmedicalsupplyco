import registry from "../../../config/engineering-principles.json";

export type EngineeringDomain = { id:string; name:string; mandates:string[] };
export type EngineeringRegistry = {
  version:string;
  authority:string;
  truthStates:string[];
  universalMandates:string[];
  domains:EngineeringDomain[];
};

export const ENGINEERING_PRINCIPLES = registry as EngineeringRegistry;

export function engineeringPrincipleSummary(){
  return {
    version:ENGINEERING_PRINCIPLES.version,
    authority:ENGINEERING_PRINCIPLES.authority,
    truthStates:ENGINEERING_PRINCIPLES.truthStates,
    domainCount:ENGINEERING_PRINCIPLES.domains.length,
    mandateCount:ENGINEERING_PRINCIPLES.universalMandates.length + ENGINEERING_PRINCIPLES.domains.reduce((sum,d)=>sum+d.mandates.length,0)
  };
}
