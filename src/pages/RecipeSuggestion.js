import React, { useState } from "react";  // Import useState
import { HfInference } from "@huggingface/inference";

// Load API key
const apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY;
const hf = new HfInference(apiKey);

async function getRecipe(ingredients) {
  const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

  console.log("Loaded HuggingFace API Key:", process.env.REACT_APP_HUGGINGFACE_API_KEY);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `
            You are a professional chef AI. Using only these ingredients: ${ingredients.join(", ")},
            write a realistic recipe with the following format:

            Title:
            Ingredients:
            Instructions:
            1. 
            2. 
          `
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (data && data[0]) {
      console.log("Returned text:", data[0].generated_text || data[0].text || JSON.stringify(data[0]));
      return data[0].generated_text || data[0].text || JSON.stringify(data[0]);
    }
  } catch (error) {
    console.error("Error fetching AI recipe:", error);
    return "Failed to fetch recipe. Please try again.";
  }
}

function RecipeSuggestion() {
  const [recipe, setRecipe] = useState("");  //  useState is now defined
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredientList = ingredients.split(",").map((ing) => ing.trim());
    const result = await getRecipe(ingredientList);
    setRecipe(result);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-[#D1E8E2] text-[#4A4A4A]">
      <h1 className="logo mb-2">Nutri-Byte 🍳</h1>
      <p className="slogan">AI-powered recipes from whatever’s in your fridge</p>

      <div className="form-container mt-4">
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder="Enter ingredients (comma-seperated))"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="mb-4"
          />
          <button type="submit">Get Recipes</button>
        </form>
      </div>

      {recipe && (
        <div className="form-container mt-6 text-left">
          <h3 className="text-xl font-bold text-green-800 mb-2">Suggested Recipe</h3>
          {(() => {
        const lines = recipe.split("\n").map(line => line.trim()).filter(Boolean);
            
            let title = null;
            const ingredients = [];
            const instructions = [];
            let inIngredients = false;
            let inInstructions = false;

            lines.forEach((line, index) => {
              const lower = line.toLowerCase();

              if (/^title[:\-]/i.test(line) && !title) {
                title = line.replace(/^title[:\-]/i, "").trim();
              } else if (!title && index === 0 && !lower.includes("ingredients") && !lower.includes("instructions")) {
                title = line;
              } else if (line.match(/^ingredients[:\-]?$/i)) {
                inIngredients = true;
                inInstructions = false;
              } else if (line.match(/^instructions[:\-]?$/i)) {
                inIngredients = false;
                inInstructions = true;
              } else if (inIngredients && line && !line.match(/^instructions[:\-]?$/i)) {
                ingredients.push(line);
              } else if (inInstructions && /^\d+\./.test(line)) {
                instructions.push(line);
              }
            });

            return (
              <div className="mt-4 text-left">
                {title && (
                  <h3 className="text-lg font-bold text-green-800 mb-2">{title}</h3>
                )}

{ingredients.length > 0 && (
                  <>
                    <h4 className="mt-4 font-semibold text-green-700 text-lg mb-2">🥬 Ingredients</h4>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      {ingredients.map((item, idx) => (
                        <li key={`ingredient-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}

{instructions.length > 0 && (
  <>
    <h4 className="mt-4 font-semibold text-green-700 text-lg mb-2">👨‍🍳 Instructions</h4>
    <ol className="pl-6 space-y-3 border-l-4 border-pink-300">
      {instructions.map((step, idx) => (
        <li
        key={`step-${idx}`}
        className="text-gray-800 text-base leading-relaxed"
      >
        {step.replace(/^\d+\.*\s*/, "")}
      </li>
      
      ))}
    </ol>
  </>
)}


              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default RecipeSuggestion;