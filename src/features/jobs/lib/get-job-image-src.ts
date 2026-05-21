const jobImageModules = import.meta.glob(
  "../../../assets/jobs/**/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  }
) as Record<string, string>;

function removeImageExtension(value: string): string {
  return value.replace(/\.(png|jpg|jpeg|webp)$/i, "");
}

function normalizeImageKey(value: string): string {
  return removeImageExtension(value.trim().replaceAll("\\", "/"));
}

function getFileName(value: string): string {
  const parts = normalizeImageKey(value).split("/");
  return parts[parts.length - 1];
}

export function getJobImageSrc(imgKey: string | null): string | null {
  if (!imgKey) {
    return null;
  }

  const normalizedKey = normalizeImageKey(imgKey);
  const fileName = getFileName(normalizedKey);

  const candidates = [
    `../../../assets/${normalizedKey}.png`,
    `../../../assets/jobs/${normalizedKey}.png`,
    `../../../assets/jobs/icons/${normalizedKey}.png`,
    `../../../assets/jobs/icons/${fileName}.png`,
  ];

  for (const candidate of candidates) {
    const image = jobImageModules[candidate];

    if (image) {
      return image;
    }
  }

  return null;
}
