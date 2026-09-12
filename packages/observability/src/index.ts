export type AuditEvent = {eventId:string;at:string;actorId?:string;action:string;entityType:string;entityId?:string;environment:string;requestId?:string;metadata?:Record<string,unknown>};
export function auditEvent(input:Omit<AuditEvent,"eventId"|"at">):AuditEvent{return {eventId:crypto.randomUUID(),at:new Date().toISOString(),...input}}
