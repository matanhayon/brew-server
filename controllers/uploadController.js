import { v4 as uuidv4 } from "uuid";
import { getSupabaseClient } from "../services/supabaseClient.js";

const BUCKET_NAME = "brewery-images";

export async function uploadBreweryPhoto(req, res) {
  const file = req.file;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  const userId = req.body.user_id;
  console.log("user ID: " + userId);

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!userId) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  try {
    const supabase = getSupabaseClient(token);

    const fileExt = file.originalname.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${uniqueFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file.buffer);

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return res.status(500).json({ error: "Failed to upload file" });
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return res.status(200).json({ publicUrl: data.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
