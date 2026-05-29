import { SCENARIO_CATALOG_COPY } from "./scenario-catalog-copy";

export const SCENARIO_CATALOG_CONFIG = {
  copy: SCENARIO_CATALOG_COPY,

  layout: {
    sidebarHeaderTitle: SCENARIO_CATALOG_COPY.sidebar.headerTitle,
    sidebarHeaderSubtitle: SCENARIO_CATALOG_COPY.sidebar.headerSubtitle,
    searchPlaceholder: SCENARIO_CATALOG_COPY.search.placeholder,
  },
} as const;
