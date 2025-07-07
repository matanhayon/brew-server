import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  getRecipesByBreweryMembers,
} from "../controllers/recipesController.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/by-brewery-members", getRecipesByBreweryMembers);
router.post("/", createRecipe);
router.get("/:id", getRecipeById);

export default router;
