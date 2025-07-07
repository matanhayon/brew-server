import express from "express";
import {
  createBrewery,
  getAllBreweries,
  getBreweryById,
  getAllBreweriesByUserId,
  requestJoinBrewery,
  getPendingJoinRequests,
  approveJoinRequestById,
  deleteJoinRequestById,
  updateMemberRole,
  deleteMember,
  getApprovedBreweriesByUserId,
  getPendingBreweriesByUserId,
} from "../controllers/breweriesController.js";

const router = express.Router();

router.get("/", getAllBreweries);

// POST /breweries - create brewery
router.post("/", createBrewery);
router.post("/join", requestJoinBrewery);

router.get("/membered/user", getAllBreweriesByUserId);
router.get("/membered/user/approved", getApprovedBreweriesByUserId);
router.get("/membered/user/pending", getPendingBreweriesByUserId);

router.patch("/members/:id/role", updateMemberRole);
router.delete("/members/:id", deleteMember);

// Brewery Requests:
router.get("/join-requests", getPendingJoinRequests);
router.post("/join-requests/:id/approve", approveJoinRequestById);
router.delete("/join-requests/:id", deleteJoinRequestById);
router.get("/:id", getBreweryById);

export default router;
