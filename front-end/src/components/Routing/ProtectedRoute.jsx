// src/components/Routing/ProtectedRoute.js
// *** CORRECTED to use Outlet for v6 wrapper routes ***

import React from 'react';
// Import Outlet and Navigate from react-router-dom
import { Navigate, Outlet } from 'react-router-dom';
// Optional: import useLocation if you want to redirect back after login
// import { useLocation } from 'react-router-dom';

const ProtectedRoute = () => { // No need for children prop here
  // 1. Check if the authentication token exists in local storage
  // Ensure 'authToken' is the EXACT key used in Login.jsx
  const token = localStorage.getItem('authToken');

  // Optional: Get current location to redirect back after login
  // const location = useLocation();

  if (!token) {
    // 2. If no token, redirect the user to the login page
    console.log('ProtectedRoute: No token found, redirecting to /login');
    // Pass the original location in state if desired
    // return <Navigate to="/login" replace state={{ from: location }} />;
    return <Navigate to="/login" replace />;
  }

  // 3. If token exists, render the child route's element via <Outlet />
  console.log('ProtectedRoute: Token found, rendering child route via <Outlet />.');
  return <Outlet />; // Renders the matched nested route component (e.g., <Dashboard />)
};

export default ProtectedRoute;