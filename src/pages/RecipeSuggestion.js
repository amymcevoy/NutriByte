import { HfInference } from "@huggingface/inference";
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from '../firebase';
import React, { useState } from "react";


const hf = new HfInference("your-huggingface-api-key"); // Use your free token

async function getRecipe(ingredients) {
  const response = await hf.textGeneration({
    model: "mistralai/Mistral-7B-Instruct",
    inputs: `I have ${ingredients.join(", ")}. Suggest a recipe.`,
  });
  return response.generated_text;
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
  
