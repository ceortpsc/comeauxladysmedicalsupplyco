import { NextResponse } from "next/server";
import { CATEGORIES, PRODUCTS } from "@comeaux/catalog";

export async function GET(){return NextResponse.json({catalogVersion:"2026.09.12",categories:CATEGORIES,products:PRODUCTS})}
