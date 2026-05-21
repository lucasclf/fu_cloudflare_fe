const DEFAULT_API_BASE_URL = "https://fudb.cqn-lucas.workers.dev";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = (
  configuredApiBaseUrl || DEFAULT_API_BASE_URL
).replace(/\/$/, "");