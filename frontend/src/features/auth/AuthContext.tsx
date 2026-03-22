import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { apiRequest, ApiError } from "@/lib/api";
import type {
  AuthSuccessResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
} from "./types";

interface AuthContextValue {
  accessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await apiRequest<AuthSuccessResponse>("/auth/login/", {
      method: "POST",
      body: payload,
    });

    setAccessToken(response.access);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await apiRequest<RegisterResponse>("/auth/register/", {
      method: "POST",
      body: payload,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest<{ detail: string }>("/auth/logout/", {
        method: "POST",
      });
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const response = await apiRequest<AuthSuccessResponse>("/auth/refresh/", {
      method: "POST",
    });

    setAccessToken(response.access);
    setUser(response.user);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await refreshSession();
      } catch (error) {
        if (!(error instanceof ApiError)) {
          console.error(error);
        }
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      user,
      isLoading,
      isAuthenticated: Boolean(accessToken && user),
      login,
      register,
      logout,
      refreshSession,
    }),
    [accessToken, user, isLoading, login, register, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
