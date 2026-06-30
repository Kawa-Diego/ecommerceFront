import { apiRequest } from "./api-client.service";
// @typedef {{ message: string, status: string }} HomeResponse 

export function getHomeMessage() {
  return apiRequest("", { method: "GET" });
}
