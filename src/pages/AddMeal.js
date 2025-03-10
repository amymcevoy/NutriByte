import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from '../firebase'; // Adjust path

function AddMeal() {

  // for form inputs
  const [meal, setMeal] = useState({
    name: '',
    ingredients: '',
    calories: '',
    instructions: '',

  });

  const [submitted, setSubmitted] = useState(false); //track if meal is submitted or not
  const navigate = useNavigate();

  // deal with changes to form 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeal((prevMeal) => ({
      ...prevMeal,
      [name]: value,
    }));
  };

  // form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

      // form validation
      if (!meal.name || !meal.ingredients || !meal.calories || !meal.instructions) {
        alert('Please fill in all fields');
        return; // Stop if fields are empty
      }

      if (meal.calories <= 0) {
        alert('Calories must be a positive number');
        return; 
      }

      try {
           // Debugging: log submission to Firestore
          console.log("Submitting meal to Firestore:", meal);

        // Send data to Firebase Firestore
        await addDoc(collection(db, 'meals'), {
          name: meal.name,
          ingredients: meal.ingredients,
          calories: meal.calories,
          instructions: meal.instructions,
          category: meal.category
        });
  
        // Reset form after successful submission
        setMeal({
          name: '',
          ingredients: '',
          calories: '',
          instructions: '',
          category: ''
        });
  
        setSubmitted(true); // Show success message
      } catch (error) {
        console.error('Error adding meal:', error);
      }
    };
  
  const handleBack = () => {
    navigate(-1); //brings you back a page
  };

  return (
    <div className="form-container">
      {/* Form to add new meal */}
      <h1>Add a New Meal</h1>
      <button className="back-btn" onClick={handleBack}>Back</button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category</label>
          <select
          name="category"
          value={meal.category || ""}
          onChange={handleChange}
          required
          >
            <option value="" disabled>Select Category</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
          <label>Name</label>
          <input
            placeholder="eg. Pizza"
            type="text"
            name="name"
            value={meal.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ingredients</label>
          <input
            placeholder="eg. Cheese,Dough,Sauce"
            type="text"
            name="ingredients"
            value={meal.ingredients}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Calories</label>
          <input
            placeholder="eg. 456"
            type="number"
            name="calories"
            value={meal.calories}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Instructions</label>
          <textarea
            placeholder="eg. Roll out dough,spread sauce..etc"
            name="instructions"
            value={meal.instructions}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit Meal</button>

        <Link to="/meal-list">
          <button>Meal List</button> 
        </Link>

      </form>

      {submitted && (
        <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
          Meal added successfully!
        </p>
      
      )}
    </div>
  );
}

export default AddMeal;
