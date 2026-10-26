import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthUser,
  googleSignIn,
  fetchMe,
  getStoredUser,
  getStoredToken,
  storeAuth,
  clearAuth,
  isBackendAvailable,
} from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  backendAvailable: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isLoadingGate: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
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

      if (storedUser && storedToken) {
        if (available) {
          // Backend is up: validate the stored token so expired/invalid
          // sessions are cleared and the Google login screen returns.
          try {
            const freshUser = await fetchMe(storedToken);
            storeAuth(freshUser, storedToken);
            setUser(freshUser);
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
        setInitializing(false);
        return;
      }

      setInitializing(false);
    })();
  }, []);

  const loginWithGoogle = async (credential: string) => {
    setError(null);
    setLoading(true);
    try {
      const { user: authUser, token } = await googleSignIn(credential);
      storeAuth(authUser, token);
      setUser(authUser);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google authentication failed.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setError(null);
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        backendAvailable,
        error,
        isAuthenticated,
        isLoadingGate: initializing,
        loginWithGoogle,
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
