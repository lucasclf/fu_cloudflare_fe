import { useCallback, useEffect, useState } from "react";

export type AsyncResourceState<TData> = {
  data: TData | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

type AsyncResourceLoader<TData> = (signal: AbortSignal) => Promise<TData>;

export function useAsyncResource<TData>(
  loader: AsyncResourceLoader<TData>,
): AsyncResourceState<TData> {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<Omit<AsyncResourceState<TData>, "reload">>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadResource() {
      try {
        setState({
          data: null,
          loading: true,
          error: null,
        });

        const data = await loader(controller.signal);

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
          error:
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os dados.",
        });
      }
    }

    void loadResource();

    return () => controller.abort();
  }, [loader, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, reload };
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
