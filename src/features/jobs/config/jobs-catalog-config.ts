import { JOBS_CATALOG_COPY } from "./jobs-catalog-copy";

export const JOBS_CATALOG_CONFIG = {
  copy: JOBS_CATALOG_COPY,

  layout: {
    sidebarHeaderTitle: JOBS_CATALOG_COPY.sidebar.headerTitle,
    sidebarHeaderSubtitle: JOBS_CATALOG_COPY.sidebar.headerSubtitle,
    searchPlaceholder: JOBS_CATALOG_COPY.search.placeholder,
  },
} as const;
