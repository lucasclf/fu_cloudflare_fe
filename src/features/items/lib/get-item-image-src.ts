const ITEM_PLACEHOLDER_SRC = new URL(
  "../../../assets/items/armas/placeholder.png",
  import.meta.url
).href;

const itemImageModules = import.meta.glob(
  "../../../assets/items/**/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  }
) as Record<string, string>;

function normalizeAssetPath(urlKey: string): string {
  return `../../../assets/${urlKey}.png`;
}

export function getItemImageSrc(urlKey: string | null): string {
  if (!urlKey) {
    return ITEM_PLACEHOLDER_SRC;
  }

  const normalizedPath = normalizeAssetPath(urlKey);
  return itemImageModules[normalizedPath] ?? ITEM_PLACEHOLDER_SRC;
}