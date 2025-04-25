import React, { useState } from "react";  // ✅ Import useState
import { HfInference } from "@huggingface/inference";

// Load API key
const apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY;
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct";
const hf = new HfInference(apiKey);

async function getRecipe(ingredients) {

    console.log("Using API Key:", process.env.REACT_APP_HUGGINGFACE_API_KEY);

 try {
    const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `I have the following ingredients: ${ingredients.join(", ")}. Give me a step-by-step recipe using only these ingredients.`,
        parameters: { max_new_tokens: 150 } // Limit response length
      })
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (data && data[0] && data[0].generated_text) {
      return data[0].generated_text;
    } else {
      return "No valid recipe found. Try different ingredients!";
    }
  } catch (error) {
    console.error("Error fetching AI recipe:", error);
    return "Failed to fetch recipe. Please try again.";
  }
}

function RecipeSuggestion() {
  const [recipe, setRecipe] = useState(""); 
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredientList = ingredients.split(",").map((ing) => ing.trim());
    const result = await getRecipe(ingredientList);
    setRecipe(result);
  };

  return (
    <div>
      <h2>AI Recipe Generator</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button type="submit">Get Recipes</button>
      </form>
      {recipe && <p>{recipe}</p>}
    </div>

    
  );
}

export default RecipeSuggestion;
