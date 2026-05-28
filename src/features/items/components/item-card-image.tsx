import { getItemImageSrc } from "../lib/get-item-image-src";

type ItemCardImageProps = {
  imageKey: string | null;
  alt: string;
};

export function ItemCardImage({ imageKey, alt }: ItemCardImageProps) {
  const imageSrc = getItemImageSrc(imageKey);

  return (
    <div className="item-card__image-wrapper">
      <img src={imageSrc} alt={alt} className="item-card__image" />
    </div>
  );
}
