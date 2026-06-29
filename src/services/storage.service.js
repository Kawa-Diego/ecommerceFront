const TOKEN_KEY = "auth_token";
const USER_NAME_KEY = "auth_user_name";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUserName() {
  return localStorage.getItem(USER_NAME_KEY);
}

export function storeAuthSession({ token, name }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_NAME_KEY, name);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_NAME_KEY);
}
