import { apiRequest } from "./api-client.service";

/** @typedef {import("../types/user.types").User} User */
/** @typedef {import("../types/user.types").UpdateUserRequest} UpdateUserRequest */

/**
 * @param {string} token
 * @returns {Promise<User>}
 */
export function getCurrentUser(token) {
  return apiRequest("/users/me", { token });
}

/**
 * @param {string} token
 * @param {UpdateUserRequest} payload
 * @returns {Promise<User>}
 */
export function updateCurrentUser(token, payload) {
  return apiRequest("/users/me", {
    method: "PUT",
    token,
    body: payload,
  });
}
