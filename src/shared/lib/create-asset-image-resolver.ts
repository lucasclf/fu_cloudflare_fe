const DEFAULT_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;

type ImageExtension = (typeof DEFAULT_IMAGE_EXTENSIONS)[number];

type AssetImageModules = Record<string, string>;

type CreateAssetImageResolverParams = {
  assetModules: AssetImageModules;
  assetsRoot: string;
  placeholderSrc: string;
  extensions?: readonly ImageExtension[];
};

export function createAssetImageResolver({
  assetModules,
  assetsRoot,
  placeholderSrc,
  extensions = DEFAULT_IMAGE_EXTENSIONS,
}: CreateAssetImageResolverParams) {
  const normalizedAssetsRoot = normalizeAssetsRoot(assetsRoot);

  return function resolveAssetImage(assetKey: string | null | undefined): string {
    if (!assetKey || assetKey.trim().length === 0) {
      return placeholderSrc;
    }

    const candidatePaths = createAssetCandidatePaths({
      assetKey,
      assetsRoot: normalizedAssetsRoot,
      extensions,
    });

    for (const candidatePath of candidatePaths) {
      const assetSrc = assetModules[candidatePath];

      if (assetSrc) {
        return assetSrc;
      }
    }

    return placeholderSrc;
  };
}

export function createAssetCandidatePaths({
  assetKey,
  assetsRoot,
  extensions = DEFAULT_IMAGE_EXTENSIONS,
}: {
  assetKey: string;
  assetsRoot: string;
  extensions?: readonly ImageExtension[];
}): string[] {
  const normalizedAssetsRoot = normalizeAssetsRoot(assetsRoot);
  const normalizedAssetKey = normalizeAssetKey(assetKey);

  if (hasKnownImageExtension(normalizedAssetKey, extensions)) {
    return [`${normalizedAssetsRoot}/${normalizedAssetKey}`];
  }

  return extensions.map(
    (extension) => `${normalizedAssetsRoot}/${normalizedAssetKey}.${extension}`,
  );
}

function normalizeAssetsRoot(assetsRoot: string): string {
  return assetsRoot.trim().replace(/\/+$/g, "");
}

function normalizeAssetKey(assetKey: string): string {
  return assetKey
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/g, "")
    .replace(/^(\.\.\/)+assets\//, "")
    .replace(/^assets\//, "");
}

function hasKnownImageExtension(
  assetKey: string,
  extensions: readonly ImageExtension[],
): boolean {
  const normalizedAssetKey = assetKey.toLowerCase();

  return extensions.some((extension) =>
    normalizedAssetKey.endsWith(`.${extension}`),
  );
}