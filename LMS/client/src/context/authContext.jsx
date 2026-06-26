import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("lms_user");
        const token = localStorage.getItem("lms_token");
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          // If we had a live backend, we would verify the token here:
          // const profile = await api.getProfile();
          // setUser(profile);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        localStorage.removeItem("lms_user");
        localStorage.removeItem("lms_token");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      localStorage.setItem("lms_token", data.token);
      localStorage.setItem("lms_user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      const data = await api.register(name, email, password, role);
      setUser(data.user);
      localStorage.setItem("lms_token", data.token);
      localStorage.setItem("lms_user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
