import type { MetadataRoute } from "next";
import { BRAND } from "@comeaux/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: "Comeaux Lady's",
    description: BRAND.description,
    start_url: "/",
    display: "standalone",
    background_color: BRAND.palette.white,
    theme_color: BRAND.palette.purpleDeep,
    icons: [
      { src: BRAND.assets.monogram, sizes: "96x96", type: "image/webp", purpose: "any" }
    ]
  };
}
