// src/components/Routing/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 1. Check if the authentication token exists in local storage
  const token = localStorage.getItem('authToken');

  // 2. Get the current location (optional, but can be useful for redirecting back after login)
  // import { useLocation } from 'react-router-dom';
  // const location = useLocation();

  if (!token) {
    // 3. If no token, redirect the user to the login page
    //    'replace' prevents adding the redirected route to the history stack
    //    'state' can optionally pass the original location to redirect back after login
    console.log('ProtectedRoute: No token found, redirecting to /login'); // For debugging
    return <Navigate to="/login" replace /* state={{ from: location }} */ />;
  }

  // 4. If token exists, render the child component (the actual protected page)
  console.log('ProtectedRoute: Token found, rendering requested component.'); // For debugging
  return children;
};

export default ProtectedRoute;