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

export async function startBrew({
  brewery_id,
  user_id,
  recipe_id,
  recipe_snapshot,
  secret_key,
}) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("brews")
    .insert([
      {
        brewery_id,
        user_id,
        recipe_id,
        recipe_snapshot,
        secret_key,
        status: "pending",
      },
    ])
    .select("*")
    .single();

  if (error) {
    console.error("[startBrew] Supabase error:", error.message);
    throw new Error("Failed to start brew session");
  }

  return data;
}

export async function logBrewTemperature({
  brew_id,
  brewery_id,
  user_id,
  temperature_celsius,
}) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("brew_temperature_logs").insert([
    {
      brew_id,
      brewery_id,
      user_id,
      temperature_celsius,
      recorded_at: new Date().toISOString(), // optional, you can omit if Supabase handles this
    },
  ]);

  if (error) {
    console.error("[logBrewTemperature] Supabase error:", error.message);
    throw new Error("Failed to log temperature");
  }
}

export async function endBrew({ brew_id, user_id }) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("brews")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
    })
    .eq("id", brew_id)
    .eq("user_id", user_id)
    .select("*")
    .single();

  if (error) {
    console.error("[endBrew] Supabase error:", error.message);
    throw new Error("Failed to end brew session");
  }

  return data;
}

export async function fetchBrewById(id) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("brews")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[fetchBrewById] Supabase error:", error.message);
    throw new Error("Failed to fetch brew");
  }

  return data;
}

export async function fetchBrewTemperatureLogs(brewId) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("brew_temperature_logs")
    .select("*")
    .eq("brew_id", brewId)
    .order("recorded_at", { ascending: true });

  if (error) {
    console.error("[fetchBrewTemperatureLogs] Supabase error:", error.message);
    throw new Error("Failed to fetch temperature logs");
  }

  return data;
}
