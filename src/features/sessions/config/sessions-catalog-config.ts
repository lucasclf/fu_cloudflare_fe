import { SESSIONS_CATALOG_COPY } from "./sessions-catalog-copy";

export const SESSIONS_CATALOG_CONFIG = {
  copy: SESSIONS_CATALOG_COPY,

  layout: {
    sidebarHeaderTitle: SESSIONS_CATALOG_COPY.sidebar.headerTitle,
    sidebarHeaderSubtitle: SESSIONS_CATALOG_COPY.sidebar.headerSubtitle,
    searchPlaceholder: SESSIONS_CATALOG_COPY.search.placeholder,
  },
} as const;
