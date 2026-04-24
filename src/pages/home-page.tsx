import { useState } from "react";
import { CatalogPage } from "../features/catalog/pages/catalog-page";
import type { CatalogCategory } from "../features/catalog/types/category";

export function HomePage() {
  const [category, setCategory] = useState<CatalogCategory>("sessions");

  return (
    <CatalogPage
      category={category}
      onCategoryChange={setCategory}
    />
  );
}