import type { ReactNode } from "react";

import { SearchField } from "@/shared/components/search-field";

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
        <header className="catalog-layout__sidebar-header">
          <h1 className="catalog-layout__title">Grimório</h1>

          <p className="catalog-layout__subtitle">{sidebarHeaderSubtitle}</p>
        </header>

        <div className="catalog-layout__search-wrapper">
          {categorySwitcher}

          <SearchField
            id="catalog-search"
            label={searchPlaceholder}
            hideLabel
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
          />

          {searchExtraContent ? (
            <div className="catalog-layout__search-extra">
              {searchExtraContent}
            </div>
          ) : null}
        </div>

        <section
          className="catalog-layout__sidebar-list"
          aria-labelledby="catalog-sidebar-title"
        >
          <h2
            id="catalog-sidebar-title"
            className="catalog-layout__section-header"
          >
            {sidebarHeaderTitle}
          </h2>

          {sidebarContent}
        </section>
      </aside>

      <main className="catalog-layout__main">{mainContent}</main>
    </div>
  );
}
