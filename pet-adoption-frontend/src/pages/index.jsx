import React from 'react';
import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div>
      <h1>Welcome to the Pet Adoption App</h1>
      <Link to="/home">Go to Home Page</Link>
    </div>
  );
}