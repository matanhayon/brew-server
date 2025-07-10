import { fetchBrewsByBrewery } from "../services/brewsService.js";
import { startBrew } from "../services/brewsService.js";
import { logBrewTemperature } from "../services/brewsService.js";
import { endBrew } from "../services/brewsService.js";
import {
  fetchBrewById,
  fetchBrewTemperatureLogs,
} from "../services/brewsService.js";

import { getSupabaseClient } from "../services/supabaseClient.js";

export async function getBrewsByBrewery(req, res) {
  const { brewery_id } = req.query;

  if (!brewery_id) {
    return res.status(400).json({ error: "Missing brewery_id" });
  }

  try {
    const brews = await fetchBrewsByBrewery(brewery_id);
    res.json(brews);
  } catch (err) {
    console.error("[getBrewsByBrewery] Error:", err.message);
    res.status(500).json({ error: "Failed to fetch brews" });
  }
}

export async function startBrewSession(req, res) {
  const { brewery_id, user_id, recipe_id, recipe_snapshot, secret_key } =
    req.body;

  if (
    !brewery_id ||
    !user_id ||
    !recipe_id ||
    !recipe_snapshot ||
    !secret_key
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const brew = await startBrew({
      brewery_id,
      user_id,
      recipe_id,
      recipe_snapshot,
      secret_key, // ✅ forward it
    });

    res.status(201).json(brew);
  } catch (err) {
    console.error("[startBrewSession] Error:", err.message);
    res.status(500).json({ error: "Failed to start brew session" });
  }
}

export async function logTemperature(req, res) {
  const { brew_id, brewery_id, temperature_celsius } = req.body;

  if (!brew_id || !brewery_id || temperature_celsius == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await logBrewTemperature({
      brew_id,
      brewery_id,
      temperature_celsius,
    });
    res.status(201).json({ message: "Temperature logged" });
  } catch (err) {
    console.error("[logTemperature] Error:", err.message);
    res.status(500).json({ error: "Failed to log temperature" });
  }
}

export async function endBrewSession(req, res) {
  const { brew_id, user_id } = req.body;

  if (!brew_id || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const endedBrew = await endBrew({ brew_id, user_id });
    res.status(200).json(endedBrew);
  } catch (err) {
    console.error("[endBrewSession] Error:", err.message);
    res.status(500).json({ error: "Failed to end brew session" });
  }
}

export async function getBrewById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing brew id" });
  }

  try {
    const brew = await fetchBrewById(id);
    if (!brew) {
      return res.status(404).json({ error: "Brew not found" });
    }
    res.json(brew);
  } catch (err) {
    console.error("[getBrewById] Error:", err.message);
    res.status(500).json({ error: "Failed to fetch brew" });
  }
}

export async function getBrewTemperatureLogs(req, res) {
  const { brew_id } = req.query;

  if (!brew_id) {
    return res.status(400).json({ error: "Missing brew_id" });
  }

  try {
    const logs = await fetchBrewTemperatureLogs(brew_id);
    res.json(logs);
  } catch (err) {
    console.error("[getBrewTemperatureLogs] Error:", err.message);
    res.status(500).json({ error: "Failed to fetch temperature logs" });
  }
}

// In brewsController.js
export async function connectEmbeddedBrewSession(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Missing request body" });
  }

  const { brew_id, secret_key } = req.body;

  if (!brew_id || !secret_key) {
    return res.status(400).json({ error: "Missing brew_id or secret_key" });
  }

  try {
    const supabase = getSupabaseClient();

    // Check brew exists and key matches
    const { data: brew, error } = await supabase
      .from("brews")
      .select("*")
      .eq("id", brew_id)
      .eq("secret_key", secret_key)
      .single();

    if (error || !brew) {
      return res.status(403).json({ error: "Invalid brew_id or secret_key" });
    }

    // If it's pending, update to in_progress
    if (brew.status === "pending") {
      const { data: updatedBrew, error: updateError } = await supabase
        .from("brews")
        .update({ status: "started" })
        .eq("id", brew_id)
        .select("*")
        .single();

      if (updateError) {
        console.error(
          "[connectEmbeddedBrewSession] Update error:",
          updateError.message
        );
        return res.status(500).json({ error: "Failed to update brew status" });
      }

      return res.status(200).json(updatedBrew);
    }

    // Otherwise just return it
    return res.status(200).json(brew);
  } catch (err) {
    console.error("[connectEmbeddedBrewSession] Error:", err.message);
    res.status(500).json({ error: "Failed to connect to brew session" });
  }
}
