import express from "express";

import {
  startBrewSession,
  getBrewsByBrewery,
  logTemperature,
  endBrewSession,
  getBrewById,
  getBrewTemperatureLogs,
} from "../controllers/brewsController.js";
import { connectEmbeddedBrewSession } from "../controllers/brewsController.js";

const router = express.Router();

router.get("/", getBrewsByBrewery);
router.post("/start", startBrewSession);
router.post("/temperature", logTemperature);
router.post("/end", endBrewSession);
router.get("/temperature_logs", getBrewTemperatureLogs);
router.post("/connect", connectEmbeddedBrewSession);
router.get("/:id", getBrewById);

export default router;
