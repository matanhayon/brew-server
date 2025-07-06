import express from "express";
import {
  createBrewery,
  getAllBreweries,
  getBreweryById,
  getBreweriesByUserId,
  requestJoinBrewery,
} from "../controllers/breweriesController.js";

const router = express.Router();

router.get("/", getAllBreweries);
router.get("/:id", getBreweryById);

// POST /breweries - create brewery
router.post("/", createBrewery);
router.post("/join", requestJoinBrewery);

router.get("/membered/user", getBreweriesByUserId);
export default router;
