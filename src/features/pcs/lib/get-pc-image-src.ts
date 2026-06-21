import { createAssetImageResolver } from "@/shared/lib/create-asset-image-resolver";
import { normalizeSearchText } from "@/shared/lib/text-formatters";

const PC_PLACEHOLDER_SRC = new URL(
  "../../../assets/characters/pcs/placeholder.png",
  import.meta.url,
).href;

const pcImageModules = import.meta.glob(
  "../../../assets/characters/pcs/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

export const getPcImageSrc = createAssetImageResolver({
  assetModules: pcImageModules,
  assetsRoot: "../../../assets/characters/pcs",
  placeholderSrc: PC_PLACEHOLDER_SRC,
  candidateAssetKeys: createPcImageCandidateKeys,
});

export const getPcPortraitImageSrc = createAssetImageResolver({
  assetModules: pcImageModules,
  assetsRoot: "../../../assets/characters/pcs",
  placeholderSrc: PC_PLACEHOLDER_SRC,
  candidateAssetKeys: createPcPortraitCandidateKeys,
});

function toNormalizedKeyAndFileName(assetKey: string): { normalized: string; fileName: string } {
  const normalized = normalizeSearchText(assetKey);
  const fileName = normalized.split("/").pop() ?? normalized;
  return { normalized, fileName };
}

function createPcImageCandidateKeys(assetKey: string): string[] {
  const { normalized, fileName } = toNormalizedKeyAndFileName(assetKey);
  return [...new Set([normalized, fileName])];
}

function createPcPortraitCandidateKeys(assetKey: string): string[] {
  const { normalized, fileName } = toNormalizedKeyAndFileName(assetKey);
  return [...new Set([`${fileName}_portrait`, normalized, fileName])];
}
