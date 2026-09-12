export type PublicationKind = "catalog"|"invoice"|"receipt"|"textbook"|"workbook"|"certificate-record"|"regulatory-packet";
export type PublicationArtifact = {kind:PublicationKind;name:string;version:string;sourceRevision:string;status:"draft"|"reviewed"|"issued";checksumSha256?:string;storageUri?:string};

export const PRINT_PROFILE = {pageSize:"LETTER",bleedInches:0.125,colorMode:"RGB-to-print",accessiblePdf:true,embedMetadata:true,requireRevision:true} as const;
