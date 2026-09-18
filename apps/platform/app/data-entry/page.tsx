import type { Metadata } from "next";
import DataEntryClient from "./DataEntryClient";
export const metadata:Metadata={title:"Data Entry Studio",description:"Registry-driven data entry with governed AI assistance."};
export default function DataEntryPage(){return <DataEntryClient/>}
