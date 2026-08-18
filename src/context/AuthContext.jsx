import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("googleUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("googleUser");
      }
    }
    setLoading(false);
  }, []);

  // Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("googleUser", JSON.stringify(data.user));
        localStorage.setItem("authToken", data.token);
        return data;
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("googleUser");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, handleGoogleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
