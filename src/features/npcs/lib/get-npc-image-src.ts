import { createAssetImageResolver } from "@/shared/lib/create-asset-image-resolver";
import { normalizeSearchText } from "@/shared/lib/text-formatters";

const npcImageModules = import.meta.glob(
  "../../../assets/characters/npcs/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

export const getNpcImageSrc = createAssetImageResolver({
  assetModules: npcImageModules,
  assetsRoot: "../../../assets/characters/npcs",
  placeholderSrc: null,
  candidateAssetKeys: createCharacterImageCandidateKeys,
});

function createCharacterImageCandidateKeys(assetKey: string): string[] {
  const normalized = normalizeSearchText(assetKey);
  const fileName = normalized.split("/").pop() ?? normalized;
  return [...new Set([normalized, fileName])];
}
