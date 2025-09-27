/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-env browser */

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const authAPI = {
  signup: (data: any) => api.post("/auth/signup", data),
  signin: (data: any) => api.post("/auth/signin", data),
  google: (credential: string) => api.post("/auth/google", { credential }),
  verify: (token: string) => api.get(`/auth/verify/${token}`),
  me: () => api.get("/auth/me"),
};

export const resumeAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  list: () => api.get("/resume/list"),
  get: (id: string) => api.get(`/resume/${id}`),
  delete: (id: string) => api.delete(`/resume/${id}`),
};

export const aiAPI = {
  analyze: (data: any) => api.post("/ai/analyze", data),
  tailor: (data: any) => api.post("/ai/tailor", data),
  getApplications: () => api.get("/ai/applications"),
  getApplication: (id: string) => api.get(`/ai/application/${id}`),
};
