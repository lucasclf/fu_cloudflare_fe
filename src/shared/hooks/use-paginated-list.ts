import { useEffect, useMemo, useState } from "react";

type UsePaginatedListResult<T> = {
  visibleItems: T[];
  hasMore: boolean;
  remaining: number;
  loadMore: () => void;
};

/**
 * Limita a renderização de uma lista já filtrada a `pageSize` itens por vez.
 * Reseta para a primeira página sempre que `items` mudar de referência (ou
 * seja, quando o filtro/busca muda o resultado) — carregar mais páginas não
 * altera essa referência, então não dispara o reset.
 */
export function usePaginatedList<T>(
  items: T[],
  pageSize: number,
): UsePaginatedListResult<T> {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  const remaining = items.length - visibleItems.length;

  function loadMore() {
    setVisibleCount((count) => Math.min(count + pageSize, items.length));
  }

  return { visibleItems, hasMore: remaining > 0, remaining, loadMore };
}
