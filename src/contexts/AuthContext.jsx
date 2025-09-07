import { createContext, useState, useContext, useEffect } from "react";
import { apiClient } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used ');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('AuthContext: Checking token on mount:', !!token);
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Verify stored token validity
      apiClient.get("/api/auth/verify")
        .then(response => {
          console.log('AuthContext: Token verified, user:', response.data.user);
          setCurrentUser(response.data.user);
        })
        .catch((error) => {
          // Token expired or invalid, clean up
          console.log('AuthContext: Token verification failed:', error.response?.status);
          localStorage.removeItem("token");
          delete apiClient.defaults.headers.common["Authorization"];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (userData) => {
    try {
      const response = await apiClient.post("/api/auth/signup", userData);
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setCurrentUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Something went wrong during signup" 
      };
    }
  };

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Trying to log in user:', credentials.email);
      const response = await apiClient.post("/api/auth/login", credentials);
      const { token, user } = response.data;
      
      console.log('AuthContext: Login worked! Setting up user session');
      localStorage.setItem("token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setCurrentUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.log('AuthContext: Login failed:', error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed. Please check your credentials." 
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      //if logout fails on server
      console.log("Logout request failed");
    }
    
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
    isAuthenticated: !!currentUser,
    apiClient
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};