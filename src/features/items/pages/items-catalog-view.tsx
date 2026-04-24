import { useEffect, useMemo, useState } from "react";
import { CategorySwitcher } from "../../catalog/components/category-switcher";
import { CatalogLayout } from "../../catalog/components/catalog-layout";
import type { CatalogCategory } from "../../catalog/types/category";
import { getPublicItems } from "../api/get-public-items";
import { ItemCategoryFilterSidebar } from "../components/item-category-filter-sidebar";
import { ItemCardsPanel } from "../components/item-cards-panel";
import type { Item, ItemType } from "../types/item";

type ItemsCatalogViewProps = {
  category: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
};

export function ItemsCatalogView({
  category,
  onCategoryChange,
}: ItemsCatalogViewProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicItems();
        setItems(data);
      } catch {
        setError("Não foi possível carregar os itens.");
      } finally {
        setLoading(false);
      }
    }

    void loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesType =
        selectedType === null || item.item_type === selectedType;

      const matchesSearch =
        !query || item.name.toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [items, search, selectedType]);

  return (
    <CatalogLayout
      sidebarHeaderTitle="Categorias de item"
      sidebarHeaderSubtitle="Itens da campanha"
      searchPlaceholder="Buscar item por nome..."
      searchValue={search}
      onSearchChange={setSearch}
      categorySwitcher={
        <CategorySwitcher value={category} onChange={onCategoryChange} />
      }
      sidebarContent={
        loading ? (
          <div style={{ padding: "16px" }}>Carregando...</div>
        ) : error ? (
          <div style={{ padding: "16px" }}>{error}</div>
        ) : (
          <ItemCategoryFilterSidebar
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />
        )
      }
      mainContent={
        loading ? (
          <div>Carregando itens...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <ItemCardsPanel
            items={filteredItems}
            selectedType={selectedType}
          />
        )
      }
    />
  );
}