import { useCallback, useMemo, useState } from "react";

import type { ItemType } from "../types/item";

type ExpandedItemTypesState = {
  selectedType: ItemType | null;
  expandedTypes: ItemType[];
};

type UseExpandedItemTypesResult = {
  isItemTypeExpanded: (itemType: ItemType) => boolean;
  toggleItemType: (itemType: ItemType) => void;
};

export function useExpandedItemTypes(
  selectedType: ItemType | null,
): UseExpandedItemTypesResult {
  const [expandedState, setExpandedState] = useState<ExpandedItemTypesState>(
    () => ({
      selectedType,
      expandedTypes: selectedType === null ? [] : [selectedType],
    }),
  );

  const expandedTypes = useMemo(() => {
    return getExpandedTypesForSelectedType(expandedState, selectedType);
  }, [expandedState, selectedType]);

  const isItemTypeExpanded = useCallback(
    (itemType: ItemType) => {
      return expandedTypes.includes(itemType);
    },
    [expandedTypes],
  );

  const toggleItemType = useCallback(
    (itemType: ItemType) => {
      setExpandedState((current) => {
        const currentExpandedTypes = getExpandedTypesForSelectedType(
          current,
          selectedType,
        );

        const nextExpandedTypes = currentExpandedTypes.includes(itemType)
          ? currentExpandedTypes.filter((value) => value !== itemType)
          : [...currentExpandedTypes, itemType];

        return {
          selectedType,
          expandedTypes: nextExpandedTypes,
        };
      });
    },
    [selectedType],
  );

  return {
    isItemTypeExpanded,
    toggleItemType,
  };
}

function getExpandedTypesForSelectedType(
  state: ExpandedItemTypesState,
  selectedType: ItemType | null,
): ItemType[] {
  if (state.selectedType === selectedType) {
    return state.expandedTypes;
  }

  if (selectedType === null) {
    return [];
  }

  return [selectedType];
}
