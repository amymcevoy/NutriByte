import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router

//components
import Home from './pages/Home'; // Import Home Page
import AddMeal from './pages/AddMeal'; // Import AddMeal Page
import MealList from './pages/MealList'; 
import RecipeSuggestion from "./pages/RecipeSuggestion"; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/add-meal" element={<AddMeal />} /> 
        <Route path="/meal-list" element={<MealList />} />
        <Route path="/recipe-suggest" element={<RecipeSuggestion/>}/>
      </Routes>
    </Router>
  );
}

export default App;
