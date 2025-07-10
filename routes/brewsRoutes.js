import express from "express";

import {
  startBrewSession,
  getBrewsByBrewery,
  logTemperature,
  endBrewSession,
} from "../controllers/brewsController.js";

const router = express.Router();

router.get("/", getBrewsByBrewery);
router.post("/start", startBrewSession);
router.post("/temperature", logTemperature);
router.post("/end", endBrewSession);

export default router;
