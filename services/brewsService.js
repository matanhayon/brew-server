import { getSupabaseClient } from "./supabaseClient.js";

export async function fetchBrewsByBrewery(breweryId) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("brews")
    .select("*")
    .eq("brewery_id", breweryId)
    .order("created_at", { ascending: false }); // Optional: newest first

  if (error) {
    console.error("[fetchBrewsByBrewery] Supabase error:", error.message);
    throw new Error("Failed to fetch brews");
  }

  return data;
}
