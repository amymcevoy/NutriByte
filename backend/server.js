const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = 4000;

const cors = require('cors');
app.use(cors());

app.use(express.json());

// connect to MongoDB using mongoose and dotenv
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

//requirements for meal model
const mealRequirements = new mongoose.Schema({
    name: String,
    ingredients: String,
    calories: Number,
    instructions: String,
    category: String
  });
  
//create a mealmodel
const Meal = mongoose.model('Meal', mealRequirements);

// create a meal
app.post('/api/meals', async (req, res) => {
    try {
      const { name, ingredients, calories, instructions,category } = req.body;

      if (!name || !ingredients || !calories || !instructions || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      const newMeal = new Meal({ name, ingredients, calories, instructions ,category});
  
      // save the new meal to the database
      await newMeal.save();
  
      // successs message
      res.status(201).json({ message: 'Meal added', meal: newMeal });
    } catch (err) {
      console.error('Error adding meal:', err);
      res.status(500).json({ error: err.message });
    }
  });

  //get meals from database
app.get('/api/meals', async (req, res) => {
    try {
      const meals = await Meal.find(); //fetch all meals
      res.status(200).json({ meals }); // return all meals
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //delete meals from database
  app.delete('/api/meals/:id', async (req, res) => {

    console.log('Deleting meal');

    try {
        const meal = await Meal.findByIdAndDelete(req.params.id);
        if (!meal) {
            return res.status(404).send('Meal not found');
        }
        res.status(200).send('Meal deleted');
    } catch (err) {
        console.error('Error deleting meal:', err);
        res.status(500).send('Error deleting');
    }
    
  });

  //edit meals in database
  app.put('/api/meals/:id', async (req,res) => {
    
    console.log('Editing meal');

    const updateData = req.body;
    try{
        const meal = await Meal.findByIdAndUpdate(req.params.id);
        if(!meal){
            return res.status(404).send('Meal not found');
        }
        res.status(200).send('Meal edited');
    } catch(err){
        console.error('Error editing meal:',err);
        res.status(500).send('Error editing');
    }

 });



//start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
