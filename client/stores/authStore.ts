/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { authAPI } from "@/lib/api";
import { create } from "zustand";

type Credentials = {
  email: string;
  password: string;
};

type SignupPayload = Credentials & {
  name?: string;
};

type AuthUser = {
  id?: string;
  email: string;
  name?: string;
  [key: string]: unknown;
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (payload: Credentials) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: AuthUser;
  [key: string]: unknown;
}

const getTokenFromResponse = (response: AuthResponse) => {
  return response.token ?? response.accessToken ?? null;
};

const getUserFromResponse = (response: AuthResponse) => {
  if (response.user) {
    return response.user as AuthUser;
  }

  const { token, accessToken, ...rest } = response;
  if ("email" in rest) {
    return rest as AuthUser;
  }

  return null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  login: async (payload) => {
    const { data } = await authAPI.signin(payload);
    const token = getTokenFromResponse(data);
    const user = getUserFromResponse(data);

    if (token && typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }

    set({
      user: user ?? null,
      token: token ?? null,
      isAuthenticated: Boolean(token ?? user),
      isInitialized: true,
    });
  },
  signup: async (payload) => {
    const { data } = await authAPI.signup(payload);
    const token = getTokenFromResponse(data);
    const user = getUserFromResponse(data);

    if (token && typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }

    set({
      user: user ?? null,
      token: token ?? null,
      isAuthenticated: Boolean(token ?? user),
      isInitialized: true,
    });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },
  initialize: async () => {
    if (get().isInitialized || typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      set({ isInitialized: true });
      return;
    }

    try {
      const { data } = await authAPI.me();
      const user =
        getUserFromResponse(data) ??
        ((data as any).user as AuthUser | undefined) ??
        null;

      set({
        user,
        token,
        isAuthenticated: Boolean(user),
        isInitialized: true,
      });
    } catch (error) {
      console.error("Failed to initialize auth state", error);
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },
}));
