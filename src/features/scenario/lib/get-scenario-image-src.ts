import type { ScenarioEntityType } from "../types/scenario";

const scenarioImageModules = import.meta.glob(
  "../../../assets/scenario/**/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

function removeImageExtension(value: string): string {
  return value.replace(/\.(png|jpg|jpeg|webp)$/i, "");
}

function removeAssetsPrefix(value: string): string {
  return value.replace(/^\.\.\/\.\.\/\.\.\/assets\//, "");
}

function normalizeImageKey(value: string): string {
  return removeImageExtension(value.trim().replaceAll("\\", "/"));
}

function normalizeLookupKey(value: string): string {
  return normalizeImageKey(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getFileName(value: string): string {
  const parts = normalizeImageKey(value).split("/");
  return parts[parts.length - 1];
}

function getScenarioFolder(type: ScenarioEntityType): string {
  if (type === "location") {
    return "local";
  }

  return "faccao";
}

const scenarioImageByKey = Object.entries(scenarioImageModules).reduce<
  Record<string, string>
>((acc, [path, image]) => {
  const pathWithoutAssetsPrefix = removeAssetsPrefix(path);
  const normalizedPath = normalizeLookupKey(pathWithoutAssetsPrefix);
  const normalizedFileName = normalizeLookupKey(getFileName(path));

  acc[normalizedPath] = image;
  acc[normalizedFileName] = image;

  return acc;
}, {});

export function getScenarioImageSrc(
  type: ScenarioEntityType,
  imgKey: string | null,
): string | null {
  if (!imgKey) {
    return null;
  }

  const folder = getScenarioFolder(type);
  const normalizedKey = normalizeImageKey(imgKey);
  const fileName = getFileName(normalizedKey);

  const candidates = [
    normalizedKey,
    `scenario/${folder}/${normalizedKey}`,
    fileName,
  ];

  for (const candidate of candidates) {
    const image = scenarioImageByKey[normalizeLookupKey(candidate)];

    if (image) {
      return image;
    }
  }

  return null;
}