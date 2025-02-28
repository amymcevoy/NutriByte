import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from '../firebase'; // Adjust path
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
    const fetchMeals = async () => {
      const mealsCollection = collection(db, 'meals');
      const mealSnapshot = await getDocs(mealsCollection);
      const mealList = mealSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMeals(mealList);
    };
    fetchMeals();
  }, []);

    //delete a meal
    const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'meals', id)); // Delete meal from Firestore
      console.log("Meal deleted successfully");
      setMeals(meals.filter(meal => meal.id !== id)); // Remove deleted meal from local state
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
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
    const handleSave = async () => {

      try {
        const mealDoc = doc(db, 'meals', editMeal.id); // Reference to the document
        await updateDoc(mealDoc, editMeal); // Update meal in Firestore
        setMeals(meals.map(meal => (meal.id === editMeal.id ? editMeal : meal))); // Update local meals state
        setEditIndex(null); // Exit editing mode
      } catch (error) {
        console.error('Error saving meal:', error);
      }
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
                      <button className="listbuttons" onClick={() => handleEdit(meal.id)}>Edit</button> 
                      <button className="listbuttons" onClick={() => handleDelete(meal.id)}>Delete</button> 
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
