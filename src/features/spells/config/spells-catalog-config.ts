import { SPELLS_CATALOG_COPY } from "./spells-catalog-copy";

export const SPELLS_CATALOG_CONFIG = {
  copy: SPELLS_CATALOG_COPY,

  layout: {
    sidebarHeaderTitle: SPELLS_CATALOG_COPY.sidebar.headerTitle,
    sidebarHeaderSubtitle: SPELLS_CATALOG_COPY.sidebar.headerSubtitle,
    searchPlaceholder: SPELLS_CATALOG_COPY.search.placeholder,
  },
} as const;
