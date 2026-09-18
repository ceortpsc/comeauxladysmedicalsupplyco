import { randomUUID } from "node:crypto";

export type FieldKind = "text"|"email"|"phone"|"number"|"currency"|"date"|"textarea"|"select"|"multiselect"|"checkbox"|"address";
export type Sensitivity = "public"|"internal"|"confidential"|"restricted";
export type FieldStatus = "empty"|"entered"|"suggested"|"validated"|"needs_review"|"blocked";

export type FieldDefinition = {
  id:string;
  label:string;
  kind:FieldKind;
  required:boolean;
  sensitivity:Sensitivity;
  description:string;
  placeholder?:string;
  options?:string[];
  aiAssist:"none"|"normalize"|"suggest"|"classify";
  validation?:{pattern?:string;minLength?:number;maxLength?:number;min?:number;max?:number};
  externalSubmissionAllowed:boolean;
};

export type FormDefinition = {
  id:string;
  version:string;
  title:string;
  purpose:string;
  fields:FieldDefinition[];
  disclaimer:string;
};

export type FieldResult = {
  fieldId:string;
  status:FieldStatus;
  value:unknown;
  errors:string[];
  warnings:string[];
  suggestion?:unknown;
  confidence?:number;
  rationale?:string;
};

export const PROHIBITED_AI_FIELDS = new Set([
  "ssn","itin","password","passcode","secret","apiKey","accessToken","refreshToken","cardNumber","cvv","routingNumber","bankAccount","driversLicenseNumber","stateIdNumber"
].map(v=>v.toLowerCase()));

export const FORM_REGISTRY: FormDefinition[] = [
  {
    id:"customer-contact",version:"1.0.0",title:"Contact & Support Intake",purpose:"Create a support/contact request without collecting prohibited secrets.",
    disclaimer:"Do not submit passwords, SSNs, ITINs, card data, bank data, API keys, or protected health information in this form.",
    fields:[
      {id:"name",label:"Name",kind:"text",required:true,sensitivity:"internal",description:"Person requesting support.",aiAssist:"normalize",externalSubmissionAllowed:true,validation:{minLength:2,maxLength:120}},
      {id:"email",label:"Email",kind:"email",required:true,sensitivity:"confidential",description:"Reply address.",aiAssist:"normalize",externalSubmissionAllowed:true},
      {id:"phone",label:"Phone",kind:"phone",required:false,sensitivity:"confidential",description:"Optional callback number.",aiAssist:"normalize",externalSubmissionAllowed:true},
      {id:"topic",label:"Topic",kind:"select",required:true,sensitivity:"internal",description:"Primary support category.",options:["Order & product","Training & LMS","Facility support","Business services","Technical support","Billing or invoice","Other"],aiAssist:"classify",externalSubmissionAllowed:true},
      {id:"message",label:"Message",kind:"textarea",required:true,sensitivity:"confidential",description:"Describe the request without including secrets or protected health information.",aiAssist:"classify",externalSubmissionAllowed:true,validation:{minLength:10,maxLength:4000}}
    ]
  },
  {
    id:"business-enrollment",version:"1.0.0",title:"Business Enrollment Intake",purpose:"Prepare non-sensitive business filing information for validation and official handoff.",
    disclaimer:"Government fees, attestations, identity verification, signatures, and final submission remain external unless an authorized connector confirms otherwise.",
    fields:[
      {id:"legalName",label:"Legal entity name",kind:"text",required:true,sensitivity:"internal",description:"Proposed or accepted legal business name.",aiAssist:"normalize",externalSubmissionAllowed:true,validation:{minLength:3,maxLength:240}},
      {id:"entityType",label:"Entity type",kind:"select",required:true,sensitivity:"internal",description:"Requested entity classification.",options:["LLC","Corporation","Nonprofit","Sole proprietorship","Other"],aiAssist:"none",externalSubmissionAllowed:true},
      {id:"state",label:"Formation state",kind:"select",required:true,sensitivity:"internal",description:"State or jurisdiction.",options:["Colorado","Texas","Other"],aiAssist:"none",externalSubmissionAllowed:true},
      {id:"principalAddress",label:"Principal office",kind:"address",required:true,sensitivity:"confidential",description:"Principal business office address.",aiAssist:"normalize",externalSubmissionAllowed:true},
      {id:"ownerName",label:"Owner/member name",kind:"text",required:true,sensitivity:"confidential",description:"Owner/member/responsible party name as applicable.",aiAssist:"normalize",externalSubmissionAllowed:true}
    ]
  },
  {
    id:"product-entry",version:"1.0.0",title:"Product Catalog Entry",purpose:"Create or update a governed catalog item.",
    disclaimer:"Clinical or performance claims require substantiation from the actual manufacturer/source documentation before publication.",
    fields:[
      {id:"name",label:"Product name",kind:"text",required:true,sensitivity:"internal",description:"Customer-facing product name.",aiAssist:"normalize",externalSubmissionAllowed:true},
      {id:"category",label:"Department",kind:"select",required:true,sensitivity:"internal",description:"Catalog department.",options:["Assessment Tools","Clinical Tools","Wound Care","Documentation Tools","On-Person Gear","Hygiene & PPE","Support Wear","Scrubs & Uniforms","Training Materials"],aiAssist:"classify",externalSubmissionAllowed:true},
      {id:"sku",label:"SKU",kind:"text",required:true,sensitivity:"internal",description:"Unique internal stock-keeping unit.",aiAssist:"normalize",externalSubmissionAllowed:true},
      {id:"priceCents",label:"Price",kind:"currency",required:true,sensitivity:"internal",description:"Retail price in cents.",aiAssist:"none",externalSubmissionAllowed:true,validation:{min:0}},
      {id:"quantityOnHand",label:"Quantity",kind:"number",required:true,sensitivity:"internal",description:"Current seeded inventory quantity.",aiAssist:"none",externalSubmissionAllowed:true,validation:{min:0}},
      {id:"description",label:"Description",kind:"textarea",required:true,sensitivity:"internal",description:"Customer-facing factual description.",aiAssist:"suggest",externalSubmissionAllowed:true},
      {id:"claimBoundary",label:"Claim boundary",kind:"textarea",required:true,sensitivity:"internal",description:"What the listing must not imply or overstate.",aiAssist:"suggest",externalSubmissionAllowed:true}
    ]
  }
];

function normalizeString(value:unknown){
  return typeof value==="string" ? value.trim().replace(/\s+/g," ") : value;
}

function validateField(field:FieldDefinition,value:unknown):FieldResult{
  const errors:string[]=[]; const warnings:string[]=[];
  let normalized=value;
  if (typeof value==="string") normalized=normalizeString(value);
  if (field.required && (normalized===undefined || normalized===null || normalized==="")) errors.push("Required field.");
  if (typeof normalized==="string") {
    if (field.validation?.minLength && normalized.length<field.validation.minLength) errors.push(`Minimum length is ${field.validation.minLength}.`);
    if (field.validation?.maxLength && normalized.length>field.validation.maxLength) errors.push(`Maximum length is ${field.validation.maxLength}.`);
    if (field.kind==="email" && normalized && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) errors.push("Enter a valid email address.");
    if (field.kind==="phone" && normalized) {
      const digits=normalized.replace(/\D/g,"");
      if (digits.length!==10) errors.push("Enter a 10-digit U.S. phone number.");
      else normalized=`(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
    }
  }
  if (typeof normalized==="number") {
    if (field.validation?.min!==undefined && normalized<field.validation.min) errors.push(`Minimum value is ${field.validation.min}.`);
    if (field.validation?.max!==undefined && normalized>field.validation.max) errors.push(`Maximum value is ${field.validation.max}.`);
  }
  const blocked=PROHIBITED_AI_FIELDS.has(field.id.toLowerCase());
  if (blocked) errors.push("This field is prohibited from the AI/data-entry layer.");
  return {fieldId:field.id,status:errors.length?"blocked":normalized===undefined||normalized===null||normalized===""?"empty":"validated",value:blocked?"[REDACTED_BY_POLICY]":normalized,errors,warnings};
}

function suggest(field:FieldDefinition,value:unknown,form:FormDefinition):Pick<FieldResult,"suggestion"|"confidence"|"rationale">{
  if (field.aiAssist==="none") return {};
  const text=typeof value==="string"?value.trim():"";
  if (field.id==="topic" && text) {
    const lower=text.toLowerCase();
    const topic= lower.includes("order")||lower.includes("product")?"Order & product":
      lower.includes("training")||lower.includes("lms")?"Training & LMS":
      lower.includes("facility")||lower.includes("ltc")?"Facility support":
      lower.includes("business")||lower.includes("llc")||lower.includes("ein")?"Business services":
      lower.includes("bill")||lower.includes("invoice")?"Billing or invoice":"Technical support";
    return {suggestion:topic,confidence:.72,rationale:"Deterministic keyword classification; user review required."};
  }
  if (field.id==="description" && !text) return {suggestion:"Premium product listing. Add factual materials, dimensions, included components, and sourced manufacturer specifications before publishing claims.",confidence:.6,rationale:"Template suggestion only; factual source verification is required."};
  if (field.id==="claimBoundary" && !text) return {suggestion:"Do not imply diagnosis, treatment, cure, regulatory approval, or performance characteristics unless substantiated by the actual sourced product documentation.",confidence:.9,rationale:"Governance safety template."};
  if (typeof value==="string" && field.aiAssist==="normalize") return {suggestion:normalizeString(value),confidence:.98,rationale:"Whitespace and formatting normalization only."};
  return {};
}

export function processForm(formId:string,values:Record<string,unknown>,includeAiAssist=true){
  const form=FORM_REGISTRY.find(item=>item.id===formId);
  if (!form) throw new Error(`Unknown form: ${formId}`);
  const fields=form.fields.map(field=>{
    const base=validateField(field,values[field.id]);
    const ai=includeAiAssist&&!base.errors.length?suggest(field,values[field.id],form):{};
    return {...base,...ai,status:ai.suggestion!==undefined&&base.status==="validated"?"suggested":base.status};
  });
  return {
    sessionId:randomUUID(),
    formId:form.id,
    formVersion:form.version,
    processedAt:new Date().toISOString(),
    valid:fields.every(f=>f.errors.length===0),
    fields,
    disclaimer:form.disclaimer,
    aiAssistNotice:"AI assistance can make mistakes. Suggestions are not authoritative records and require human review before regulated, financial, clinical, tax, legal, or government use."
  };
}

export function publicFormRegistry(){
  return FORM_REGISTRY.map(form=>({...form,fields:form.fields.filter(field=>!PROHIBITED_AI_FIELDS.has(field.id.toLowerCase()))}));
}


function escapeXml(value:unknown){
  return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}

function decodeXml(value:string){
  return value.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&");
}

export function exportFormXml(formId:string,values:Record<string,unknown>){
  const result=processForm(formId,values,false);
  if(!result.valid) throw new Error("Form must validate before XML export.");
  const fields=result.fields.map(field=>`  <field id="${escapeXml(field.fieldId)}">${escapeXml(field.value)}</field>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<comeaux-record formId="${escapeXml(formId)}" formVersion="${escapeXml(result.formVersion)}">\n${fields}\n</comeaux-record>\n`;
}

export function importFormXml(xml:string){
  if(xml.length>100_000) throw new Error("XML payload exceeds 100 KB limit.");
  if(/<!DOCTYPE|<!ENTITY|SYSTEM\s|PUBLIC\s/i.test(xml)) throw new Error("DTD/entity declarations are prohibited.");
  const root=xml.match(/<comeaux-record\s+formId="([^"]+)"(?:\s+formVersion="([^"]+)")?\s*>[\s\S]*<\/comeaux-record>/i);
  if(!root) throw new Error("Unsupported XML root. Expected comeaux-record.");
  const formId=decodeXml(root[1]);
  const values:Record<string,string>={};
  const re=/<field\s+id="([^"]+)"\s*>([\s\S]*?)<\/field>/gi;
  let match:RegExpExecArray|null;
  while((match=re.exec(xml))!==null){
    const id=decodeXml(match[1]);
    if(PROHIBITED_AI_FIELDS.has(id.toLowerCase())) throw new Error(`Prohibited field in XML: ${id}`);
    values[id]=decodeXml(match[2].trim());
  }
  return {formId,values,validation:processForm(formId,values,false)};
}
