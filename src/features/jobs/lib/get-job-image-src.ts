import { createAssetImageResolver } from "@/shared/lib/create-asset-image-resolver";

const jobImageModules = import.meta.glob(
  "../../../assets/jobs/**/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

export const getJobImageSrc = createAssetImageResolver({
  assetModules: jobImageModules,
  assetsRoot: "../../../assets",
  placeholderSrc: null,
  candidateAssetKeys: createJobImageCandidateKeys,
});

function createJobImageCandidateKeys(assetKey: string): string[] {
  const normalizedKey = normalizeJobImageKey(assetKey);
  const fileName = getFileName(normalizedKey);

  return unique([
    normalizedKey,
    `jobs/${normalizedKey}`,
    `jobs/icons/${normalizedKey}`,
    `jobs/icons/${fileName}`,
  ]);
}

function normalizeJobImageKey(value: string): string {
  return removeImageExtension(
    value
      .trim()
      .replace(/\\/g, "/")
      .replace(/^\/+/g, "")
      .replace(/^(\.\.\/)+assets\//, "")
      .replace(/^assets\//, ""),
  );
}

function removeImageExtension(value: string): string {
  return value.replace(/\.(png|jpg|jpeg|webp)$/i, "");
}

function getFileName(value: string): string {
  const parts = value.split("/");

  return parts[parts.length - 1] ?? value;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}