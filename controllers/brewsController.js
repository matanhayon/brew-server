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

    const supabase = getSupabaseClient();
    const { data: brew, error } = await supabase
      .from("brews")
      .select("status")
      .eq("id", brew_id)
      .single();

    if (error || !brew) {
      console.warn(
        "[logTemperature] Temperature logged, but failed to fetch brew status."
      );
      return res.status(201).json({
        message: "Temperature logged",
        brew_status: null,
      });
    }

    return res.status(201).json({
      message: "Temperature logged",
      brew_status: brew.status,
    });
  } catch (err) {
    console.error("[logTemperature] Error:", err.message);
    res.status(500).json({ error: "Failed to log temperature" });
  }
}

export async function endBrewSession(req, res) {
  const { brew_id } = req.body;

  if (!brew_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const endedBrew = await endBrew({ brew_id });
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

export async function embeddedStartBrewSession(req, res) {
  console.log("[embeddedStartBrewSession] Incoming request body:", req.body);

  const { brew_id, secret_key } = req.body;

  if (!brew_id || !secret_key) {
    console.warn("[embeddedStartBrewSession] Missing required fields:", {
      brew_id,
      secret_key,
    });
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const supabase = getSupabaseClient();

    console.log(
      `[embeddedStartBrewSession] Fetching brew with id=${brew_id} and secret_key=${secret_key}`
    );
    const { data: brew, error: fetchError } = await supabase
      .from("brews")
      .select("*")
      .eq("id", brew_id)
      .eq("secret_key", secret_key)
      .single();

    if (fetchError || !brew) {
      console.error(
        "[embeddedStartBrewSession] Fetch error or no brew found:",
        fetchError?.message || "Not found"
      );
      return res.status(404).json({ error: "Brew not found or unauthorized" });
    }

    console.log("[embeddedStartBrewSession] Brew fetched:", brew);

    if (brew.status === "pending") {
      console.log(
        `[embeddedStartBrewSession] Brew status is 'pending'. Updating brew id=${brew.id} status to 'started'`
      );
      const { data: updatedBrew, error: updateError } = await supabase
        .from("brews")
        .update({ status: "started" })
        .eq("id", brew.id)
        .select("*")
        .single();

      if (updateError) {
        console.error(
          "[embeddedStartBrewSession] Update error:",
          updateError.message
        );
        return res.status(500).json({ error: "Failed to update brew status" });
      }

      console.log(
        "[embeddedStartBrewSession] Brew status updated successfully:",
        updatedBrew
      );
      return res.status(200).json(updatedBrew);
    }

    if (brew.status === "started") {
      console.log(
        `[embeddedStartBrewSession] Brew status is already 'started'. Returning existing brew.`
      );
      return res.status(200).json(brew);
    }

    // If brew.status is neither pending nor started
    console.warn(
      `[embeddedStartBrewSession] Brew status is '${brew.status}', expected 'pending' or 'started'`
    );
    return res
      .status(400)
      .json({ error: "Brew is not in 'pending' or 'started' status" });
  } catch (err) {
    console.error("[embeddedStartBrewSession] Exception caught:", err.message);
    res.status(500).json({ error: "Failed to start embedded brew" });
  }
}

export async function updateStepStatus(req, res) {
  const { brew_id, secret_key, status_field, status_value, timestamp } =
    req.body;

  if (!brew_id || !secret_key || !status_field || status_value === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const supabase = getSupabaseClient();

    // Authenticate brew
    const { data: brew, error: authError } = await supabase
      .from("brews")
      .select("*")
      .eq("id", brew_id)
      .eq("secret_key", secret_key)
      .single();

    if (authError || !brew) {
      return res.status(403).json({ error: "Invalid brew_id or secret_key" });
    }

    // Build dynamic update
    const updatePayload = {
      [status_field]: status_value,
    };

    // Timestamp mapping
    const timestampMap = {
      mash_status: {
        started: "mash_start",
        ended: "mash_end",
      },
      boil_status: {
        started: "boil_start",
        ended: "boil_end",
      },
    };

    if (timestamp && timestampMap[status_field]?.[status_value]) {
      const tsField = timestampMap[status_field][status_value];
      updatePayload[tsField] = timestamp;
    }

    // DEBUG: Optional logging for troubleshooting
    console.log("[updateStepStatus] Update payload:", updatePayload);

    const { data: updatedBrew, error: updateError } = await supabase
      .from("brews")
      .update(updatePayload)
      .eq("id", brew_id)
      .select("*")
      .single();

    if (updateError) {
      console.error(
        "[updateStepStatus] Supabase update error:",
        updateError.message
      );
      return res.status(500).json({ error: "Failed to update step status" });
    }

    return res.status(200).json(updatedBrew);
  } catch (err) {
    console.error("[updateStepStatus] Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
