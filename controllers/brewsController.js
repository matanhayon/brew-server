import { fetchBrewsByBrewery } from "../services/brewsService.js";
import { startBrew } from "../services/brewsService.js";
import { logBrewTemperature } from "../services/brewsService.js";
import { endBrew } from "../services/brewsService.js";

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
  const { brew_id, brewery_id, user_id, temperature_celsius } = req.body;

  if (!brew_id || !brewery_id || !user_id || temperature_celsius == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await logBrewTemperature({
      brew_id,
      brewery_id,
      user_id,
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
