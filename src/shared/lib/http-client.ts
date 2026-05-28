import type { ApiResponse } from "../types/api";

type HttpGetOptions = {
  signal?: AbortSignal;
};

async function parseJsonResponse<T>(
  response: Response,
): Promise<ApiResponse<T> | null> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  try {
    return (await response.json()) as ApiResponse<T>;
  } catch {
    return null;
  }
}

export async function httpGet<T>(
  url: string,
  options: HttpGetOptions = {},
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    signal: options.signal,
  });

  const body = await parseJsonResponse<T>(response);

  if (!response.ok) {
    if (body && !body.success) {
      throw new Error(body.error.message);
    }

    throw new Error(`Requisição falhou com status ${response.status}.`);
  }

  if (!body) {
    throw new Error("Resposta inválida da API.");
  }

  if (!body.success) {
    throw new Error(body.error.message);
  }

  return body.data;
}
