import { createHash, randomUUID } from "node:crypto";

export type ExternalAction = "prepare" | "handoff" | "submit" | "verify" | "reconcile" | "charge";
export type AdapterMode = "assisted_handoff" | "resource_link" | "verified_connector" | "configuration_only";
export type EnvelopeState =
  | "draft"
  | "blocked_validation"
  | "blocked_cost_gate"
  | "blocked_external_write"
  | "ready_for_handoff"
  | "prepared"
  | "recorded_unverified";

export type ExternalAdapter = {
  id: string;
  label: string;
  category: "business_filing" | "tax_identity" | "regulatory" | "credential" | "payments" | "intellectual_property" | "communications" | "infrastructure";
  agencyOrProvider: string;
  mode: AdapterMode;
  officialUrl: string | null;
  directWrite: boolean;
  externalFeeRequired: boolean;
  zeroCostActions: ExternalAction[];
  billableActions: ExternalAction[];
  requiredFields: string[];
  prohibitedStoredFields: string[];
  humanApproval: boolean;
  disclosure: string;
};

const GLOBAL_PROHIBITED_FIELDS = [
  "ssn",
  "socialSecurityNumber",
  "itin",
  "password",
  "passcode",
  "secret",
  "secretKey",
  "apiKey",
  "accessToken",
  "refreshToken",
  "cardNumber",
  "cvv",
  "cvc",
  "bankAccount",
  "routingNumber",
  "driversLicenseNumber",
  "stateIdNumber"
] as const;

export const EXTERNAL_ADAPTERS: readonly ExternalAdapter[] = [
  {
    id: "irs-ein",
    label: "IRS EIN Assistant",
    category: "tax_identity",
    agencyOrProvider: "Internal Revenue Service",
    mode: "assisted_handoff",
    officialUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number",
    directWrite: false,
    externalFeeRequired: false,
    zeroCostActions: ["prepare", "handoff"],
    billableActions: [],
    requiredFields: ["legalName", "entityType", "responsiblePartyName", "stateOrganized"],
    prohibitedStoredFields: [...GLOBAL_PROHIBITED_FIELDS, "responsiblePartySSN", "responsiblePartyITIN"],
    humanApproval: true,
    disclosure: "The platform may prepare EIN application data and route the responsible party to the official IRS process. It does not sign, attest, or submit an EIN application for the responsible party."
  },
  {
    id: "colorado-sos-llc",
    label: "Colorado LLC Formation",
    category: "business_filing",
    agencyOrProvider: "Colorado Secretary of State",
    mode: "assisted_handoff",
    officialUrl: "https://www.coloradosos.gov/biz/FileDoc.do",
    directWrite: false,
    externalFeeRequired: true,
    zeroCostActions: ["prepare", "handoff"],
    billableActions: ["submit"],
    requiredFields: ["legalName", "principalAddress", "registeredAgentName", "registeredAgentAddress", "managementType", "organizerName"],
    prohibitedStoredFields: [...GLOBAL_PROHIBITED_FIELDS],
    humanApproval: true,
    disclosure: "Preparation and official-portal handoff can be performed at no platform charge. State filing fees, attestations, identity checks, and final submission remain external."
  },
  {
    id: "texas-sos-llc",
    label: "Texas LLC Formation",
    category: "business_filing",
    agencyOrProvider: "Texas Secretary of State",
    mode: "assisted_handoff",
    officialUrl: "https://direct.sos.state.tx.us/",
    directWrite: false,
    externalFeeRequired: true,
    zeroCostActions: ["prepare", "handoff"],
    billableActions: ["submit"],
    requiredFields: ["legalName", "registeredAgentName", "registeredOffice", "governingAuthority", "organizerName"],
    prohibitedStoredFields: [...GLOBAL_PROHIBITED_FIELDS],
    humanApproval: true,
    disclosure: "The platform prepares filing information and handoff evidence but does not represent a Texas entity as formed until official state acceptance is evidenced. Government filing fees remain external."
  },
  {
    id: "texas-hhsc-tulip",
    label: "Texas HHSC TULIP Regulatory Handoff",
    category: "regulatory",
    agencyOrProvider: "Texas Health and Human Services",
    mode: "assisted_handoff",
    officialUrl: "https://txhhs.my.site.com/TULIP/s/",
    directWrite: false,
    externalFeeRequired: false,
    zeroCostActions: ["prepare", "handoff"],
    billableActions: [],
    requiredFields: ["packetType", "facilityOrProgramName", "preparedBy", "evidenceIndex"],
    prohibitedStoredFields: [...GLOBAL_PROHIBITED_FIELDS, "residentSSN", "medicalRecordPassword"],
    humanApproval: true,
    disclosure: "TULIP packets are preparation and handoff artifacts. Submission, acceptance, licensure, approval, and survey outcomes are never inferred from packet preparation."
  },
  {
    id: "texas-bon",
    label: "Texas Board of Nursing Verification Boundary",
    category: "credential",
    agencyOrProvider: "Texas Board of Nursing",
    mode: "resource_link",
    officialUrl: "https://www.bon.texas.gov/",
    directWrite: false,
    externalFeeRequired: false,
    zeroCostActions: ["prepare", "handoff", "verify"],
    billableActions: [],
    requiredFields: ["credentialHolderName"],
    prohibitedStoredFields: [...GLOBAL_PROHIBITED_FIELDS, "fullLicenseCredential"],
    humanApproval: true,
    disclosure: "Credential decisions require an authorized source check and current evidence. The platform does not scrape restricted systems or manufacture verification results."
  },
  {
    id: "stripe",
    label: "Stripe Payment Adapter",
    category: "payments",
    agencyOrProvider: "Stripe",
    mode: "configuration_only",
    officialUrl: "https://dashboard.stripe.com/",
    directWrite: false,
    externalFeeRequired: true,
    zeroCostActions: ["prepare", "reconcile"],
    billableActions: ["charge"],
    requiredFields: ["invoiceId", "amount", "currency"],
    prohibitedStoredFields: [...GLOBAL_PROHIBITED_FIELDS, "paymentMethodToken"],
    humanApproval: true,
    disclosure: "Live payment collection is disabled by the platform's zero-cost mandate because payment processing can incur transaction fees. Invoice preparation and non-charge reconciliation records remain available."
  },
  {
    id: "uspto-trademark",
    label: "USPTO Trademark Filing Assistant",
    category: "intellectual_property",
    agencyOrProvider: "United States Patent and Trademark Office",
    mode: "assisted_handoff",
    officialUrl: "https://www.uspto.gov/trademarks/apply",
    directWrite: false,
    externalFeeRequired: true,
    zeroCostActions: ["prepare", "handoff"],
    billableActions: ["submit"],
    requiredFields: ["mark", "ownerName", "goodsOrServicesDescription"],
    prohibitedStoredFields: [...GLOBAL_PROHIBITED_FIELDS],
    humanApproval: true,
    disclosure: "The platform can inventory marks and prepare filing information. It does not provide a legal conclusion on registrability, patentability, infringement, ownership, or filing success. USPTO filing fees remain external."
  },
  {
    id: "email-client-handoff",
    label: "Email Client Handoff",
    category: "communications",
    agencyOrProvider: "User-selected email client",
    mode: "resource_link",
    officialUrl: null,
    directWrite: false,
    externalFeeRequired: false,
    zeroCostActions: ["prepare", "handoff"],
    billableActions: [],
    requiredFields: ["recipient", "subject", "body"],
    prohibitedStoredFields: [...GLOBAL_PROHIBITED_FIELDS],
    humanApproval: true,
    disclosure: "The platform may prepare a message or mailto handoff. It does not claim that an email was delivered unless a configured provider returns delivery evidence."
  },
  {
    id: "render-runtime",
    label: "Render Runtime Operations",
    category: "infrastructure",
    agencyOrProvider: "Render",
    mode: "verified_connector",
    officialUrl: "https://dashboard.render.com/",
    directWrite: false,
    externalFeeRequired: false,
    zeroCostActions: ["prepare", "verify"],
    billableActions: [],
    requiredFields: ["resourceType", "operation"],
    prohibitedStoredFields: [...GLOBAL_PROHIBITED_FIELDS, "renderApiKey"],
    humanApproval: true,
    disclosure: "The application runtime does not embed Render credentials. Infrastructure writes are performed only through separately authorized operational connectors and remain subject to the zero-cost policy."
  }
] as const;

export type PrepareEnvelopeInput = {
  adapterId: string;
  action: ExternalAction;
  actorRole?: string;
  payload: Record<string, unknown>;
  zeroCostOnly?: boolean;
};

export type TransmittalEnvelope = {
  envelopeId: string;
  adapterId: string;
  action: ExternalAction;
  state: EnvelopeState;
  createdAt: string;
  actorRole: string;
  officialUrl: string | null;
  directWriteAttempted: false;
  zeroCostPolicy: "enforced" | "not_enforced";
  missingFields: string[];
  redactedFields: string[];
  sanitizedPayload: Record<string, unknown>;
  evidenceHash: string;
  disclosure: string;
  nextAction: string;
};

export function getExternalAdapter(id: string) {
  return EXTERNAL_ADAPTERS.find(adapter => adapter.id === id);
}

function hasValue(value: unknown) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function scrubObject(value: unknown, blockedKeys: Set<string>, redacted: Set<string>): unknown {
  if (Array.isArray(value)) return value.map(item => scrubObject(item, blockedKeys, redacted));
  if (!value || typeof value !== "object") return value;
  const output: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (blockedKeys.has(key.toLowerCase())) {
      output[key] = "[REDACTED_BY_POLICY]";
      redacted.add(key);
      continue;
    }
    output[key] = scrubObject(child, blockedKeys, redacted);
  }
  return output;
}

export function prepareExternalEnvelope(input: PrepareEnvelopeInput): TransmittalEnvelope {
  const adapter = getExternalAdapter(input.adapterId);
  if (!adapter) throw new Error(`Unknown external adapter: ${input.adapterId}`);

  const zeroCostOnly = input.zeroCostOnly !== false;
  const missingFields = adapter.requiredFields.filter(field => !hasValue(input.payload[field]));
  const blockedKeys = new Set(adapter.prohibitedStoredFields.map(field => field.toLowerCase()));
  const redacted = new Set<string>();
  const sanitizedPayload = scrubObject(input.payload, blockedKeys, redacted) as Record<string, unknown>;

  let state: EnvelopeState = "prepared";
  let nextAction = "Internal preparation is complete.";

  if (missingFields.length) {
    state = "blocked_validation";
    nextAction = "Supply the missing required fields before handoff.";
  } else if (zeroCostOnly && adapter.billableActions.includes(input.action)) {
    state = "blocked_cost_gate";
    nextAction = "This action can incur an external fee and is blocked by the $0-only policy. Preparation may continue without submission or payment.";
  } else if ((input.action === "submit" || input.action === "charge") && !adapter.directWrite) {
    state = "blocked_external_write";
    nextAction = "No verified direct-write connector is available. Use the official handoff and complete the external action with the authorized person or system.";
  } else if (input.action === "handoff") {
    state = "ready_for_handoff";
    nextAction = adapter.officialUrl
      ? "Open the official destination, review all information, complete required attestations, and retain official confirmation evidence."
      : "Complete the handoff in the user's chosen external client and retain delivery evidence if needed.";
  }

  const core = {
    adapterId: adapter.id,
    action: input.action,
    state,
    missingFields,
    sanitizedPayload
  };
  const evidenceHash = createHash("sha256").update(JSON.stringify(core)).digest("hex");

  return {
    envelopeId: randomUUID(),
    adapterId: adapter.id,
    action: input.action,
    state,
    createdAt: new Date().toISOString(),
    actorRole: input.actorRole || "customer",
    officialUrl: adapter.officialUrl,
    directWriteAttempted: false,
    zeroCostPolicy: zeroCostOnly ? "enforced" : "not_enforced",
    missingFields,
    redactedFields: [...redacted].sort(),
    sanitizedPayload,
    evidenceHash,
    disclosure: adapter.disclosure,
    nextAction
  };
}

export function publicAdapterRegistry() {
  return EXTERNAL_ADAPTERS.map(adapter => ({
    id: adapter.id,
    label: adapter.label,
    category: adapter.category,
    agencyOrProvider: adapter.agencyOrProvider,
    mode: adapter.mode,
    officialUrl: adapter.officialUrl,
    directWrite: adapter.directWrite,
    externalFeeRequired: adapter.externalFeeRequired,
    zeroCostActions: adapter.zeroCostActions,
    billableActions: adapter.billableActions,
    humanApproval: adapter.humanApproval,
    disclosure: adapter.disclosure
  }));
}
