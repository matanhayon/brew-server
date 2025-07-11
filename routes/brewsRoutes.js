import express from "express";

import {
  startBrewSession,
  getBrewsByBrewery,
  logTemperature,
  endBrewSession,
  getBrewById,
  getBrewTemperatureLogs,
  embeddedStartBrewSession,
  updateStepStatus,
} from "../controllers/brewsController.js";
import { connectEmbeddedBrewSession } from "../controllers/brewsController.js";

const router = express.Router();

router.get("/", getBrewsByBrewery);
router.post("/start", startBrewSession);
router.post("/temperature", logTemperature);
router.post("/end", endBrewSession);
router.get("/temperature_logs", getBrewTemperatureLogs);
router.post("/connect", connectEmbeddedBrewSession);
router.get("/watch/:id", getBrewById);
router.post("/embedded_start", embeddedStartBrewSession);
router.post("/update_step_status", updateStepStatus);

export default router;
