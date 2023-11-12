import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div>
      <h2>Main Page</h2>
      <p>This is the main page of your application.</p>
      <Link to="/deal">
        <button>Go to Deals</button>
      </Link>
    </div>
  );
};

export default MainPage;
