import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function getAllRecipes() {
  const { data, error } = await supabase.from("recipes").select("*");
  if (error) throw error;
  return data;
}
