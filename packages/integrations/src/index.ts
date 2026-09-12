export type ExternalLifecycle = "draft"|"ready_for_transmittal"|"submitted"|"confirmed"|"rejected";
export type RegulatoryHandoff = {agency:string;system:string;kind:string;status:ExternalLifecycle;externalReference?:string;evidence?:Record<string,unknown>};

export const TULIP_INTEGRATION = {
  agency:"Texas Health and Human Services",
  system:"TULIP",
  mode:"assisted-manual",
  directWriteApi:false,
  supportedArtifacts:["school packet","class packet","student roster","completion verification","renewal CE packet","submission evidence"]
} as const;

export function assertExternalTransition(from:ExternalLifecycle,to:ExternalLifecycle){const allowed:Record<ExternalLifecycle,ExternalLifecycle[]>={draft:["ready_for_transmittal"],ready_for_transmittal:["submitted","rejected"],submitted:["confirmed","rejected"],confirmed:[],rejected:["draft"]};if(!allowed[from].includes(to))throw new Error(`Invalid external lifecycle transition: ${from} -> ${to}`);return true}
