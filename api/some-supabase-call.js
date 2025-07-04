// backend/api/some-supabase-call.js
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { ClerkExpressRequireAuth, getAuth } from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Clerk middleware protects the route
router.post(
  "/api/some-supabase-call",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const { userId, getToken } = getAuth(req);
      const token = await getToken({ template: "supabase" });

      // Create Supabase client with Clerk JWT
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      );

      // Now you can query with RLS enabled
      const { data, error } = await supabase
        .from("user_recipes")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
