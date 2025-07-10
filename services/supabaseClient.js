import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

export function getSupabaseClient(token = null) {
  const { SUPABASE_URL, SUPABASE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase configuration.");
  }

  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
}
