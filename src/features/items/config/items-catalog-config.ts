import { ITEMS_CATALOG_COPY } from "./items-catalog-copy";
import { ITEM_TYPE_LABELS, ITEM_TYPE_OPTIONS } from "./item-type-config";

export const ITEMS_CATALOG_CONFIG = {
  copy: ITEMS_CATALOG_COPY,

  types: {
    options: ITEM_TYPE_OPTIONS,
    labels: ITEM_TYPE_LABELS,
  },

  layout: {
    sidebarHeaderTitle: ITEMS_CATALOG_COPY.sidebar.headerTitle,
    sidebarHeaderSubtitle: ITEMS_CATALOG_COPY.sidebar.headerSubtitle,
    searchPlaceholder: ITEMS_CATALOG_COPY.search.placeholder,
  },
} as const;
