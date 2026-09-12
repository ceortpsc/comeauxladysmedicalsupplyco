export type PaymentStatus = "draft"|"pending"|"paid"|"past_due"|"refunded"|"failed";
export type Installment = {sequence:number;amountCents:number;dueAt:string;status:PaymentStatus};
export type InstallmentPlan = {planId:string;totalCents:number;currency:"USD";installments:Installment[];agreementAcceptedAt?:string};

export interface PaymentGateway {
  createCheckout(input:{customerId:string;amountCents:number;description:string;metadata?:Record<string,string>}):Promise<{providerReference:string;checkoutUrl:string}>;
  createInvoice(input:{customerId:string;amountCents:number;description:string;dueAt?:string}):Promise<{providerReference:string;hostedUrl?:string}>;
}

export function splitInstallments(totalCents:number,count:number,startIso:string):InstallmentPlan{
  if(count<1||count>12) throw new Error("Installment count must be 1-12");
  const base=Math.floor(totalCents/count); const remainder=totalCents-(base*count); const start=new Date(startIso);
  return {planId:`plan_${Date.now()}`,totalCents,currency:"USD",installments:Array.from({length:count},(_,i)=>({sequence:i+1,amountCents:base+(i===count-1?remainder:0),dueAt:new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()+i,start.getUTCDate())).toISOString(),status:"draft"}))};
}
