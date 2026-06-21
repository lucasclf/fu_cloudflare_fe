import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createPublicListFetcher } from "./create-public-list-fetcher";

function createJsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

describe("createPublicListFetcher", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("busca uma lista pública pelo recurso informado", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        success: true,
        data: [{ id: 1, name: "Espada" }],
      }),
    );

    const fetchItems = createPublicListFetcher<{ id: number; name: string }>(
      "items",
    );

    const result = await fetchItems();

    expect(result).toEqual([{ id: 1, name: "Espada" }]);

    const [url, init] = fetchMock.mock.calls[0];

    expect(String(url)).toMatch(/\/public\/items$/);
    expect(init).toEqual({
      method: "GET",
      credentials: "include",
      signal: undefined,
    });
  });

  it("normaliza barras extras no nome do recurso", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        success: true,
        data: [],
      }),
    );

    const fetchItems = createPublicListFetcher("/items/");

    await fetchItems();

    const [url] = fetchMock.mock.calls[0];

    expect(String(url)).toMatch(/\/public\/items$/);
    expect(String(url)).not.toContain("/public//items");
  });

  it("repassa AbortSignal para o http client", async () => {
    const controller = new AbortController();

    fetchMock.mockResolvedValue(
      createJsonResponse({
        success: true,
        data: [],
      }),
    );

    const fetchItems = createPublicListFetcher("items");

    await fetchItems(controller.signal);

    const [, init] = fetchMock.mock.calls[0];

    expect(init).toEqual({
      method: "GET",
      credentials: "include",
      signal: controller.signal,
    });
  });
});
