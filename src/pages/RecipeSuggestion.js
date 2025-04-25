import React, { useState } from "react"; 
import { HfInference } from "@huggingface/inference";

// Set up Hugging Face API Key
const apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY; // Make sure your Hugging Face API key is in your .env

const hf = new HfInference(apiKey);

async function getRecipe(ingredients) {
  const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `You are a professional chef AI. Using only these ingredients: ${ingredients.join(", ")}, write a realistic recipe with the following format:\n\nTitle: [title]\nIngredients: [ingredients]\nInstructions: [instructions]`,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || data[0]?.text || "Failed to generate recipe.";
  } catch (error) {
    console.error("Error fetching recipe from Hugging Face:", error);
    return "Failed to generate recipe.";
  }
}

function RecipeSuggestion() {
  const [recipe, setRecipe] = useState("");
  const [ingredients, setIngredients] = useState("");

  const [title, setTitle] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [instructionsList, setInstructionsList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredientList = ingredients.split(",").map((ing) => ing.trim());
    const result = await getRecipe(ingredientList);
    setRecipe(result);

    // Parsing the recipe text into title, ingredients, and instructions
    const lines = result.split("\n").map(line => line.trim()).filter(Boolean);
    let parsedTitle = null;
    let inIngredients = false;
    let inInstructions = false;

    const parsedIngredients = [];
    const parsedInstructions = [];

    lines.forEach((line) => {
      const lower = line.toLowerCase();

      if (/^title[:\-]/i.test(line) && !parsedTitle) {
        parsedTitle = line.replace(/^title[:\-]/i, "").trim();
      } else if (!parsedTitle && !lower.includes("ingredients") && !lower.includes("instructions")) {
        parsedTitle = line;
      } else if (line.match(/^ingredients[:\-]?$/i)) {
        inIngredients = true;
        inInstructions = false;
      } else if (line.match(/^instructions[:\-]?$/i)) {
        inIngredients = false;
        inInstructions = true;
      } else if (inIngredients && line && !line.match(/^instructions[:\-]?$/i)) {
        parsedIngredients.push(line);
      } else if (inInstructions && /^\d+\./.test(line)) {
        parsedInstructions.push(line);
      }
    });

    setTitle(parsedTitle);
    setIngredientsList(parsedIngredients);
    setInstructionsList(parsedInstructions);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-[#D1E8E2] text-[#4A4A4A]">
      <h1 className="logo mb-2">Nutri-Byte 🍳</h1>
      <p className="slogan">AI-powered recipes from whatever’s in your fridge</p>

      <div className="form-container mt-4">
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder="Enter ingredients (comma-separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}  // Update ingredients state as user types
            className="mb-4"
          />
          <button type="submit">Get Recipe</button>
        </form>
      </div>

      {recipe && (
        <div className="form-container mt-6 text-left">
          <h3 className="text-xl font-bold text-green-800 mb-2">Suggested Recipe</h3>

          <div className="mt-4 text-left">

            {ingredientsList.length > 0 && (
              <>
                <h4 className="mt-4 font-semibold text-green-700 text-lg mb-2">🥬 Ingredients</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {ingredientsList.map((item, idx) => (
                    <li key={`ingredient-${idx}`}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {instructionsList.length > 0 && (
              <>
                <h4 className="mt-4 font-semibold text-green-700 text-lg mb-2">👨‍🍳 Instructions</h4>
                <ol className="pl-6 space-y-3 border-l-4 border-pink-300">
                  {instructionsList.map((step, idx) => (
                    <li key={`step-${idx}`} className="text-gray-800 text-base leading-relaxed">
                      {step.replace(/^\d+\.*\s*/, "")}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeSuggestion;
