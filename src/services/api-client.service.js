/**
 * @typedef {Object} ApiErrorShape
 * @property {number} status
 * @property {string} message
 * @property {string[]} errors
 */

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {string[]} errors
   */
  constructor(message, status, errors = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const API_BASE_URL = 
( import.meta.env.VITE_API_BASE_URL 
  || "/api"). replace(/\/+$/, "");

async function readResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

/**
 * @param {string} path
 * @param {
 * {
 *  token?: string,
 *  body?: object,
 *  headers?: object,
 *  method?: string 
 * }} options
 */
export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new ApiError(
      "API não configurada em variável de ambiente.",
      0,
    );
  }

  const { 
    token, 
    body, 
    headers = {},
   method = "GET", ...rest } = options;

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Ocorreu um erro ao se conectar com o servidor",
      0,
    );
  }

  const payload = await readResponse(response);

  if (!response.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string" && payload) ||
      `Erro HTTP ${response.status}`;

    const errors = (typeof payload === "object" && payload?.errors) || [];

    throw new ApiError(message, response.status, errors);
  }

  return payload;
}
