import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("access_token", res.data.access_token);
  const userRes = await api.get("/auth/me");
  setUser(userRes.data);
  return userRes.data;   // ← ab role yahi se milega
};

  const signup = async (userData) => {
    await api.post("/auth/signup", userData);
    // After signup, log the user in automatically
    return login(userData.email, userData.password);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}