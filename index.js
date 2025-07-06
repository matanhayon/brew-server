import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import recipeRoutes from "./routes/recipesRoutes.js";
import { loggerMiddleware } from "./middlewares/logger.js";
import breweriesRoutes from "./routes/breweriesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.get("/", (_req, res) => {
  res.send("Hello from JavaScript server!");
});

app.use("/recipes", recipeRoutes);
app.use("/breweries", breweriesRoutes);
app.use("/upload", uploadRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Add this line after other route uses
