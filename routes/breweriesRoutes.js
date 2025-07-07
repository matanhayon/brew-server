import express from "express";
import {
  createBrewery,
  getAllBreweries,
  getBreweryById,
  getBreweriesByUserId,
  requestJoinBrewery,
  getPendingJoinRequests,
  approveJoinRequestById,
  deleteJoinRequestById,
} from "../controllers/breweriesController.js";

const router = express.Router();

router.get("/", getAllBreweries);

// POST /breweries - create brewery
router.post("/", createBrewery);
router.post("/join", requestJoinBrewery);

router.get("/membered/user", getBreweriesByUserId);

// Brewery Requests:
router.get("/join-requests", getPendingJoinRequests);
router.post("/join-requests/:id/approve", approveJoinRequestById);
router.delete("/join-requests/:id", deleteJoinRequestById);
router.get("/:id", getBreweryById);

export default router;
