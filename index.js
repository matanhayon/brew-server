import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getAllRecipes, getRecipeById } from "./db/recipes.js";
import { createClient } from "@supabase/supabase-js";
import { loggerMiddleware } from "./middlewares/logger.js";

// Load environment variables
dotenv.config();

// Optional debug log — remove in production
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY?.slice(0, 5) + "..."); // Avoid printing full key

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Utility to create Supabase client with optional Bearer token
function getSupabaseClient(token) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error(
      "Missing Supabase configuration (SUPABASE_URL or SUPABASE_KEY)"
    );
  }

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: {
      fetch: async (url, options = {}) => {
        const headers = new Headers(options?.headers);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return fetch(url, { ...options, headers });
      },
    },
  });
}

// Routes
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

app.post("/recipes", async (req, res) => {
  const newRecipe = req.body;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  const supabase = getSupabaseClient(token);

  try {
    const { data, error } = await supabase
      .from("recipes")
      .insert(newRecipe)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("Error adding recipe:", err.message);
    res.status(500).json({ error: "Failed to add recipe" });
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
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
