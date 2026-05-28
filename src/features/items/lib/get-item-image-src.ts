import { createAssetImageResolver } from "@/shared/lib/create-asset-image-resolver";

const ITEM_PLACEHOLDER_SRC = new URL(
  "../../../assets/items/armas/placeholder.png",
  import.meta.url,
).href;

const itemImageModules = import.meta.glob(
  "../../../assets/items/**/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

export const getItemImageSrc = createAssetImageResolver({
  assetModules: itemImageModules,
  assetsRoot: "../../../assets",
  placeholderSrc: ITEM_PLACEHOLDER_SRC,
});