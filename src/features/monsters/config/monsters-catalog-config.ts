import { MONSTERS_CATALOG_COPY } from "./monsters-catalog-copy";

export const MONSTERS_CATALOG_CONFIG = {
  copy: MONSTERS_CATALOG_COPY,

  layout: {
    sidebarHeaderTitle: MONSTERS_CATALOG_COPY.sidebar.headerTitle,
    sidebarHeaderSubtitle: MONSTERS_CATALOG_COPY.sidebar.headerSubtitle,
    searchPlaceholder: MONSTERS_CATALOG_COPY.search.placeholder,
  },
} as const;
