import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata:Metadata={title:"Contact Us",description:"Governed contact and support intake."};
export default function ContactPage(){return <ContactClient/>}
