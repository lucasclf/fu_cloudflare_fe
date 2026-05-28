import { useEffect, useState } from "react";

export type AsyncResourceByKeyState<TData> = {
  data: TData | null;
  loading: boolean;
  error: string | null;
};

type AsyncResourceByKeyLoader<TKey, TData> = (
  key: TKey,
  signal: AbortSignal,
) => Promise<TData>;

type UseAsyncResourceByKeyParams<TKey, TData> = {
  keyValue: TKey | null;
  loader: AsyncResourceByKeyLoader<TKey, TData>;
  getErrorMessage?: (error: unknown) => string;
  clearDataOnLoad?: boolean;
};

export function useAsyncResourceByKey<TKey, TData>({
  keyValue,
  loader,
  getErrorMessage = getDefaultErrorMessage,
  clearDataOnLoad = true,
}: UseAsyncResourceByKeyParams<TKey, TData>): AsyncResourceByKeyState<TData> {
  const [state, setState] = useState<AsyncResourceByKeyState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (keyValue === null) {
      setState({
        data: null,
        loading: false,
        error: null,
      });
      return;
    }

    const currentKey = keyValue;
    const controller = new AbortController();

    async function loadResource() {
      try {
        setState((current) => ({
          data: clearDataOnLoad ? null : current.data,
          loading: true,
          error: null,
        }));

        const data = await loader(currentKey, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setState({
          data,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) {
          return;
        }

        setState({
          data: null,
          loading: false,
          error: getErrorMessage(error),
        });
      }
    }

    void loadResource();

    return () => controller.abort();
  }, [keyValue, loader, getErrorMessage, clearDataOnLoad]);

  return state;
}

function getDefaultErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Não foi possível carregar os dados.";
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}