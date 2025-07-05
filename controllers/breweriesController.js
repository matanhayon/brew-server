import {
  addBrewery,
  fetchBreweries,
  fetchBreweryById,
} from "../services/breweriesService.js";

export async function createBrewery(req, res) {
  const breweryData = req.body;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  try {
    const savedBrewery = await addBrewery(breweryData, token);
    res.status(201).json(savedBrewery);
  } catch (err) {
    console.error("Error creating brewery:", err.message);
    res.status(500).json({ error: "Failed to create brewery" });
  }
}

export async function getAllBreweries(_req, res) {
  try {
    const breweries = await fetchBreweries();
    res.json(breweries);
  } catch (err) {
    console.error("Error fetching breweries:", err.message);
    res.status(500).json({ error: "Failed to fetch breweries" });
  }
}

export async function getBreweryById(req, res) {
  const { id } = req.params;
  try {
    const brewery = await fetchBreweryById(id);
    if (!brewery) {
      return res.status(404).json({ error: "Brewery not found" });
    }
    res.json(brewery);
  } catch (err) {
    console.error("Error fetching brewery:", err.message);
    res.status(500).json({ error: "Failed to fetch brewery" });
  }
}
