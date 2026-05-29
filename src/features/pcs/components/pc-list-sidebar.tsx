import {
  ListSidebar,
  type ListSidebarItem,
} from "../../../shared/components/list-sidebar";
import { PCS_CATALOG_CONFIG } from "../config/pcs-catalog-config";
import type { PcSummary } from "../types/pc";

type PcListSidebarProps = {
  pcs: PcSummary[];
  selectedPcId: number | null;
  onSelectPc: (pcId: number) => void;
  onClearSelection: () => void;
};

export function PcListSidebar({
  pcs,
  selectedPcId,
  onSelectPc,
  onClearSelection,
}: PcListSidebarProps) {
  const items: ListSidebarItem<number>[] = pcs.map((pc) => ({
    id: pc.id,
    title: pc.name,
    subtitle: pc.tagline ?? undefined,
  }));

  return (
    <ListSidebar
      ariaLabel={PCS_CATALOG_CONFIG.copy.sidebar.listAriaLabel}
      items={items}
      selectedItemId={selectedPcId}
      clearSelectionLabel={PCS_CATALOG_CONFIG.copy.sidebar.showAllButtonLabel}
      emptyMessage={PCS_CATALOG_CONFIG.copy.sidebar.emptyMessage}
      onSelect={onSelectPc}
      onClearSelection={onClearSelection}
    />
  );
}
