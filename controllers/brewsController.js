import { fetchBrewsByBrewery } from "../services/brewsService.js";

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
