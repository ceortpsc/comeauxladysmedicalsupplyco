import type { Metadata } from "next";
import AssistantClient from "./AssistantClient";

export const metadata:Metadata={
  title:"Andreaa Chan'nel AI Support",
  description:"Governed AI support and consultation interface for Comeaux Lady's Medical Supply Co."
};

export default function AssistantPage(){return <AssistantClient/>}
