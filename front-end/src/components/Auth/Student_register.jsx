import React, { useState, useRef } from 'react';
import styles from './Student_register.module.css';

function StudentRegistrationForm() {
    // --- State ---
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
        university: '', studentId: '', graduationYear: '', idCardPhoto: null,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const formRef = useRef(null);

    // --- Configuration ---
    // TODO: Move to environment variable (e.g., process.env.REACT_APP_API_URL)
    const API_BASE_URL = 'http://localhost:5000'; // Make sure this matches your backend port

    // TODO: Fetch this list from an API or config file
    const universities = [
        { name: "Select University", value: "" },
        { name: "University of Example", value: "University of Example" },
        { name: "State University", value: "State University" },
        { name: "Another College", value: "Another College" },
    ];

    // --- Validation ---
    const validateForm = () => {
        const newErrors = {};
        // (Keep your existing validation logic - it's good)
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) { // Matching backend requirement
            newErrors.password = 'Password must be at least 6 characters.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!formData.university) {
             newErrors.university = 'University is required.';
        }
        if (!formData.idCardPhoto) {
            newErrors.idCardPhoto = 'ID card photo is required.';
        } else if (formData.idCardPhoto.size > 5 * 1024 * 1024) { // 5MB
            newErrors.idCardPhoto = 'File size must be less than 5MB.';
        } else if (!['image/jpeg', 'image/png', 'image/jpg'].includes(formData.idCardPhoto.type)) {
            newErrors.idCardPhoto = 'Image type must be jpg, jpeg, or png';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Event Handlers ---
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value,
        }));
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
        // Clear server error on any change
        if (errors.server) {
            setErrors(prevErrors => ({ ...prevErrors, server: null }));
        }
        // Clear success message on change
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    // --- *** CORRECTED handleSubmit *** ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(''); // Clear previous success message
        setErrors({}); // Clear previous errors

        if (!validateForm()) {
            console.log("Client-side validation failed");
            return;
        }

        setLoading(true);

        // Create FormData
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            // Only append if value is not null or undefined
            // Note: Empty strings for optional fields are fine to send
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        const requestUrl = `${API_BASE_URL}/api/auth/register/student`;
        console.log(`Submitting FormData to: ${requestUrl}`);

        try {
            const response = await fetch(requestUrl, {
                method: 'POST',
                body: data,
                // No 'Content-Type' header needed for FormData; browser sets it with boundary
            });

            console.log("Response Status:", response.status, response.statusText); // Log status

            // --- Robust Response Body Handling ---
            let responseData = null;
            let responseText = ''; // Store text response as fallback
            const contentType = response.headers.get("content-type");

            try {
                // Try to read the body ONCE. Prefer JSON if available.
                if (contentType && contentType.indexOf("application/json") !== -1) {
                     responseData = await response.json(); // Reads the body
                     console.log("Parsed JSON Response:", responseData);
                } else {
                     responseText = await response.text(); // Reads the body
                     console.log("Received Text Response:", responseText);
                     // Attempt to parse if it looks like JSON, otherwise keep as text
                     try {
                         responseData = JSON.parse(responseText);
                     } catch (parseError) {
                         console.log("Response text was not valid JSON.");
                     }
                }
            } catch (bodyError) {
                // This catch block handles errors during the body reading itself
                // (e.g., network interruption during body read)
                // It does NOT handle the "body already read" error, as we prevent that by reading only once.
                console.error("Error reading response body:", bodyError);
                // Keep responseData as null or handle as needed
            }
            // --- End Response Body Handling ---


            if (response.ok) { // Check status code 200-299
                setSuccessMessage(responseData?.message || 'Registration successful! Please check your email to verify your account.');
                setFormData({ // Reset form state
                    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
                    university: '', studentId: '', graduationYear: '', idCardPhoto: null
                });
                if (formRef.current) {
                    formRef.current.reset(); // Reset native form element (clears file input)
                }

            } else {
                // Handle 4xx/5xx errors using the parsed data or status text
                console.error(`Server Error: ${response.status}`, responseData || responseText);
                let errorMessage = `Registration failed. Status: ${response.status}`; // Default
                 if (responseData) {
                     // Prioritize specific message from backend JSON
                    errorMessage = responseData.message ||
                                   (Array.isArray(responseData.errors) ? responseData.errors.join(', ') : errorMessage);
                 } else if (responseText) {
                     // If we got text but couldn't parse as JSON (e.g., HTML 404 page)
                     errorMessage = `Server Error: ${response.status}. Could not process response.`; // Avoid showing raw HTML
                 }
                setErrors({ server: errorMessage });
            }

        } catch (error) {
            // Handle network errors (fetch failure, CORS, etc.)
            console.error("Submission Network/Fetch Error:", error);
            // Check if it's an AbortError if you implement cancellation
            // if (error.name === 'AbortError') { ... }
             setErrors({ server: 'Network error: Could not connect to the server. Please check your connection.' });
        } finally {
            setLoading(false);
        }
    };
    // --- *** END CORRECTED handleSubmit *** ---


    // --- JSX (No changes needed here, assuming it was correct) ---
    return (
        <div className={styles.container}>
            <h2>Join as a Student</h2>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errors.server && <div className={styles.errorMessage} style={{ textAlign: 'center', marginBottom: '15px' }}>{errors.server}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data" ref={formRef}>
                {/* First Name */}
                <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text" id="firstName" name="firstName"
                        value={formData.firstName} onChange={handleChange}
                        required
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? "firstNameError" : undefined}
                    />
                    {errors.firstName && <div id="firstNameError" className={styles.errorMessage}>{errors.firstName}</div>}
                </div>

                {/* Last Name */}
                <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text" id="lastName" name="lastName"
                        value={formData.lastName} onChange={handleChange}
                        required
                        aria-invalid={!!errors.lastName}
                        aria-describedby={errors.lastName ? "lastNameError" : undefined}
                    />
                    {errors.lastName && <div id="lastNameError" className={styles.errorMessage}>{errors.lastName}</div>}
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email" id="email" name="email"
                        value={formData.email} onChange={handleChange}
                        placeholder="your.name@university.edu" required
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "emailError" : undefined}
                     />
                    {errors.email && <div id="emailError" className={styles.errorMessage}>{errors.email}</div>}
                </div>

                {/* Password */}
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password" id="password" name="password"
                        value={formData.password} onChange={handleChange}
                        required
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "passwordError" : undefined}
                    />
                    {errors.password && <div id="passwordError" className={styles.errorMessage}>{errors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password" id="confirmPassword" name="confirmPassword"
                        value={formData.confirmPassword} onChange={handleChange}
                        required
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? "confirmPasswordError" : undefined}
                    />
                    {errors.confirmPassword && <div id="confirmPasswordError" className={styles.errorMessage}>{errors.confirmPassword}</div>}
                </div>

                {/* University */}
                <div className={styles.formGroup}>
                    <label htmlFor="university">University/Institution:</label>
                    <select
                        id="university" name="university"
                        value={formData.university} onChange={handleChange}
                        required
                        aria-invalid={!!errors.university}
                        aria-describedby={errors.university ? "universityError" : undefined}
                    >
                        {universities.map((uni) => (
                            <option key={uni.name} value={uni.value}>
                                {uni.name}
                            </option>
                        ))}
                    </select>
                    {errors.university && <div id="universityError" className={styles.errorMessage}>{errors.university}</div>}
                </div>

                {/* Student ID (Optional) */}
                <div className={styles.formGroup}>
                    <label htmlFor="studentId">Student ID (Optional):</label>
                    <input
                        type="text" id="studentId" name="studentId"
                        value={formData.studentId} onChange={handleChange}
                        placeholder="e.g., 12345678"
                    />
                </div>

                {/* Graduation Year (Optional) */}
                <div className={styles.formGroup}>
                    <label htmlFor="graduationYear">Expected Graduation Year (Optional):</label>
                    <input
                        type="number" id="graduationYear" name="graduationYear"
                        value={formData.graduationYear} onChange={handleChange}
                        placeholder="e.g., 2025" min="1900" max="2100"
                    />
                </div>

                {/* ID Card Photo */}
                <div className={styles.formGroup}>
                    <label htmlFor="idCardPhoto">Upload ID Card Photo:</label>
                    <input
                        type="file" id="idCardPhoto" name="idCardPhoto"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleChange}
                        required // Keep required here for client-side check
                        aria-invalid={!!errors.idCardPhoto}
                        aria-describedby={errors.idCardPhoto ? "idCardPhotoError" : undefined}
                    />
                    {errors.idCardPhoto && <div id="idCardPhotoError" className={styles.errorMessage}>{errors.idCardPhoto}</div>}
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading} className={styles.submitButton}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default StudentRegistrationForm;