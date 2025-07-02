import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getAllRecipes, getRecipeById } from "./db/recipes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // <--- Add this
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello from JavaScript server!");
});

app.get("/recipes", async (_req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

app.get("/recipes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await getRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe by ID:", err.message);
    if (err.code === "PGRST116") {
      // Optional: Supabase specific error for not found (may not always apply)
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
