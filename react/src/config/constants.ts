function getEnv(key: string) {
  const value = import.meta.env[key];
  if (!value) throw new Error(`No env variable ${key}`);

  return value;
}

export const API_URL = getEnv("VITE_API_URL");
export const STORAGE_URL = getEnv("VITE_STORAGE_URL");
export const SUPABASE_ANON = getEnv("VITE_SUPABASE_ANON");
export const SUPABASE_URL = getEnv("VITE_SUPABASE_URL");
