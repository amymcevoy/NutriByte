import React from 'react';
import { Link } from 'react-router-dom'; // navigation between pages

function Home() {
  return (
    <div>
      <h1>Welcome to PrepPal</h1>
      <h3>Click 'Add a New meal' to start prepping!</h3>
      <Link to="/add-meal">
        <button className='homebutton'>Add a New Meal</button> 
      </Link>
      <br />
      <Link to="/meal-list">
        <button className='homebutton'>View Saved Meals</button>
      </Link>

    </div>
  );
}

export default Home;
