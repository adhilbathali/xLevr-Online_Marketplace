// src/components/Auth/Login.js
import React, { useState } from 'react';
import styles from './Login.module.css'; // Import the CSS module

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear any previous errors

    // Basic client-side validation (you MUST also validate on the server!)
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    // Simulate an API call (replace with your actual API endpoint)
    try {
      const response = await fetch('/api/login', { //  Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Login successful!  Redirect to dashboard or home page.
        const data = await response.json();
        // Assuming your API returns a JWT or some kind of session token
        localStorage.setItem('token', data.token); // Store the token
        window.location.href = '/'; // Redirect to home page (adjust as needed)
      } else {
        // Login failed.  Get error message from server (if available).
        const errorData = await response.json();
        setError(errorData.message || 'Invalid username or password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;