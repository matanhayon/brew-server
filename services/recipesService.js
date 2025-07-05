import { getSupabaseClient } from "./supabaseClient.js";

export async function addRecipe(recipeData, token) {
  const supabase = getSupabaseClient(token);

  const { data, error } = await supabase
    .from("recipes")
    .insert(recipeData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchAllRecipes() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("recipes").select("*");

  if (error) throw error;
  return data;
}

export async function fetchRecipeById(id) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
