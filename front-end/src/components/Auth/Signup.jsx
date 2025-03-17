// src/components/Auth/Signup.js
import React, { useState } from 'react';
import styles from './Signup.module.css'; // Import CSS module

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Track successful signup

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(false);

    // --- Client-side Validation ---
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Invalid email format")
        return;
    }

      if (password.length < 8) {
          setError("Password must be at least 8 characters long.");
          return;
      }

      // Check for at least one uppercase letter
      if (!/[A-Z]/.test(password)) {
          setError("Password must contain at least one uppercase letter.");
          return;
      }

      // Check for at least one lowercase letter
      if (!/[a-z]/.test(password)) {
          setError("Password must contain at least one lowercase letter.");
          return;
      }

      // Check for at least one number
      if (!/[0-9]/.test(password)) {
          setError("Password must contain at least one number.");
          return;
      }

        // Check for at least one special character
        if (!/[^a-zA-Z0-9]/.test(password)) {
            setError("Password must contain at least one special character.");
            return;
        }


    // --- API Call (Replace with your actual endpoint) ---
    try {
      const response = await fetch('/api/signup', { //  Replace with your API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // Signup successful!
        setSuccess(true);
        // Optionally, redirect to login page or display a success message
        // window.location.href = '/login'; // Uncomment to redirect
      } else {
        // Signup failed.  Get error message from server (if available).
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>Signup successful! You can now <a href="/login">login</a>.</div>}
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;