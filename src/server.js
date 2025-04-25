const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
require("dotenv").config(); // To read environment variables from .env

const app = express();
const port = 5000; // Backend will run on this port

// Use CORS to allow requests from  React frontend
app.use(cors());
app.use(express.json());  // Parse incoming JSON requests

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Use your OpenAI API key
});

// POST route to handle recipe generation
app.post("/generate-recipe", async (req, res) => {
  const { ingredients } = req.body; // Get ingredients from the request body

  // Create a prompt for the AI model
  const prompt = `Create a recipe using the following ingredients: ${ingredients.join(", ")}. Format the response as follows: Title: [title], Ingredients: [ingredients], Instructions: [instructions].`;

  try {
    const response = await openai.completions.create({
      model: "gpt-4",  // You can also use gpt-3.5-turbo
      prompt: prompt,
      max_tokens: 150,
    });

    const result = response.choices[0].text;
    res.json({ recipe: result });  // Send the recipe back to the frontend
  } catch (error) {
    console.error("Error fetching recipe from OpenAI:", error);
    res.status(500).json({ error: "Failed to generate recipe." });
  }
});

// Start the backend server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
