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

export async function getRecipeById(id) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single(); // Ensures we only get one result

  if (error && error.code !== "PGRST116") throw error; // Let 404 be handled in caller
  return data;
}

export async function addRecipe(recipe) {
  const { data, error } = await supabase
    .from("recipes")
    .insert(recipe)
    .select();

  if (error) throw error;
  return data;
}
