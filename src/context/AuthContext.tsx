import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthUser,
  login as apiLogin,
  register as apiRegister,
  fetchMe,
  getStoredUser,
  getStoredToken,
  getStoredGuest,
  storeAuth,
  storeGuest,
  clearAuth,
  clearGuest,
  isBackendAvailable,
} from "../services/authService";

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  guest: boolean;
  loading: boolean;
  backendAvailable: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isLoadingGate: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  enterGuestMode: () => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [guest, setGuest] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const available = await isBackendAvailable();
      setBackendAvailable(available);

      const storedUser = getStoredUser();
      const storedToken = getStoredToken();
      const storedGuest = getStoredGuest();

      if (storedGuest && !storedUser) {
        setGuest(true);
        setInitializing(false);
        return;
      }

      if (storedUser && storedToken) {
        if (available) {
          // Backend is up: validate the stored token so expired/invalid
          // sessions are cleared and the auth gate returns.
          try {
            const freshUser = await fetchMe(storedToken);
            storeAuth(freshUser, storedToken);
            setUser(freshUser);
            setGuest(false);
            setInitializing(false);
            return;
          } catch {
            clearAuth();
            setUser(null);
            setInitializing(false);
            return;
          }
        }
        // Backend unavailable: retain the persisted session rather than
        // locking the user out. It is already stored locally.
        setUser(storedUser);
        setGuest(false);
        setInitializing(false);
        return;
      }

      setInitializing(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { user: authUser, token } = await apiLogin(email, password);
      storeAuth(authUser, token);
      setUser(authUser);
      setGuest(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setError(null);
    setLoading(true);
    try {
      const { user: authUser, token } = await apiRegister(input.email, input.password, input.name);
      storeAuth(authUser, token);
      setUser(authUser);
      setGuest(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enterGuestMode = () => {
    storeGuest();
    setGuest(true);
    setError(null);
  };

  const handleLogout = () => {
    clearAuth();
    clearGuest();
    setUser(null);
    setGuest(false);
  };

  const isAuthenticated = Boolean(user || guest);

  return (
    <AuthContext.Provider
      value={{
        user,
        guest,
        loading,
        backendAvailable,
        error,
        isAuthenticated,
        isLoadingGate: initializing,
        login,
        register,
        enterGuestMode,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
