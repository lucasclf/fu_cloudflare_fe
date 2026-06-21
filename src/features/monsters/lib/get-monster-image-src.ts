import { createAssetImageResolver } from "@/shared/lib/create-asset-image-resolver";
import { normalizeSearchText } from "@/shared/lib/text-formatters";

const monsterImageModules = import.meta.glob(
  "../../../assets/characters/monsters/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

export const getMonsterImageSrc = createAssetImageResolver({
  assetModules: monsterImageModules,
  assetsRoot: "../../../assets/characters/monsters",
  placeholderSrc: null,
  candidateAssetKeys: createCharacterImageCandidateKeys,
});

function createCharacterImageCandidateKeys(assetKey: string): string[] {
  const normalized = normalizeSearchText(assetKey);
  const fileName = normalized.split("/").pop() ?? normalized;
  return [...new Set([normalized, fileName])];
}
