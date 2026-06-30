import { apiRequest } from "./api-client.service";

/** @typedef {import("../types/auth.types").LoginRequest} LoginRequest */
/** @typedef {import("../types/auth.types").RegisterRequest} RegisterRequest */
/** @typedef {import("../types/auth.types").AuthResponse} AuthResponse */
/** @typedef {import("../types/auth.types").RegisterResponse} RegisterResponse */

/**
 * @param {LoginRequest} credentials
 * @returns {Promise<AuthResponse>}
 */
export function login(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

/**
 * @param {RegisterRequest} payload
 * @returns {Promise<RegisterResponse>}
 */
export function register(payload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: payload,
  });
}
