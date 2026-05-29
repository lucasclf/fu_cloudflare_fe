import { getInitials } from "@/shared/lib/text-formatters";

import "./entity-avatar.css";

type EntityAvatarSize = "sm" | "md" | "lg";

type EntityAvatarProps = {
  name: string;
  imageSrc: string | null;
  size?: EntityAvatarSize;
  className?: string;
};

export function EntityAvatar({
  name,
  imageSrc,
  size = "md",
  className,
}: EntityAvatarProps) {
  return (
    <div className={getEntityAvatarClassName(size, className)}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className="entity-avatar__image"
          aria-hidden
        />
      ) : (
        <span className="entity-avatar__initials">{getInitials(name)}</span>
      )}
    </div>
  );
}

function getEntityAvatarClassName(
  size: EntityAvatarSize,
  className: string | undefined,
): string {
  return ["entity-avatar", `entity-avatar--${size}`, className]
    .filter(Boolean)
    .join(" ");
}
