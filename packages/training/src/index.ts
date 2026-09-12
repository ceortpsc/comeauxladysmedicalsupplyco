export const LEARNING_ENGINE = ["scripted lecture","guided reading","knowledge check","case study","graded quiz","assignment","simulation","skills gate","remediation","final review"] as const;

export const PROGRAMS = [
  {
    code:"TX-MA-BASIC-140",
    name:"Texas Medication Aide Basic Program",
    hours:140,
    modules:14,
    status:"approval-required",
    summary:"School-administered Texas Medication Aide curriculum architecture with classroom/theory, return-skills laboratory and supervised clinical gates. Publication does not represent HHSC school or program approval."
  },
  {
    code:"TX-MA-RENEW-8",
    name:"Medication Aide Renewal Refresher — 8 Hour Enhanced",
    hours:8,
    modules:8,
    status:"approval-required",
    summary:"Enhanced refresher structured as seven hours intended for approved CE content plus a separate one-hour remediation/assessment lab. The state minimum must be represented according to current HHSC requirements, not by marketing language."
  },
  {
    code:"TX-CNA-FOUNDATIONS",
    name:"Nursing Assistant Care Foundations",
    hours:100,
    modules:12,
    status:"approval-required",
    summary:"Nurse-aide learning architecture aligned to Texas long-term-care training domains, with classroom and supervised skills/clinical tracking gates."
  },
  {
    code:"CLINIC-ONBOARDING",
    name:"Clinic & LTC Workforce Onboarding",
    hours:8,
    modules:8,
    status:"internal-training",
    summary:"Configurable onboarding for facility policy, communication, safety, documentation, resident rights, infection prevention and role-specific competency evidence."
  }
] as const;
