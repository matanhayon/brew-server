import { createClient } from "@supabase/supabase-js";

const supabase = createClient();

import beerRecipes from "./beerRecipes.json"; // or paste directly as array

async function uploadBeerRecipes() {
  const { data, error } = await supabase.from("beer_recipes").insert(
    beerRecipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      style: recipe.style,
      description: recipe.description,
      created_by: recipe.createdBy,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      target_abv: recipe.targetABV,
      target_ibu: recipe.targetIBU,
      target_srm: String(recipe.targetSRM),
      original_gravity: recipe.originalGravity,
      final_gravity: recipe.finalGravity,
      batch_size: recipe.batchSize,
      boil_time_min: recipe.boilTimeMin,
      mash_temp_c: recipe.mashTempC,
      mash_time_min: recipe.mashTimeMin,
      image_url: recipe.imageUrl,
      notes: recipe.notes,
      brewed_count: recipe.brewedCount,
    }))
  );

  if (error) {
    console.error("Error inserting beer recipes:", error);
  } else {
    console.log("Successfully inserted beer recipes:", data);
  }
}

uploadBeerRecipes();
