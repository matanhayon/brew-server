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

  const { data, error } = await supabase
    .from("breweries")
    .select(
      `
      *,
      brewery_members (
        id,
        user_id,
        role,
        joined_at
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  // Enrich each member with their Clerk user info
  const brewery_members = await Promise.all(
    data.brewery_members.map(async (member) => {
      const user = await getUserDetails(member.user_id);
      return {
        ...member,
        user_name: user.name,
        user_email: user.email,
        user_image: user.imageUrl,
      };
    })
  );

  console.log({
    ...data,
    brewery_members,
  });
  return {
    ...data,
    brewery_members,
  };
}
