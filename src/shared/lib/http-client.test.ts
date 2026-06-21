import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { httpGet } from "./http-client";

function createJsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);

  headers.set("content-type", "application/json");

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

describe("httpGet", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retorna data quando a resposta da API é sucesso", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        success: true,
        data: [{ id: 1, name: "Espada" }],
      }),
    );

    const result = await httpGet<Array<{ id: number; name: string }>>(
      "https://api.test/items",
    );

    expect(result).toEqual([{ id: 1, name: "Espada" }]);
    expect(fetchMock).toHaveBeenCalledWith("https://api.test/items", {
      method: "GET",
      credentials: "include",
      signal: undefined,
    });
  });

  it("envia AbortSignal quando informado", async () => {
    const controller = new AbortController();

    fetchMock.mockResolvedValue(
      createJsonResponse({
        success: true,
        data: [],
      }),
    );

    await httpGet("https://api.test/items", {
      signal: controller.signal,
    });

    expect(fetchMock).toHaveBeenCalledWith("https://api.test/items", {
      method: "GET",
      credentials: "include",
      signal: controller.signal,
    });
  });

  it("lança erro de negócio quando API retorna success false com HTTP 200", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Filtro inválido.",
        },
      }),
    );

    await expect(httpGet("https://api.test/items")).rejects.toThrow(
      "Filtro inválido.",
    );
  });

  it("lança mensagem da API quando HTTP falha e body possui erro", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Recurso não encontrado.",
          },
        },
        {
          status: 404,
        },
      ),
    );

    await expect(httpGet("https://api.test/items")).rejects.toThrow(
      "Recurso não encontrado.",
    );
  });

  it("lança erro com status quando HTTP falha sem JSON válido", async () => {
    fetchMock.mockResolvedValue(
      new Response("Internal Server Error", {
        status: 500,
        headers: {
          "content-type": "text/plain",
        },
      }),
    );

    await expect(httpGet("https://api.test/items")).rejects.toThrow(
      "Requisição falhou com status 500.",
    );
  });

  it("lança erro quando HTTP 200 retorna resposta sem JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("ok", {
        status: 200,
        headers: {
          "content-type": "text/plain",
        },
      }),
    );

    await expect(httpGet("https://api.test/items")).rejects.toThrow(
      "Resposta inválida da API.",
    );
  });
});
