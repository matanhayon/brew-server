import { getSupabaseClient } from "./supabaseClient.js";

import { v4 as uuidv4 } from "uuid";

export async function registerDevice({ name, brewery_id }, token = null) {
  console.log("[registerDevice] called with:", {
    name,
    brewery_id,
    tokenPresent: !!token,
  });

  const supabase = getSupabaseClient(token);
  const secret_key = uuidv4();

  console.log("[registerDevice] Generated secret key:", secret_key);

  const { data, error } = await supabase
    .from("devices")
    .insert({ name, brewery_id, secret_key })
    .select()
    .single();

  if (error) {
    console.error("[registerDevice] Supabase insert error:", error);
    throw new Error(`Failed to insert device: ${error.message}`);
  }

  console.log("[registerDevice] Inserted device data:", data);

  return data;
}

export async function fetchDevicesByBrewery(breweryId) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("brewery_id", breweryId);
  if (error) throw error;
  return data;
}

export async function updateDeviceStatus(id, status) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("devices")
    .update({ status, last_seen_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDevice(id) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("devices").delete().eq("id", id);
  if (error) throw error;
}
