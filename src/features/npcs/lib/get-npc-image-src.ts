const npcImageModules = import.meta.glob(
  "../../../assets/characters/npcs/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

function removeImageExtension(value: string): string {
  return value.replace(/\.(png|jpg|jpeg|webp)$/i, "");
}

function normalizeImageKey(value: string): string {
  return removeImageExtension(value.trim().replaceAll("\\", "/"))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getFileName(value: string): string {
  const parts = normalizeImageKey(value).split("/");
  return parts[parts.length - 1];
}

const npcImageByKey = Object.entries(npcImageModules).reduce<
  Record<string, string>
>((acc, [path, image]) => {
  acc[getFileName(path)] = image;
  return acc;
}, {});

export function getNpcImageSrc(imgKey: string | null): string | null {
  if (!imgKey) {
    return null;
  }

  return npcImageByKey[normalizeImageKey(imgKey)] ?? null;
}