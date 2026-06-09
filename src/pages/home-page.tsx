import { useEffect, useState } from "react";
import { CatalogPage } from "../features/catalog/pages/catalog-page";
import type { CatalogCategory } from "../features/catalog/types/category";
import { useAllowedCategories } from "../features/catalog/hooks/use-allowed-categories";

export function HomePage() {
  const allowedCategories = useAllowedCategories();
  const [category, setCategory] = useState<CatalogCategory>(allowedCategories[0]);

  useEffect(() => {
    if (!(allowedCategories as readonly CatalogCategory[]).includes(category)) {
      setCategory(allowedCategories[0]);
    }
  }, [allowedCategories, category]);

  return <CatalogPage category={category} onCategoryChange={setCategory} />;
}
