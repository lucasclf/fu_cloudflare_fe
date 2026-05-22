import { useCallback, useEffect, useState } from "react";

import type { ItemType } from "../types/item";

type UseExpandedItemTypesResult = {
  isItemTypeExpanded: (itemType: ItemType) => boolean;
  toggleItemType: (itemType: ItemType) => void;
};

export function useExpandedItemTypes(
  selectedType: ItemType | null,
): UseExpandedItemTypesResult {
  const [expandedTypes, setExpandedTypes] = useState<ItemType[]>([]);

  useEffect(() => {
    if (selectedType === null) {
      setExpandedTypes([]);
      return;
    }

    setExpandedTypes((current) =>
      current.includes(selectedType) ? current : [selectedType],
    );
  }, [selectedType]);

  const isItemTypeExpanded = useCallback(
    (itemType: ItemType) => {
      return expandedTypes.includes(itemType);
    },
    [expandedTypes],
  );

  const toggleItemType = useCallback((itemType: ItemType) => {
    setExpandedTypes((current) => {
      if (current.includes(itemType)) {
        return current.filter((value) => value !== itemType);
      }

      return [...current, itemType];
    });
  }, []);

  return {
    isItemTypeExpanded,
    toggleItemType,
  };
}