// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAsyncResourceByKey } from "./use-async-resource-by-key";

describe("useAsyncResourceByKey", () => {
  it("não chama loader quando keyValue é null", () => {
    const loader = vi.fn();

    const { result } = renderHook(() =>
      useAsyncResourceByKey<number, { id: number }>({
        keyValue: null,
        loader,
      }),
    );

    expect(loader).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("carrega dados quando keyValue possui valor", async () => {
    const loader = vi.fn(async (id: number) => {
      return {
        id,
        name: "Arcanista",
      };
    });

    const { result } = renderHook(() =>
      useAsyncResourceByKey<number, { id: number; name: string }>({
        keyValue: 1,
        loader,
      }),
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({
        id: 1,
        name: "Arcanista",
      });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(loader).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenCalledWith(1, expect.any(AbortSignal));
  });

  it("limpa dados quando keyValue volta para null", async () => {
    const loader = vi.fn(async (id: number) => {
      return {
        id,
        name: "Guardião",
      };
    });

    const { result, rerender } = renderHook(
      ({ keyValue }: { keyValue: number | null }) =>
        useAsyncResourceByKey<number, { id: number; name: string }>({
          keyValue,
          loader,
        }),
      {
        initialProps: {
          keyValue: 2,
        },
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({
        id: 2,
        name: "Guardião",
      });
    });

    rerender({
      keyValue: null,
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        data: null,
        loading: false,
        error: null,
      });
    });
  });

  it("retorna mensagem de erro customizada quando loader falha", async () => {
    const loader = vi.fn(async () => {
      throw new Error("Erro original da API.");
    });

    const { result } = renderHook(() =>
      useAsyncResourceByKey<number, { id: number }>({
        keyValue: 1,
        loader,
        getErrorMessage: () => "Não foi possível carregar o recurso.",
      }),
    );

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Não foi possível carregar o recurso.",
      );
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("mantém dado anterior durante novo carregamento quando clearDataOnLoad é false", async () => {
    const firstRequest = createDeferred<{ id: number }>();
    const secondRequest = createDeferred<{ id: number }>();

    const loader = vi
      .fn<[(id: number, signal: AbortSignal) => Promise<{ id: number }>]>()
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result, rerender } = renderHook(
      ({ keyValue }: { keyValue: number }) =>
        useAsyncResourceByKey<number, { id: number }>({
          keyValue,
          loader,
          clearDataOnLoad: false,
        }),
      {
        initialProps: {
          keyValue: 1,
        },
      },
    );

    await act(async () => {
      firstRequest.resolve({
        id: 1,
      });
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({
        id: 1,
      });
    });

    rerender({
      keyValue: 2,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    expect(result.current.data).toEqual({
      id: 1,
    });

    await act(async () => {
      secondRequest.resolve({
        id: 2,
      });
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({
        id: 2,
      });
    });

    expect(result.current.loading).toBe(false);
  });

  it("aborta requisição anterior quando keyValue muda", async () => {
    const firstRequest = createDeferred<{ id: number }>();
    const secondRequest = createDeferred<{ id: number }>();

    const loader = vi
      .fn<[(id: number, signal: AbortSignal) => Promise<{ id: number }>]>()
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise);

    const { result, rerender } = renderHook(
      ({ keyValue }: { keyValue: number }) =>
        useAsyncResourceByKey<number, { id: number }>({
          keyValue,
          loader,
        }),
      {
        initialProps: {
          keyValue: 1,
        },
      },
    );

    await waitFor(() => {
      expect(loader).toHaveBeenCalledTimes(1);
    });

    const firstSignal = loader.mock.calls[0][1];

    rerender({
      keyValue: 2,
    });

    await waitFor(() => {
      expect(loader).toHaveBeenCalledTimes(2);
    });

    expect(firstSignal.aborted).toBe(true);

    await act(async () => {
      firstRequest.resolve({
        id: 1,
      });

      secondRequest.resolve({
        id: 2,
      });
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({
        id: 2,
      });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return {
    promise,
    resolve,
    reject,
  };
}