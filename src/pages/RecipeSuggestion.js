import React, { useState , useEffect} from "react"; 

function RecipeSuggestion() {
  const [recipe, setRecipe] = useState("");
  const [ingredients, setIngredients] = useState("");

  const [title, setTitle] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [instructionsList, setInstructionsList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredientList = ingredients.split(",").map((ing) => ing.trim());
    const response = await fetch("http://localhost:5000/generate-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  
      },
      body: JSON.stringify({ ingredients: ingredientList }),
    });

    const data = await response.json(); 
        
    setRecipe(data.recipe);
    
      const lines = recipe.split("\n").map(line => line.trim()).filter(Boolean);
                  
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
          }
        }, [recipe]);

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
                {title && (
                  <h3 className="text-lg font-bold text-green-800 mb-2">{title}</h3>
                )}

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
                      <li
                      key={`step-${idx}`}
                      className="text-gray-800 text-base leading-relaxed">
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