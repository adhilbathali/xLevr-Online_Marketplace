// src/components/Auth/Login.js
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import styles from './Login.module.css'; // Assuming this path is correct

function Login() {
  // --- State ---
  // Use email instead of username
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Hook for navigation

  // --- Configuration ---
  // TODO: Move to config or environment variable
  // Use the correct student login endpoint
  const API_LOGIN_URL = 'http://localhost:5000/api/auth/login/student';

  // Destructure for easier access in the form
  const { email, password } = formData;

  // --- Event Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear any previous errors
    setLoading(true); // Start loading

    // Basic client-side validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false); // Stop loading
      return;
    }

    try {
      // Prepare request data and config for Axios
      const body = JSON.stringify({ email, password }); // Send email and password
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Make API call using Axios
      const response = await axios.post(API_LOGIN_URL, body, config);

      console.log('Login successful:', response.data);

      // --- Handle Successful Login ---
      // 1. Store the token and user info from the response
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user object as string

      // 2. TODO: Update global application state if needed (e.g., Context/Redux)

      // 3. Redirect to the student dashboard using useNavigate
      navigate('/student-dashboard'); // Adjust path if needed

    } catch (err) {
      // Handle errors (Axios provides error details in err.response)
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please try again.'; // Default message
      if (err.response && err.response.data && err.response.data.message) {
        // Use the specific error message from the backend
        errorMessage = err.response.data.message;
      } else if (err.request) {
        // Network error (no response received)
        errorMessage = 'Network error. Cannot reach server.';
      }
      setError(errorMessage);
    } finally {
      // Ensure loading is set to false whether success or error
      setLoading(false);
    }
  };

  // --- JSX ---
  return (
    <div className={styles.loginContainer}> {/* Ensure class name matches your CSS */}
      <form className={styles.loginForm} onSubmit={handleSubmit}> {/* Ensure class name matches */}
        <h2>Student Login</h2> {/* Update title */}
        {error && <div className={styles.errorMessage}>{error}</div>} {/* Ensure class name matches */}

        {/* Email Input */}
        <div className={styles.formGroup}> {/* Ensure class name matches */}
          <label htmlFor="email">Email Address:</label> {/* Change label */}
          <input
            type="email" // Use type="email" for better validation/UX
            id="email"
            name="email" // Use name="email"
            value={email} // Bind to email state
            onChange={handleChange} // Use combined handler
            required
            placeholder="your.name@university.edu" // Add placeholder
          />
        </div>

        {/* Password Input */}
        <div className={styles.formGroup}> {/* Ensure class name matches */}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password" // Use name="password"
            value={password} // Bind to password state
            onChange={handleChange} // Use combined handler
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}> {/* Disable button when loading */}
          {loading ? 'Logging In...' : 'Login'} {/* Show loading text */}
        </button>

         {/* Optional: Add links for registration or password reset */}
         {/* <p className={styles.linkText}> {/* Example styling */}
             {/* Don't have an account? <Link to="/register/student">Register here</Link> */}
         {/* </p> */}
      </form>
    </div>
  );
}

export default Login;