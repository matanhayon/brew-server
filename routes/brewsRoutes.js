import express from "express";
import { getBrewsByBrewery } from "../controllers/brewsController.js";

const router = express.Router();

router.get("/", getBrewsByBrewery);

export default router;
