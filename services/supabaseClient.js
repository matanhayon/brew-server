import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

export function getSupabaseClient(token) {
  const { SUPABASE_URL, SUPABASE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase configuration.");
  }

  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      fetch: async (url, options = {}) => {
        const headers = new Headers(options?.headers);
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return fetch(url, { ...options, headers });
      },
    },
  });
}
