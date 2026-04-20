import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "lms_user";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to read auth user from localStorage", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = (nextUser) => {
    if (!nextUser?.name || !nextUser?.role) {
      throw new Error("login() requires a user object with name and role");
    }

    const normalizedUser = {
      name: String(nextUser.name).trim(),
      role: String(nextUser.role).trim().toLowerCase(),
    };

    setUser(normalizedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
