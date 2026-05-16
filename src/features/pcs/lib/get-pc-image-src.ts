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

function normalizeImageKey(value: string): string {
  return value
    .replace(/\.(png|jpg|jpeg|webp)$/i, "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getFileName(path: string): string {
  const parts = path.split("/");
  const fileName = parts[parts.length - 1];

  return normalizeImageKey(fileName);
}

const pcImageByKey = Object.entries(pcImageModules).reduce<
  Record<string, string>
>((acc, [path, image]) => {
  acc[getFileName(path)] = image;
  return acc;
}, {});

export function getPcImageSrc(imgKey: string | null): string {
  if (!imgKey) {
    return PC_PLACEHOLDER_SRC;
  }

  return pcImageByKey[normalizeImageKey(imgKey)] ?? PC_PLACEHOLDER_SRC;
}

export function getPcPortraitImageSrc(imgKey: string | null): string {
  if (!imgKey) {
    return PC_PLACEHOLDER_SRC;
  }

  const normalizedKey = normalizeImageKey(imgKey);
  const portraitKey = `${normalizedKey}_portrait`;

  return (
    pcImageByKey[portraitKey] ??
    pcImageByKey[normalizedKey] ??
    PC_PLACEHOLDER_SRC
  );
}