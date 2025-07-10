import express from "express";
import {
  createDevice,
  getDevicesByBrewery,
  patchDeviceStatus,
  removeDevice,
} from "../controllers/devicesController.js";

const router = express.Router();

router.post("/create", createDevice);
router.get("/by-brewery", getDevicesByBrewery);
router.patch("/:id/status", patchDeviceStatus);
router.delete("/:id", removeDevice);

export default router;
