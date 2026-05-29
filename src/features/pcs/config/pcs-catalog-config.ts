import { PCS_CATALOG_COPY } from "./pcs-catalog-copy";

export const PCS_CATALOG_CONFIG = {
  copy: PCS_CATALOG_COPY,

  layout: {
    sidebarHeaderTitle: PCS_CATALOG_COPY.sidebar.headerTitle,
    sidebarHeaderSubtitle: PCS_CATALOG_COPY.sidebar.headerSubtitle,
    searchPlaceholder: PCS_CATALOG_COPY.search.placeholder,
  },
} as const;
