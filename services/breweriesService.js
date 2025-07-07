import { getSupabaseClient } from "./supabaseClient.js";
import { getUserDetails } from "./getUserDetails.js";

export async function addBrewery(breweryData, token) {
  const supabase = getSupabaseClient(token);

  // Step 1: Insert new brewery
  const { data: brewery, error: breweryError } = await supabase
    .from("breweries")
    .insert(breweryData)
    .select()
    .single();

  if (breweryError) throw breweryError;

  // Step 2: Insert into brewery_members with role 'admin'
  console.log(brewery.id);
  const { error: memberError } = await supabase.from("brewery_members").insert({
    brewery_id: brewery.id,
    role: "admin",
  });

  if (memberError) throw memberError;

  return brewery;
}

export async function fetchBreweries() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("breweries").select("*");

  if (error) throw error;
  return data;
}

export async function fetchBreweryById(id) {
  const supabase = getSupabaseClient();

  // Select brewery with filtered brewery_members (role in ["admin","brewer"] and status = "approved")
  const { data, error } = await supabase
    .from("breweries")
    .select(
      `
      *,
      brewery_members (
        id,
        user_id,
        role,
        status,
        joined_at
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  // Filter members locally to only those with role admin or brewer and status approved
  const filteredMembers = data.brewery_members.filter(
    (member) =>
      (member.role === "admin" || member.role === "brewer") &&
      member.status === "approved"
  );

  // Enrich each filtered member with Clerk user info
  const brewery_members = await Promise.all(
    filteredMembers.map(async (member) => {
      const user = await getUserDetails(member.user_id);
      return {
        ...member,
        user_name: user.name,
        user_email: user.email,
        user_image: user.imageUrl,
      };
    })
  );

  return {
    ...data,
    brewery_members,
  };
}

export async function fetchBreweriesByUserId(user_id) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("brewery_members")
    .select("brewery_id, breweries(name), role, status")
    .eq("user_id", user_id)
    .in("status", ["approved", "pending"]);

  if (error) throw error;

  return data.map((item) => ({
    id: item.brewery_id,
    name: item.breweries.name,
    role: item.role,
    status: item.status,
  }));
}

export async function insertJoinRequest(
  { brewery_id, message, status = "pending" },
  token
) {
  const supabase = getSupabaseClient(token);

  // Insert into brewery_members without sending user_id explicitly
  const { data, error } = await supabase
    .from("brewery_members")
    .insert({
      brewery_id,
      role: "viewer",
      status,
      request_message: message,
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting join request:", error);
    throw error;
  }

  return data;
}

export async function fetchPendingJoinRequests(brewery_id) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("brewery_members")
    .select("id, user_id, role, status, request_message, joined_at")
    .eq("brewery_id", brewery_id)
    .eq("status", "pending");

  if (error) throw error;

  // Optionally enrich with user details
  const enriched = await Promise.all(
    data.map(async (member) => {
      const user = await getUserDetails(member.user_id);
      return {
        ...member,
        user_name: user.name,
        user_email: user.email,
        user_image: user.imageUrl,
      };
    })
  );

  return enriched;
}

export async function approveJoinRequest(requestId) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("brewery_members")
    .update({ status: "approved", role: "brewer" })
    .eq("id", requestId);
  console.log(data);
  if (error) throw error;
}

export async function deleteJoinRequest(requestId) {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("brewery_members")
    .delete()
    .eq("id", requestId);

  if (error) throw error;
}
