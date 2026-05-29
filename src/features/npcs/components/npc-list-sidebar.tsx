import {
  ListSidebar,
  type ListSidebarItem,
} from "../../../shared/components/list-sidebar";
import { NPCS_CATALOG_CONFIG } from "../config/npcs-catalog-config";
import type { NpcSummary } from "../types/npc";

type NpcListSidebarProps = {
  npcs: NpcSummary[];
  selectedNpcId: number | null;
  onSelectNpc: (npcId: number) => void;
  onClearSelection: () => void;
};

export function NpcListSidebar({
  npcs,
  selectedNpcId,
  onSelectNpc,
  onClearSelection,
}: NpcListSidebarProps) {
  const items: ListSidebarItem<number>[] = npcs.map((npc) => ({
    id: npc.id,
    title: npc.name,
    subtitle: npc.tagline ?? undefined,
  }));

  return (
    <ListSidebar
      ariaLabel={NPCS_CATALOG_CONFIG.copy.sidebar.listAriaLabel}
      items={items}
      selectedItemId={selectedNpcId}
      clearSelectionLabel={NPCS_CATALOG_CONFIG.copy.sidebar.showAllButtonLabel}
      emptyMessage={NPCS_CATALOG_CONFIG.copy.sidebar.emptyMessage}
      onSelect={onSelectNpc}
      onClearSelection={onClearSelection}
    />
  );
}
