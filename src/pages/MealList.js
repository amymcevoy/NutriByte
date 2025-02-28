import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Link } from 'react-router-dom';

function MealList() {
  const [meals, setMeals] = useState([]);
  const [editIndex, setEditIndex] = useState(null); 
  const [editMeal, setEditMeal] = useState({});
  const [filterCategory, setFilterCategory] = useState("");
  const totalCalories = meals.reduce((total, meal) => total + (meal.calories || 0), 0);


  const navigate = useNavigate();

  useEffect(() => {
    //fetch meals from backend
    axios.get('http://localhost:4000/api/meals')
    .then(response => {
      setMeals(response.data.meals); //set meals from the backend
    })
    .catch(error => {
      console.error('Error fetching meals:', error);
    });
}, []);
    
    //delete a meal
    const handleDelete = (index) => {
        const mealToDelete = meals[index];
        console.log(`Deleting meal with ID: ${mealToDelete._id}`);//check if deletion is working

        axios.delete(`http://localhost:4000/api/meals/${mealToDelete._id}`)
          .then(() => {
            const updatedMeals = meals.filter((_, i) => i !== index); //remove deleted mea
            setMeals(updatedMeals); //update
          })
          .catch(error => {
            console.error('Error deleting meal:', error);
          });
    };

    //edit a meal
    const handleEdit = (index) => {
        setEditIndex(index);
        setEditMeal({ ...meals[index] }); 
    };

    //change meal after edited
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditMeal((prevMeal) => ({
        ...prevMeal,
        [name]: value,
     }));
    };
   
    //save meal after changed
    const handleSave = () => {
        const originalMeals = [...meals]; 
        const updatedMeals = [...meals];
        updatedMeals[editIndex] = editMeal; //update edited meal in array

            //update meal in backend
            axios.put(`http://localhost:4000/api/meals/${editMeal._id}`, editMeal)
                .then(response => {
                    setMeals(updatedMeals); //update meals
                    setEditIndex(null); //exit editing
            })
            .catch(error => {
                console.error('Error saving meal:', error);
                setMeals(originalMeals); // go back to normal if failed
        });
    };

    // Back button function
    const handleBack = () => {
    navigate(-1);  // Navigate back to the previous page
    };

    return (
        <div className="edit-form-container">
          <h1>Saved Meals</h1>
          <button className="back-btn" onClick={handleBack}>Back</button>

          <div className="calorie-counter">
          <h2>Total Calories: {totalCalories}</h2>
          {totalCalories > 2000 && (
            <p style={{ color: 'red' }}>Warning: You've exceeded your daily calorie limit!</p>
          )}
          </div>

                <Link to="/add-meal">
                  <button className='addbutton'>Add a New Meal</button> 
                </Link>

          {meals.length === 0 ? (
            <p>No meals added yet. Please add a meal.</p>
          ) : (
            <ul>
              {meals.map((meal, index) => (
                <li key={index}>
                  {editIndex === index ? (
                    <div>
                      {/* Editable fields */}
                      <label>Category</label>
                       <select
                        name="category"
                        value={editMeal.category || ""}
                        onChange={handleChange}
                        required
                      >
                        <label>Name</label>
                        <option value="" disabled>Select Category</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snack">Snack</option>
                      </select>

                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editMeal.name}
                        onChange={handleChange}
                        required
                      />
                      <label>Ingredients</label>
                      <input
                        type="text"
                        name="ingredients"
                        value={editMeal.ingredients}
                        onChange={handleChange}
                        required
                      />
                      <label>Calories</label>
                      <input
                        type="number"
                        name="calories"
                        value={editMeal.calories}
                        onChange={handleChange}
                        required
                      />
                      <label>Instructions</label>
                      <textarea
                        name="instructions"
                        value={editMeal.instructions}
                        onChange={handleChange}
                        required
                      />
                      
                      <button className="listbuttons" onClick={handleSave}>Save</button> {/* Save button */}
                    </div>
                  ) : (
                    <div>
                      {/* Display meal info */}
                      <p>Category: {meal.category}</p>
                      <p>Name: {meal.name}</p>
                      <p>Ingredients: {meal.ingredients}</p>
                      <p>Calories: {meal.calories}</p>
                      <p>Instructions: {meal.instructions}</p>
                      <button className="listbuttons" onClick={() => handleEdit(index)}>Edit</button> 
                      <button className="listbuttons" onClick={() => handleDelete(index)}>Delete</button> 
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          
        </div>
      );
    }
    
export default MealList;
