export type CatalogCategory = {
  id:string;
  name:string;
  description:string;
  merchandisingOrder:number;
};

export type ProductOption = {
  id:string;
  label:string;
  values:string[];
};

export type ProductMedia = {
  type:"image";
  src:string;
  alt:string;
  role:"primary"|"marketing";
};

export type Product = {
  sku:string;
  slug:string;
  name:string;
  categoryId:string;
  category:string;
  description:string;
  marketingLine:string;
  priceCents:number;
  compareAtCents:number;
  quantityOnHand:number;
  inventoryPolicy:"seeded-product";
  roleTags:string[];
  colors:string[];
  sizes?:string[];
  designs?:string[];
  options:ProductOption[];
  media:ProductMedia[];
  claimBoundary:string;
  status:"active";
};

export const CATEGORIES: CatalogCategory[] = [
  {id:"assessment",name:"Assessment Tools",description:"General assessment and monitoring tools for authorized clinical, training, and facility workflows.",merchandisingOrder:10},
  {id:"clinical",name:"Clinical Tools",description:"Everyday non-pharmaceutical clinical tools and accessories.",merchandisingOrder:20},
  {id:"wound-care",name:"Wound Care",description:"General wound-care supplies; manufacturer labeling and facility policy govern use.",merchandisingOrder:30},
  {id:"documentation",name:"Documentation Tools",description:"Organization and privacy-minded paper documentation accessories.",merchandisingOrder:40},
  {id:"on-person",name:"On-Person Gear",description:"Wearable and carry accessories for healthcare professionals and students.",merchandisingOrder:50},
  {id:"ppe",name:"Hygiene & PPE",description:"General hygiene and protective supplies with manufacturer-specific use requirements.",merchandisingOrder:60},
  {id:"support-wear",name:"Support Wear",description:"Comfort and support apparel; not represented as diagnosis, treatment, or cure.",merchandisingOrder:70},
  {id:"uniforms",name:"Scrubs & Uniforms",description:"Premium workwear for healthcare teams, students, and facilities.",merchandisingOrder:80},
  {id:"training",name:"Training Materials",description:"Reference and learning materials for structured education and onboarding.",merchandisingOrder:90}
];

const standardColors=["Black","White","Purple","Hot Pink","Blush Pink","Navy","Ceil Blue","Wine","Hunter Green","Gray","Tan"];

export const PRODUCTS: Product[] = [
  {
    sku:"CLMS-ASMT-BP-001",slug:"signature-manual-bp-cuff",name:"Signature Manual BP Cuff",categoryId:"assessment",category:"Assessment Tools",
    description:"Premium adult manual blood-pressure cuff set for authorized assessment, skills-lab, and facility supply workflows.",
    marketingLine:"Classic assessment equipment with a polished Comeaux Lady's presentation.",priceCents:8999,compareAtCents:10999,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","Student","Facility"],colors:["Black","Pink","Purple","Navy"],options:[{id:"color",label:"Color",values:["Black","Pink","Purple","Navy"]}],
    media:[{type:"image",src:"/products/bp-cuff.svg",alt:"Comeaux Lady's manual blood pressure cuff collection",role:"primary"}],
    claimBoundary:"General supply listing only. Accuracy, sizing, maintenance, and clinical use depend on the actual manufacturer labeling and facility policy.",status:"active"
  },
  {
    sku:"CLMS-ASMT-POX-002",slug:"luxe-fingertip-pulse-oximeter",name:"Luxe Fingertip Pulse Oximeter",categoryId:"assessment",category:"Assessment Tools",
    description:"Portable fingertip pulse-oximeter product family for authorized monitoring and training workflows.",
    marketingLine:"Compact monitoring in signature Comeaux colorways.",priceCents:6999,compareAtCents:8499,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","Student","Facility"],colors:["Black","Pink","Purple","Red","Navy","Teal","White"],options:[{id:"color",label:"Color",values:["Black","Pink","Purple","Red","Navy","Teal","White"]}],
    media:[{type:"image",src:"/products/pulse-oximeter.svg",alt:"Pulse oximeters in multiple Comeaux Lady's color options",role:"primary"}],
    claimBoundary:"Not a diagnostic claim. Product specifications and intended use must match the sourced manufacturer's labeling before sale.",status:"active"
  },
  {
    sku:"CLMS-ASMT-LIGHT-003",slug:"precision-clinical-penlight",name:"Precision Clinical Penlight",categoryId:"assessment",category:"Assessment Tools",
    description:"Premium pocket penlight family for general assessment and training inventory.",
    marketingLine:"A polished pocket essential for clinical professionals.",priceCents:3499,compareAtCents:4499,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","CNA","MA","Student"],colors:["Black","Pink","Purple","Red","Navy","Teal","White"],options:[{id:"color",label:"Color",values:["Black","Pink","Purple","Red","Navy","Teal","White"]}],
    media:[{type:"image",src:"/products/clinical-penlight.svg",alt:"Clinical penlights in multiple premium colorways",role:"primary"}],
    claimBoundary:"General assessment accessory. No diagnostic performance claim is made by the platform.",status:"active"
  },
  {
    sku:"CLMS-CLIN-SHEAR-004",slug:"premium-trauma-shears",name:"Premium Clinical Shears",categoryId:"clinical",category:"Clinical Tools",
    description:"General-purpose clinical shears for authorized workplace and training use.",
    marketingLine:"Care cuts through—with a premium finish and professional grip.",priceCents:3999,compareAtCents:4999,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","CNA","Student"],colors:["Black","Pink","Purple"],options:[{id:"color",label:"Color",values:["Black","Pink","Purple"]}],
    media:[{type:"image",src:"/products/trauma-shears.svg",alt:"Premium clinical shears in Comeaux Lady's styling",role:"primary"}],
    claimBoundary:"General-purpose tool only. Workplace policy governs permitted use and storage.",status:"active"
  },
  {
    sku:"CLMS-WOUND-GAUZE-005",slug:"premium-wound-care-gauze-set",name:"Premium Wound-Care Gauze Set",categoryId:"wound-care",category:"Wound Care",
    description:"General wound-care gauze assortment presented as a premium facility and nursing supply set.",
    marketingLine:"Clean presentation. Reliable stock. Facility-ready organization.",priceCents:5999,compareAtCents:7499,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","Facility"],colors:["White"],designs:["Assorted gauze pads and rolls"],options:[{id:"design",label:"Set",values:["Assorted gauze pads and rolls"]}],
    media:[{type:"image",src:"/products/gauze-wound-care.svg",alt:"Premium general wound care gauze assortment",role:"primary"}],
    claimBoundary:"No healing or treatment outcome is promised. Product use must follow actual package labeling, orders, and facility policy.",status:"active"
  },
  {
    sku:"CLMS-DOC-CLIP-006",slug:"executive-nursing-clipboard",name:"Executive Nursing Clipboard",categoryId:"documentation",category:"Documentation Tools",
    description:"Premium clipboard collection for organized paper workflows, rounding notes, and training materials.",
    marketingLine:"Professional organization with signature Comeaux colorways.",priceCents:5499,compareAtCents:6999,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","CNA","MA","Student"],colors:["Black","Pink","Purple","Navy","White"],options:[{id:"color",label:"Color",values:["Black","Pink","Purple","Navy","White"]}],
    media:[{type:"image",src:"/products/nursing-clipboard.svg",alt:"Premium nursing clipboards in black pink purple navy and white",role:"primary"}],
    claimBoundary:"A clipboard is not a security control by itself. Users remain responsible for privacy, minimum-necessary access, and approved record handling.",status:"active"
  },
  {
    sku:"CLMS-GEAR-POUCH-007",slug:"luxe-clinical-organizer-pouch",name:"Luxe Clinical Organizer Pouch",categoryId:"on-person",category:"On-Person Gear",
    description:"Structured organizer pouch for approved non-sharp healthcare accessories and personal work gear.",
    marketingLine:"Everything you need, right at hand.",priceCents:6499,compareAtCents:7999,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","CNA","MA","Student"],colors:["Black","Pink","Purple","Red","Navy","Teal"],options:[{id:"color",label:"Color",values:["Black","Pink","Purple","Red","Navy","Teal"]}],
    media:[{type:"image",src:"/products/organizer-pouch.svg",alt:"Clinical organizer pouches in multiple colors",role:"primary"}],
    claimBoundary:"Storage accessory only. Sharps, medications, protected health information, and restricted items require facility-approved storage.",status:"active"
  },
  {
    sku:"CLMS-PPE-NITRILE-008",slug:"premium-nitrile-exam-gloves",name:"Premium Nitrile Exam Gloves",categoryId:"ppe",category:"Hygiene & PPE",
    description:"Premium nitrile glove product family in common sizes; final sourced specifications control claims and labeling.",
    marketingLine:"Elevated essentials for clean, professional supply rooms.",priceCents:3999,compareAtCents:4999,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","CNA","MA","Facility"],colors:["Blue","Purple","Pink","Black"],sizes:["XS","S","M","L","XL"],options:[{id:"color",label:"Color",values:["Blue","Purple","Pink","Black"]},{id:"size",label:"Size",values:["XS","S","M","L","XL"]}],
    media:[{type:"image",src:"/products/nitrile-gloves.svg",alt:"Premium nitrile gloves in blue purple pink and black",role:"primary"}],
    claimBoundary:"Material, barrier rating, powder status, latex status, and regulatory claims must come from the actual sourced manufacturer's documentation.",status:"active"
  },
  {
    sku:"CLMS-SUP-COMP-009",slug:"signature-compression-socks",name:"Signature Compression Socks",categoryId:"support-wear",category:"Support Wear",
    description:"Premium workday compression-sock collection offered as comfort/support apparel.",
    marketingLine:"Support your every step—in Comeaux signature colors.",priceCents:3499,compareAtCents:4499,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","CNA","MA","Caregiver"],colors:["Black","White","Purple","Hot Pink","Blush Pink","Navy","Ceil Blue","Wine","Hunter Green","Gray","Tan"],sizes:["S/M","L/XL","2XL","3XL"],options:[{id:"color",label:"Color",values:standardColors},{id:"size",label:"Size",values:["S/M","L/XL","2XL","3XL"]}],
    media:[{type:"image",src:"/products/compression-socks.svg",alt:"Compression socks in Comeaux Lady's premium color collection",role:"primary"}],
    claimBoundary:"Comfort/support apparel. The platform does not diagnose circulation conditions or prescribe compression levels.",status:"active"
  },
  {
    sku:"CLMS-SUP-GARMENT-010",slug:"luxe-support-garment",name:"Luxe Support Garment",categoryId:"support-wear",category:"Support Wear",
    description:"Premium support garment in an inclusive range of colors and sizes.",
    marketingLine:"Structured support with a refined, confidence-forward presentation.",priceCents:11999,compareAtCents:14999,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["Healthcare Professional","Caregiver","Customer"],colors:["Black","Tan","Blush Pink","White","Purple"],sizes:["XS","S","M","L","XL","2XL","3XL"],options:[{id:"color",label:"Color",values:["Black","Tan","Blush Pink","White","Purple"]},{id:"size",label:"Size",values:["XS","S","M","L","XL","2XL","3XL"]}],
    media:[{type:"image",src:"/products/support-garment.svg",alt:"Premium support garments in black tan blush white and purple",role:"primary"}],
    claimBoundary:"Fashion/support garment only unless an actual sourced product carries substantiated medical-device labeling. No body-shape or treatment outcome is promised.",status:"active"
  },
  {
    sku:"CLMS-UNI-SCRUB-011",slug:"signature-scrub-top",name:"Signature Luxe Scrub Top",categoryId:"uniforms",category:"Scrubs & Uniforms",
    description:"Premium scrub top collection for healthcare professionals, students, and facility programs.",
    marketingLine:"Luxury workwear designed for polished clinical teams.",priceCents:8999,compareAtCents:10999,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","CNA","MA","Student","Facility"],colors:standardColors,sizes:["XS","S","M","L","XL","2XL","3XL","4XL","5XL"],designs:["Classic V-Neck","Facility Logo Ready"],options:[{id:"color",label:"Color",values:standardColors},{id:"size",label:"Size",values:["XS","S","M","L","XL","2XL","3XL","4XL","5XL"]},{id:"design",label:"Design",values:["Classic V-Neck","Facility Logo Ready"]}],
    media:[{type:"image",src:"/products/scrub-top.svg",alt:"Premium scrub top collection in multiple Comeaux Lady's colors",role:"primary"}],
    claimBoundary:"Apparel listing only. Fabric, antimicrobial, fluid-resistance, or performance claims require actual manufacturer substantiation.",status:"active"
  },
  {
    sku:"CLMS-EDU-CARDS-012",slug:"premium-nursing-reference-card-set",name:"Premium Nursing Reference Card Set",categoryId:"training",category:"Training Materials",
    description:"Premium quick-reference learning-card set for approved educational and onboarding contexts.",
    marketingLine:"Quick reference. Structured learning. Better organized training.",priceCents:4999,compareAtCents:6499,quantityOnHand:12,inventoryPolicy:"seeded-product",
    roleTags:["LVN","RN","CNA","MA","Student","Instructor"],colors:["Purple","Pink","Blue","Teal"],designs:["Vital Signs","EKG Basics","Lab Values","Medication Safety","Nursing Assessment"],options:[{id:"design",label:"Reference Set",values:["Vital Signs","EKG Basics","Lab Values","Medication Safety","Nursing Assessment"]}],
    media:[{type:"image",src:"/products/training-reference-cards.svg",alt:"Premium nursing reference card collection",role:"primary"}],
    claimBoundary:"Educational reference material only. It does not replace current facility policy, authorized curriculum, clinical judgment, or licensed instruction.",status:"active"
  }
];

export const CATALOG_SUMMARY = {
  productCount: PRODUCTS.length,
  departmentCount: CATEGORIES.length,
  seededQuantityPerProduct: 12,
  totalSeedUnits: PRODUCTS.reduce((total,p)=>total+p.quantityOnHand,0),
  luxuryPricing: true,
  assetCoverage: PRODUCTS.every(p=>p.media.length>0),
  departmentCoverage: CATEGORIES.every(c=>PRODUCTS.some(p=>p.categoryId===c.id))
} as const;
