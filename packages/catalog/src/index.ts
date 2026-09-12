export type Product = {sku:string;name:string;category:string;description:string;priceCents:number;quantityOnHand:number;roleTags:string[];sizes?:string[]};

export const CATEGORIES = [
  {id:"assessment",name:"Assessment Tools"},
  {id:"clinical",name:"Clinical Tools"},
  {id:"wound-care",name:"Wound Care"},
  {id:"documentation",name:"Documentation Tools"},
  {id:"on-person",name:"On-Person Gear"},
  {id:"ppe",name:"Hygiene & PPE"},
  {id:"support-wear",name:"Support Wear"},
  {id:"uniforms",name:"Scrubs & Uniforms"},
  {id:"training",name:"Training Materials"}
] as const;

export const PRODUCTS: Product[] = [
  {sku:"CCS-BP-ADULT-01",name:"Manual BP Cuff — Adult",category:"Assessment Tools",description:"Adult manual blood-pressure cuff for training and clinical supply workflows.",priceCents:2499,quantityOnHand:40,roleTags:["LVN","RN","Student"]},
  {sku:"CCS-POX-FINGER-01",name:"Finger Pulse Oximeter",category:"Assessment Tools",description:"Portable SpO2 and pulse-rate reader.",priceCents:1999,quantityOnHand:50,roleTags:["LVN","RN","Student"]},
  {sku:"CCS-THERM-ORAL-01",name:"Digital Oral Thermometer",category:"Assessment Tools",description:"Digital thermometer for general assessment inventory.",priceCents:999,quantityOnHand:60,roleTags:["LVN","RN","Student","CNA"]},
  {sku:"CCS-PENLIGHT-01",name:"Clinical Penlight",category:"Assessment Tools",description:"Pocket assessment penlight in black, purple or pink.",priceCents:599,quantityOnHand:80,roleTags:["LVN","RN","CNA","MA","Student"]},
  {sku:"CCS-SHEAR-TRM-01",name:"Trauma Shears",category:"Clinical Tools",description:"General-purpose clinical shears for approved workplace use.",priceCents:899,quantityOnHand:70,roleTags:["LVN","RN","CNA","Student"]},
  {sku:"CCS-CLIP-HIPAA-01",name:"Privacy-Shield Nursing Clipboard",category:"Documentation Tools",description:"Folding clinical clipboard designed to reduce casual exposure of paper notes.",priceCents:1899,quantityOnHand:30,roleTags:["LVN","RN","CNA","MA","Student"]},
  {sku:"CCS-POUCH-STD-01",name:"Clinical Organizer Pouch",category:"On-Person Gear",description:"Pocket organizer for approved non-sharp clinical accessories.",priceCents:1299,quantityOnHand:50,roleTags:["LVN","RN","CNA","MA"]},
  {sku:"CCS-SOCK-COMP-01",name:"Compression Socks",category:"Support Wear",description:"Workday support socks available in multiple sizes.",priceCents:1299,quantityOnHand:120,roleTags:["LVN","RN","CNA","MA"],sizes:["S/M","L/XL"]},
  {sku:"CCS-FAJA-BLK-01",name:"Support Garment — Black",category:"Support Wear",description:"Support garment in an inclusive size range; not marketed as medical treatment.",priceCents:4999,quantityOnHand:55,roleTags:["LVN","RN","CNA","MA"],sizes:["XS","S","M","L","XL","2XL","3XL"]},
  {sku:"CCS-GAUZE-4X4-01",name:"Gauze Pads 4x4",category:"Wound Care",description:"General wound-care supply; manufacturer labeling governs use.",priceCents:599,quantityOnHand:110,roleTags:["LVN","RN","Clinic"]},
  {sku:"CCS-GLOVE-NIT-01",name:"Nitrile Gloves",category:"Hygiene & PPE",description:"Disposable nitrile gloves in common size variants.",priceCents:1299,quantityOnHand:140,roleTags:["LVN","RN","CNA","MA","Clinic"],sizes:["S","M","L","XL"]},
  {sku:"CCS-BADGE-CUST-01",name:"Custom Clinical Name Badge",category:"On-Person Gear",description:"Custom name/title badge with proof approval before production.",priceCents:1499,quantityOnHand:120,roleTags:["LVN","RN","CNA","MA","Student"]}
];
