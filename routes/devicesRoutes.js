import express from "express";
import {
  createDevice,
  getDevicesByBrewery,
  patchDeviceStatus,
  removeDevice,
  deviceHeartbeat,
} from "../controllers/devicesController.js";

const router = express.Router();

router.post("/create", createDevice);
router.get("/by-brewery", getDevicesByBrewery);
router.patch("/:id/status", patchDeviceStatus);
router.delete("/:id", removeDevice);

router.post("/:id/heartbeat", deviceHeartbeat);

export default router;
