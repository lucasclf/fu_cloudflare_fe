const bondImageModules = import.meta.glob(
  "../../../assets/characters/{pcs,npcs,monsters,freeform}/*.{png,jpg,jpeg,webp}",
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

function getCharacterFolderByTargetType(targetType: string): string | null {
  if (targetType === "pc") {
    return "pcs";
  }

  if (targetType === "npc") {
    return "npcs";
  }

  if (targetType === "monster") {
    return "monsters";
  }

  if (targetType === "freeform"){
    return "freeform"
  }

  return null;
}

const bondImageByPath = Object.entries(bondImageModules).reduce<
  Record<string, string>
>((acc, [path, image]) => {
  const normalizedPath = path
    .replace("../../../assets/", "")
    .replace(/\.(png|jpg|jpeg|webp)$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  acc[normalizedPath] = image;

  return acc;
}, {});

export function getPcBondImageSrc(
  targetType: string,
  imgKey: string | null,
): string | null {
  if (!imgKey) {
    return null;
  }

  const folder = getCharacterFolderByTargetType(targetType);

  if (!folder) {
    return null;
  }

  const normalizedKey = normalizeImageKey(imgKey);
  const fileName = getFileName(normalizedKey);

  const portraitPath = `characters/${folder}/${fileName}_portrait`;
  const fallbackPath = `characters/${folder}/${fileName}`;

  return bondImageByPath[portraitPath] ?? bondImageByPath[fallbackPath] ?? null;
}