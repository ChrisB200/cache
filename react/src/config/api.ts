import axios, { type AxiosInstance } from "axios";
import { API_URL } from "@/config/constants";
import supabase from "./supabase";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const { data, error } = await supabase.auth.getSession();
  const accessToken = data?.session?.access_token;
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
