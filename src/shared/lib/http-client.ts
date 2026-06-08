import type { ApiResponse } from "../types/api";

type HttpGetOptions = {
  signal?: AbortSignal;
};

type HttpPostOptions = {
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

const FALLBACK_ERROR_MESSAGE =
  "Não foi possível concluir a operação. Verifique os dados informados e tente novamente.";

/**
 * Alguns erros da API (ex.: validação) ainda vazam o objeto de erro bruto
 * (ex.: `{ name: "ZodError", message: "[ {...} ]" }`, sem `code`) em vez do
 * contrato `{ code, message }` esperado. Nesses casos a mensagem é uma
 * serialização técnica — exibi-la ao usuário seria pouco amigável, então
 * caímos para uma mensagem genérica.
 */
function resolveErrorMessage(error: unknown): string {
  const hasFriendlyShape =
    error !== null &&
    typeof error === "object" &&
    typeof (error as Record<string, unknown>).code === "string" &&
    typeof (error as Record<string, unknown>).message === "string";

  if (hasFriendlyShape) {
    return (error as { message: string }).message;
  }

  return FALLBACK_ERROR_MESSAGE;
}

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
    credentials: "include",
  });

  const body = await parseJsonResponse<T>(response);

  if (!response.ok) {
    if (body && !body.success) {
      throw new Error(resolveErrorMessage(body.error));
    }

    throw new Error(`Requisição falhou com status ${response.status}.`);
  }

  if (!body) {
    throw new Error("Resposta inválida da API.");
  }

  if (!body.success) {
    throw new Error(resolveErrorMessage(body.error));
  }

  return body.data;
}

export async function httpPost<T>(
  url: string,
  payload: unknown,
  options: HttpPostOptions = {},
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    signal: options.signal,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(payload),
  });

  const body = await parseJsonResponse<T>(response);

  if (!response.ok) {
    if (body && !body.success) {
      throw new Error(resolveErrorMessage(body.error));
    }

    throw new Error(`Requisição falhou com status ${response.status}.`);
  }

  if (!body) {
    throw new Error("Resposta inválida da API.");
  }

  if (!body.success) {
    throw new Error(resolveErrorMessage(body.error));
  }

  return body.data;
}
