import "./attribute-grid.css";

export type AttributeGridItem = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

type AttributeGridProps = {
  items: readonly AttributeGridItem[];
  columns?: 2 | 3;
  className?: string;
};

export function AttributeGrid({
  items,
  columns = 2,
  className,
}: AttributeGridProps) {
  if (items.length === 0) {
    return null;
  }

  const classes = [
    "attribute-grid",
    `attribute-grid--columns-${columns}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {items.map((item) => {
        const itemClasses = [
          "attribute-grid__item",
          item.fullWidth ? "attribute-grid__item--full-width" : null,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={`${item.label}-${item.value}`} className={itemClasses}>
            <div className="attribute-grid__label">{item.label}</div>
            <div className="attribute-grid__value">{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}
