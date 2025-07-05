import express from "express";
import {
  createBrewery,
  getAllBreweries,
  getBreweryById,
} from "../controllers/breweriesController.js";

const router = express.Router();

router.get("/", getAllBreweries);
router.get("/:id", getBreweryById);

// POST /breweries - create brewery
router.post("/", createBrewery);

export default router;
