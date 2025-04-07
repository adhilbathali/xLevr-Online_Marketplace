// src/components/Auth/Login.js
// *** MODIFIED FOR GENERIC LOGIN & ROLE-BASED REDIRECT ***

import React, { useState } from 'react';
import axios from 'axios'; // Using Axios
import { useNavigate } from 'react-router-dom'; // For redirection
import styles from './Login.module.css'; // Assuming this path is correct

function Login() {
  // --- State ---
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // --- Configuration ---
  // Use the correct GENERIC login endpoint
  // Ensure PORT matches your backend server (e.g., 5000 or 5001)
  const API_BASE_URL = 'http://localhost:5000'; // <-- ADJUST PORT IF NEEDED
  const API_LOGIN_URL = `${API_BASE_URL}/api/auth/login`; // <-- CORRECTED ENDPOINT

  // Destructure for easier access
  const { email, password } = formData;

  // --- Event Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // Prepare request data for Axios (no need to stringify)
      const loginCredentials = { email, password };

      // Make API call using Axios to the generic login endpoint
      console.log(`Attempting login to: ${API_LOGIN_URL}`);
      const response = await axios.post(API_LOGIN_URL, loginCredentials, {
          headers: { 'Content-Type': 'application/json' } // Good practice, though Axios often sets it
      });

      console.log('Login successful:', response.data);

      // --- Handle Successful Login ---
      // 1. Check if response contains necessary data
      if (!response.data || !response.data.token || !response.data.user || !response.data.user.role) {
        console.error("Login response missing token, user data, or role:", response.data);
        setError("Login failed: Invalid response data from server.");
        setLoading(false);
        return; // Stop execution
      }

      // 2. Store the token and user info
      localStorage.setItem('authToken', response.data.token); // Use consistent key
      localStorage.setItem('authUser', JSON.stringify(response.data.user)); // Store user object

      // 3. Perform Role-Based Navigation
      const userRole = response.data.user.role;
      if (userRole === 'student') {
        console.log("Navigating to Student Dashboard...");
        navigate('/student-dashboard'); // Redirect student
      } else if (userRole === 'professional') {
        console.log("Navigating to Professional Dashboard...");
        navigate('/professional/dashboard'); // Redirect professional
      } else {
        console.warn(`Unknown user role received: ${userRole}. Navigating to home.`);
        navigate('/'); // Fallback redirect
      }

      // setLoading(false) is not needed here because navigation will unmount the component

    } catch (err) {
      // Handle errors using Axios error structure
      console.error('Login error object:', err);
      let errorMessage = 'Login failed. Please check your credentials or connection.'; // Improved default

      if (err.response) {
        // The request was made and the server responded with a status code outside 2xx
        console.error("Backend error data:", err.response.data);
        console.error("Backend error status:", err.response.status);
        // Use backend message if available, otherwise provide status info
        errorMessage = err.response.data?.message || `Login failed (Status: ${err.response.status}). Please check credentials.`;
      } else if (err.request) {
        // The request was made but no response was received (network error)
        console.error('Login network error (no response):', err.request);
        errorMessage = 'Network error: Cannot reach server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Login error (request setup):', err.message);
        errorMessage = 'An error occurred while sending the login request.';
      }
      setError(errorMessage);
      setLoading(false); // Set loading false ONLY on error
    }
    // Removed finally block as setLoading(false) is handled within success/error paths appropriately
  };

  // --- JSX ---
  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        {/* Changed title to be more generic */}
        <h2>Login</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            disabled={loading} // Disable while loading
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            disabled={loading} // Disable while loading
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>

        {/* Optional Links */}
        {/* <p className={styles.linkText}>
             Don't have an account? <Link to="/signup-options">Sign Up</Link> {/* Link to a page offering signup options */}
        {/* </p> */}

      </form>
    </div>
  );
}

export default Login;