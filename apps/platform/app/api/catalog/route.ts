import { NextResponse } from "next/server";
import { CATALOG_SUMMARY, CATEGORIES, PRODUCTS } from "@comeaux/catalog";

export async function GET(){
  return NextResponse.json({
    catalogVersion:"2026.09.18",
    pricingTier:"luxury",
    seedPolicy:{quantityPerProduct:12,persistence:"source-seeded; database inventory not yet provisioned"},
    summary:CATALOG_SUMMARY,
    categories:CATEGORIES,
    products:PRODUCTS
  });
}
