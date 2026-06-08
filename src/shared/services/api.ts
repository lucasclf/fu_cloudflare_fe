const DEFAULT_HOST = "https://api.fu-wiki.cqn.xyz.br";

const configured = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_HOST = (configured || DEFAULT_HOST).replace(/\/$/, "");

export const API_BASE_URL = `${API_HOST}/v1`;