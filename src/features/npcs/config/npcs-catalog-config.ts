import { NPCS_CATALOG_COPY } from "./npcs-catalog-copy";

export const NPCS_CATALOG_CONFIG = {
  copy: NPCS_CATALOG_COPY,

  layout: {
    sidebarHeaderTitle: NPCS_CATALOG_COPY.sidebar.headerTitle,
    sidebarHeaderSubtitle: NPCS_CATALOG_COPY.sidebar.headerSubtitle,
    searchPlaceholder: NPCS_CATALOG_COPY.search.placeholder,
  },
} as const;
