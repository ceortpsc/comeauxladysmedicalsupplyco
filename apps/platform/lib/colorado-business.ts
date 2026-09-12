export const COLORADO_SOS = {
  jurisdiction: "Colorado",
  filingType: "LLC Articles of Organization",
  officialBusinessHome: "https://www.coloradosos.gov/pubs/business/businessHome.html",
  officialNewBusinessFiling: "https://www.coloradosos.gov/biz/FileDoc.do",
  officialNameAvailability: "https://www.coloradosos.gov/biz/NameCriteria.do",
  officialChecklist: "https://www.sos.state.co.us/pubs/business/helpFiles/LLCChecklist.pdf",
  registeredAgentRequirements: "https://www.coloradosos.gov/pubs/business/RAchanges.html",
  standardArticlesFeeCents: 5000,
  standardTradeNameFeeCents: 2000,
  verifyFeeAtSubmission: true,
  directApiSubmissionSupported: false,
  transmittalMode: "assisted_official_handoff" as const,
  feeRelief: {
    active: false,
    status: "historical_program_expired" as const,
    historicalProgram: "Colorado Business Fee Relief Act / HB22-1001",
    historicalReduction: "LLC $50 -> $1; trade name $20 -> $1",
    historicalWindow: "calendar years 2022 and 2023",
    rule: "Never represent a waiver or reduced state fee as active unless the Colorado Secretary of State publishes a current program and the application is eligible."
  }
} as const;

export type ManagementMode = "members" | "managers";
export type RegisteredAgentType = "individual" | "entity";
export type RegisteredAgentVerification = "colorado_id" | "agent_passcode" | "entity_good_standing";

export type ColoradoLLCDraft = {
  legalName: string;
  principalOffice: { street1: string; street2?: string; city: string; state: string; postalCode: string; country: string };
  mailingSameAsPrincipal: boolean;
  mailingAddress?: { street1: string; street2?: string; city: string; state: string; postalCode: string; country: string };
  registeredAgent: {
    type: RegisteredAgentType;
    name: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    consentConfirmed: boolean;
    verificationMethod: RegisteredAgentVerification | "";
    entityGoodStandingConfirmed?: boolean;
  };
  management: ManagementMode | "";
  atLeastOneMemberConfirmed: boolean;
  organizer: { fullName: string; mailingStreet1: string; mailingStreet2?: string; city: string; state: string; postalCode: string; country: string };
  delayedEffectiveDate?: string;
  emailNotifications: boolean;
  feeReliefRequested: boolean;
  stateFeeAcknowledged: boolean;
};

export type ValidationIssue = { field: string; message: string };

const isBlank = (value?: string) => !value || value.trim().length === 0;
const isPoBox = (value: string) => /\bP\.?\s*O\.?\s*BOX\b/i.test(value);
const hasLLCDesignator = (name: string) => /(limited liability company|ltd\.? liability company|limited liability co\.?|ltd\.? liability co\.?|\blimited\b|\bl\.l\.c\.?\b|\bllc\b|\bltd\.?\b)/i.test(name);

export function validateColoradoLLCDraft(draft: ColoradoLLCDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const required = (field: string, value?: string) => {
    if (isBlank(value)) issues.push({ field, message: "Required." });
  };

  required("legalName", draft.legalName);
  if (!isBlank(draft.legalName) && !hasLLCDesignator(draft.legalName)) {
    issues.push({ field: "legalName", message: "Colorado LLC names must include an accepted LLC designator such as LLC or Limited Liability Company." });
  }

  required("principalOffice.street1", draft.principalOffice.street1);
  required("principalOffice.city", draft.principalOffice.city);
  required("principalOffice.state", draft.principalOffice.state);
  required("principalOffice.postalCode", draft.principalOffice.postalCode);
  required("principalOffice.country", draft.principalOffice.country);
  if (isPoBox(draft.principalOffice.street1)) {
    issues.push({ field: "principalOffice.street1", message: "Principal office street address must be a physical street address, not a P.O. Box." });
  }

  if (!draft.mailingSameAsPrincipal && draft.mailingAddress) {
    required("mailingAddress.street1", draft.mailingAddress.street1);
    required("mailingAddress.city", draft.mailingAddress.city);
    required("mailingAddress.state", draft.mailingAddress.state);
    required("mailingAddress.postalCode", draft.mailingAddress.postalCode);
  }

  required("registeredAgent.name", draft.registeredAgent.name);
  required("registeredAgent.street1", draft.registeredAgent.street1);
  required("registeredAgent.city", draft.registeredAgent.city);
  required("registeredAgent.postalCode", draft.registeredAgent.postalCode);
  if (draft.registeredAgent.state.toUpperCase() !== "CO") {
    issues.push({ field: "registeredAgent.state", message: "Registered agent street address must be in Colorado." });
  }
  if (isPoBox(draft.registeredAgent.street1)) {
    issues.push({ field: "registeredAgent.street1", message: "Registered agent street address must be a physical Colorado street address." });
  }
  if (!draft.registeredAgent.consentConfirmed) {
    issues.push({ field: "registeredAgent.consentConfirmed", message: "Registered agent consent must be confirmed before filing." });
  }
  if (!draft.registeredAgent.verificationMethod) {
    issues.push({ field: "registeredAgent.verificationMethod", message: "Select the Colorado SOS registered-agent verification path." });
  }
  if (draft.registeredAgent.type === "entity" && !draft.registeredAgent.entityGoodStandingConfirmed) {
    issues.push({ field: "registeredAgent.entityGoodStandingConfirmed", message: "Entity registered agents must be registered and in good standing in Colorado." });
  }
  if (draft.registeredAgent.type === "individual" && draft.registeredAgent.verificationMethod === "entity_good_standing") {
    issues.push({ field: "registeredAgent.verificationMethod", message: "Individual agents must use Colorado ID verification or the SOS agent-passcode process." });
  }
  if (draft.registeredAgent.type === "entity" && draft.registeredAgent.verificationMethod !== "entity_good_standing") {
    issues.push({ field: "registeredAgent.verificationMethod", message: "Entity agents use the entity-good-standing verification path." });
  }

  if (!draft.management) issues.push({ field: "management", message: "Choose member-managed or manager-managed." });
  if (!draft.atLeastOneMemberConfirmed) issues.push({ field: "atLeastOneMemberConfirmed", message: "Colorado requires confirmation that the LLC has at least one member." });

  required("organizer.fullName", draft.organizer.fullName);
  required("organizer.mailingStreet1", draft.organizer.mailingStreet1);
  required("organizer.city", draft.organizer.city);
  required("organizer.state", draft.organizer.state);
  required("organizer.postalCode", draft.organizer.postalCode);
  required("organizer.country", draft.organizer.country);

  if (draft.feeReliefRequested && !COLORADO_SOS.feeRelief.active) {
    issues.push({ field: "feeReliefRequested", message: "No current Colorado SOS LLC fee-relief program has been verified. The historical HB22-1001 reduction applied in 2022–2023." });
  }
  if (!draft.stateFeeAcknowledged) {
    issues.push({ field: "stateFeeAcknowledged", message: "Acknowledge that state filing fees are separate and must be confirmed at the official portal." });
  }

  return issues;
}

export function getColoradoLLCChecklist() {
  return [
    "Legal LLC name and name-availability review",
    "Principal office street and mailing address",
    "Colorado registered agent identity, street address and consent",
    "Registered-agent residency/eligibility verification path",
    "Member-managed or manager-managed selection",
    "At least one member confirmation",
    "Organizer name and mailing address",
    "Optional delayed effective date",
    "State-fee acknowledgment and live fee confirmation",
    "Final review in the official Colorado SOS portal"
  ];
}
