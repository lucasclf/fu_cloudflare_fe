import { POWERS_CATALOG_COPY } from "./powers-catalog-copy";

export const POWERS_CATALOG_CONFIG = {
  copy: POWERS_CATALOG_COPY,

  layout: {
    sidebarHeaderTitle: POWERS_CATALOG_COPY.sidebar.headerTitle,
    sidebarHeaderSubtitle: POWERS_CATALOG_COPY.sidebar.headerSubtitle,
    searchPlaceholder: POWERS_CATALOG_COPY.search.placeholder,
  },
} as const;
