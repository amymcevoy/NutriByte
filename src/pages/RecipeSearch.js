import { HfInference } from "@huggingface/inference";

const hf = new HfInference("your-huggingface-api-key"); // Use your free token

async function getRecipe(ingredients) {
  const response = await hf.textGeneration({
    model: "mistralai/Mistral-7B-Instruct",
    inputs: `I have ${ingredients.join(", ")}. Suggest a recipe.`,
  });
  return response.generated_text;
}

export default getRecipe;
