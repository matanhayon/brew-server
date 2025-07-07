import {
  addRecipe,
  fetchAllRecipes,
  fetchRecipeById,
  fetchRecipesByBreweryMembers,
} from "../services/recipesService.js";

export async function getAllRecipes(req, res) {
  try {
    const recipes = await fetchAllRecipes();
    res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}

export async function getRecipeById(req, res) {
  const { id } = req.params;
  try {
    const recipe = await fetchRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err.message);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
}

export async function createRecipe(req, res) {
  const newRecipe = req.body;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  try {
    const savedRecipe = await addRecipe(newRecipe, token);
    res.status(201).json(savedRecipe);
  } catch (err) {
    console.error("Error adding recipe:", err.message);
    res.status(500).json({ error: "Failed to add recipe" });
  }
}

export async function getRecipesByBreweryMembers(req, res) {
  const { brewery_id } = req.query;

  if (!brewery_id) {
    return res.status(400).json({ error: "Missing brewery_id" });
  }

  try {
    const recipes = await fetchRecipesByBreweryMembers(brewery_id);
    res.json(recipes);
  } catch (err) {
    console.error("Error fetching brewery members' recipes:", err.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
