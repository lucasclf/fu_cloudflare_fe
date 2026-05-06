const monsterImageModules = import.meta.glob(
  "../../../assets/characters/monsters/*.{png,jpg,jpeg,webp}",
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

const monsterImageByKey = Object.entries(monsterImageModules).reduce<
  Record<string, string>
>((acc, [path, image]) => {
  const fileName = getFileName(path);

  acc[fileName] = image;

  return acc;
}, {});

export function getMonsterImageSrc(imgKey: string | null): string | null {
  if (!imgKey) {
    return null;
  }

  return monsterImageByKey[normalizeImageKey(imgKey)] ?? null;
}