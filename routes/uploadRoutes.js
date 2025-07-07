import express from "express";
import multer from "multer";
import {
  uploadBreweryPhoto,
  uploadRecipePhoto,
} from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer(); // Use memory storage by default

// Route: POST /upload/brewery-photo
router.post("/brewery-photo", upload.single("file"), uploadBreweryPhoto);

router.post("/recipe-photo", upload.single("file"), uploadRecipePhoto);

export default router;
