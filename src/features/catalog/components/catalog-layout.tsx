import type { ReactNode } from "react";

import { PageHeader } from "../../../shared/components/page-header";
import { SearchField } from "../../../shared/components/search-field";

import "./catalog-layout.css";

type CatalogLayoutProps = {
  sidebarHeaderTitle: string;
  sidebarHeaderSubtitle: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  categorySwitcher: ReactNode;
  searchExtraContent?: ReactNode;
  sidebarContent: ReactNode;
  mainContent: ReactNode;
};

export function CatalogLayout({
  sidebarHeaderTitle,
  sidebarHeaderSubtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  categorySwitcher,
  searchExtraContent,
  sidebarContent,
  mainContent,
}: CatalogLayoutProps) {
  return (
    <div className="catalog-layout">
      <aside className="catalog-layout__sidebar">
        <div className="catalog-layout__sidebar-header">
          <PageHeader
            title="Grimório"
            subtitle={sidebarHeaderSubtitle}
            actions={categorySwitcher}
            variant="compact"
          />
        </div>

        <div className="catalog-layout__search-wrapper">
          <SearchField
            id="catalog-search"
            label={searchPlaceholder}
            hideLabel
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            className="catalog-layout__search-field"
          />

          {searchExtraContent ? (
            <div className="catalog-layout__search-extra">
              {searchExtraContent}
            </div>
          ) : null}
        </div>

        <div className="catalog-layout__sidebar-list">
          <p className="catalog-layout__section-header">{sidebarHeaderTitle}</p>
          {sidebarContent}
        </div>
      </aside>

      <main className="catalog-layout__main">{mainContent}</main>
    </div>
  );
}
