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

export async function fetchRecipesByBreweryMembers(breweryId) {
  const supabase = getSupabaseClient();

  const { data: members, error: membersError } = await supabase
    .from("brewery_members")
    .select("user_id")
    .eq("brewery_id", breweryId)
    .eq("status", "approved");

  if (membersError) throw membersError;

  const userIds = members.map((m) => m.user_id);

  if (userIds.length === 0) {
    return []; // no members = no recipes
  }

  const { data: recipes, error: recipesError } = await supabase
    .from("recipes")
    .select("*")
    .in("user_id", userIds);

  if (recipesError) throw recipesError;

  return recipes;
}
