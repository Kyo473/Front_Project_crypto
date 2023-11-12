import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <p>This is the starting point of your application.</p>
      <Link to="/register">
        <button>Go to Registration</button>
      </Link>
    </div>
  );
};

export default Home;
