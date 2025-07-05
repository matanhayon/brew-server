import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
} from "../controllers/recipesController.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.post("/", createRecipe);
router.get("/:id", getRecipeById);

export default router;
