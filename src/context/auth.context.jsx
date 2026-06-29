import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../services/auth.service";
import { getCurrentUser, updateCurrentUser } from "../services/user.service";
import {
  clearAuthSession,
  getStoredToken,
  getStoredUserName,
  storeAuthSession,
} from "../services/storage.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken);
  const [userName, setUserName] = useState(getStoredUserName);
  /** @type {[import("../types/user.types").User | null, Function]} */
  const [user, setUser] = useState(null);

  const isAuthenticated = Boolean(token);

  const loadCurrentUser = useCallback(async (activeToken = token) => {
    if (!activeToken) {
      setUser(null);
      return null;
    }

    const currentUser = await getCurrentUser(activeToken);
    setUser(currentUser);
    setUserName(currentUser.name);
    return currentUser;
  }, [token]);

  async function login(credentials) {
    const response = await loginRequest(credentials);
    storeAuthSession({ token: response.token, name: response.name });
    setToken(response.token);
    setUserName(response.name);
    await loadCurrentUser(response.token);
    return response;
  }

  async function register(payload) {
    return registerRequest(payload);
  }

  async function updateProfile(payload) {
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const updatedUser = await updateCurrentUser(token, payload);
    setUser(updatedUser);
    setUserName(updatedUser.name);
    storeAuthSession({ token, name: updatedUser.name });
    return updatedUser;
  }

  function logout() {
    clearAuthSession();
    setToken(null);
    setUserName(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      userName,
      user,
      isAuthenticated,
      login,
      register,
      updateProfile,
      loadCurrentUser,
      logout,
    }),
    [token, userName, user, isAuthenticated, loadCurrentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
