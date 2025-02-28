import React from 'react';
import { Link } from 'react-router-dom'; // navigation between pages

function Home() {
  return (
      <div style={{ textAlign: 'center' }}>
      <h1 className="logo">Nutri-Byte 🥗</h1>
      <h2 className="slogan">Fuel your week, one prep at a time</h2>
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
