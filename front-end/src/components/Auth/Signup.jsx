// src/components/Auth/Signup.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import styles from './Signup.module.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(''); // Add role state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [searchParams] = useSearchParams(); // Hook to get query parameters

      useEffect(() => {
        const selectedRole = searchParams.get('role');
        if (selectedRole === 'student' || selectedRole === 'professional') {
          setRole(selectedRole);
        }
      }, [searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);

        // --- Client-side Validation ---
        // ... (your existing validation) ...
        if (!role) { // Make sure a role is selected
            setError('Please select whether you are a student or a professional.');
            return;
          }
        // --- API Call (Replace with your actual endpoint) ---
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, role }), // Include role
            });
            // --- Handle the response ---
            // ... (your existing response handling) ...
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
                <p>Joining as: {role}</p> {/* Display selected role */}
                {error && <div className={styles.errorMessage}>{error}</div>}
                 {success && <div className={styles.successMessage}>Signup successful! You can now <a href="/login">login</a>.</div>}
                <div className={styles.formGroup}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                </div>

                 {/* Hidden input for role (alternative approach) */}
                 <input type="hidden" name="role" value={role} />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;