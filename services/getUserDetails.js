// getUserDetails.js
import { createClerkClient } from "@clerk/backend";
/**
 * Fetch a user's details from Clerk by user_id.
 * @param {string} userId - Clerk user ID.
 * @returns {Promise<{ id: string, name: string, email?: string, imageUrl?: string }>}
 */
export async function getUserDetails(userId) {
  try {
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const user = await clerkClient.users.getUser(userId);
    return {
      id: user.id,
      name:
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
        user.username ||
        "Unknown",
      email: user.emailAddresses?.[0]?.emailAddress ?? null,
      imageUrl: user.imageUrl ?? null,
    };
  } catch (err) {
    console.error(`Failed to fetch user ${userId} from Clerk:`, err);
    return {
      id: userId,
      name: "Unknown",
    };
  }
}
