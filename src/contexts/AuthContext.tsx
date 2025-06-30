import React, { useState, useEffect, type ReactNode } from "react";
import axios, { AxiosError } from "axios";
import { AuthContext, type AuthContextType } from "./AuthContextTypes";

const API_BASE_URL = "http://localhost:3001/api";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      if (response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials,
        {
          withCredentials: true,
        }
      );

      if (response.data.data) {
        setUser(response.data.data);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Une erreur est survenue lors de la connexion";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        credentials
      );

      if (response.data.data) {
        setUser(response.data.data);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Une erreur est survenue lors de l'inscription";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Une erreur est survenue lors de la déconnexion";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
