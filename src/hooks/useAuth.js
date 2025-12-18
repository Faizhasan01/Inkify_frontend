import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { getApiUrl } from "../lib/api.js";

export function useAuth() {
  const [state, setState] = useState({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const apiUrl = getApiUrl();
  const [location] = useLocation();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, [apiUrl]);

  useEffect(() => {
    
    if (
      location === "/login" ||
      location === "/register" ||
      location.startsWith("/reset-password")
    ) {
      setState((prev) => ({
        ...prev,
        isLoading: false, 
      }));
      return; 
    }

   
    checkAuth();
  }, [checkAuth, location]);

  const login = async (email, password) => {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }
    
    const data = await response.json();
    setState({
      user: data.user,
      isLoading: false,
      isAuthenticated: true,
    });
    return data.user;
  };

  const register = async (email, password, name) => {
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }
    
    const data = await response.json();
    setState({
      user: data.user,
      isLoading: false,
      isAuthenticated: true,
    });
    return data.user;
  };

  const logout = async () => {
    await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return {
    ...state,
    login,
    register,
    logout,
    checkAuth,
  };
}
