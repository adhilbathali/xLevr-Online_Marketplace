// src/components/Auth/Signup.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Signup.module.css';

// Define your backend API Base URL
// IMPORTANT: In a real app, use environment variables: process.env.REACT_APP_API_URL
// Ensure this matches the port your backend server is running on (e.g., 5000 or 5001)
const API_BASE_URL = 'http://localhost:5000'; // <-- ADJUST PORT IF NEEDED

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // Added loading state

    const [searchParams] = useSearchParams();

      useEffect(() => {
        const selectedRole = searchParams.get('role');
        if (selectedRole === 'student' || selectedRole === 'professional') {
          setRole(selectedRole);
        } else {
            // Optional: Handle case where role parameter is missing or invalid
            console.warn("Invalid or missing role in query parameters.");
            // setError("Invalid signup link: Role not specified."); // Or redirect
        }
      }, [searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true); // Start loading

        // --- Client-side Validation ---
        if (!role) {
            setError('Role is missing. Please ensure you accessed this page correctly.');
            setLoading(false);
            return;
          }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
         if (password.length < 6) {
             setError('Password must be at least 6 characters long.');
             setLoading(false);
             return;
         }
        // Add other client-side checks if needed (e.g., basic email format)

        // --- API Call ---
        try {
            // Use the correct API endpoint URL
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, { // <-- CORRECTED URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, role }),
            });

            // --- Handle the response ---
            if (response.ok) {
                // Signup successful! Backend responded with 2xx status.
                // const successData = await response.json(); // Optional: Read success data if backend sends any
                // console.log("Signup successful:", successData);
                setSuccess(true);
                // Clear form fields?
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                // Optionally, redirect to login page after a delay or display a success message
                // setTimeout(() => { window.location.href = '/login'; }, 3000);
            } else {
                // Signup failed. Backend responded with non-2xx status (e.g., 400, 404, 500).
                let errorMessage = `Signup failed. Status: ${response.status}`; // Default message
                try {
                    // Check if the response is actually JSON before trying to parse it
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json(); // Parse JSON error response from backend
                        console.error("Backend error response:", errorData);
                        // Use specific message from backend if available
                        errorMessage = errorData.message || (errorData.errors ? errorData.errors.join(', ') : `Error ${response.status}`);
                    } else {
                        // Handle non-JSON error responses (like HTML 404 pages or plain text)
                        const textResponse = await response.text(); // Read response as text
                        console.error("Non-JSON error response text:", textResponse);
                        // Provide a more user-friendly message for common errors like 404
                        if (response.status === 404) {
                            errorMessage = `Signup endpoint not found (404). Please check the API URL.`;
                        } else {
                            errorMessage = `Server returned status ${response.status}. Response was not JSON.`;
                        }
                    }
                } catch (parseError) {
                    // Error occurred even trying to read the error response
                    console.error("Error parsing the response:", parseError);
                    errorMessage = `Error processing server response (${response.status}).`;
                }
                setError(errorMessage);
            }
        } catch (error) {
            // Network error (e.g., backend server down, CORS issue, DNS issue)
            setError('A network error occurred. Please check your connection or if the server is running.');
            console.error('Signup network error:', error);
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div className={styles.signupContainer}>
            <form className={styles.signupForm} onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <p>Joining as: <strong style={{ textTransform: 'capitalize' }}>{role || '...'}</strong></p> {/* Display selected role */}

                {/* Display Success or Error Message */}
                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>Signup successful! You can now <a href="/login">login</a>.</div>}

                {/* Disable form fields during success to prevent re-submission */}
                <fieldset disabled={success}>
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

                    {/* Hidden input isn't strictly needed since role is in JS state and sent in body */}
                    {/* <input type="hidden" name="role" value={role} /> */}

                    {/* Disable button when loading or after success */}
                    <button type="submit" disabled={loading || success}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </fieldset>
            </form>
        </div>
    );
}

export default Signup;