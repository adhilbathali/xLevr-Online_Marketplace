import React, { useState, useRef } from 'react'; // Import useRef for potential form reset
import styles from './Student_register.module.css';

function StudentRegistrationForm() {
    // --- State ---
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '', // Default to empty or the first option's value if needed
        studentId: '',
        graduationYear: '',
        idCardPhoto: null,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const formRef = useRef(null); // Ref for accessing the form element if needed for reset

    // --- Configuration ---
    // TODO: Move to environment variable (e.g., process.env.REACT_APP_API_URL) for build/deployment
    const API_BASE_URL = 'http://localhost:5000';

    // TODO: Fetch this list from an API or config file
    const universities = [
        { name: "Select University", value: "" }, // Use value for the state
        { name: "University of Example", value: "University of Example" },
        { name: "State University", value: "State University" },
        { name: "Another College", value: "Another College" },
        // Add More Universities
    ];

    // --- Validation ---
    const validateForm = () => {
        const newErrors = {};
        // (Validation logic remains the same - it's solid)
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        }
        if (!formData.password) { // Check password presence directly
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!formData.university) { // Check if a university is selected
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
        // Optionally clear the specific field's error when the user types
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Client-side validation failed:", errors); // Log validation errors
            return;
        }

        setLoading(true);
        setSuccessMessage('');
        setErrors({});

        // Create FormData
        const data = new FormData();
        // Use Object.entries for slightly cleaner iteration
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) { // Don't append null values (like initial idCardPhoto)
                data.append(key, value);
            }
        });

        console.log("Submitting FormData..."); // Log before fetch

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register/student`, {
                method: 'POST',
                body: data,
            });

            console.log("Response status:", response.status); // Log response status

            if (response.ok) {
                setSuccessMessage('Registration successful! Please check your email to verify your account.');
                // Reset form state completely
                setFormData({
                    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
                    university: '', studentId: '', graduationYear: '', idCardPhoto: null
                });
                // Reset the file input visually (optional, might need ref if state reset isn't enough)
                if (formRef.current) {
                    formRef.current.reset(); // Resets the entire form element
                }

            } else {
                // Handle non-OK responses
                let errorMessage = `Registration failed. Status: ${response.status}`; // Default message
                try {
                    const errorData = await response.json();
                    console.error("Backend error response:", errorData); // Log backend error
                    // Prioritize specific message, then array of errors, then default
                    errorMessage = errorData.message ||
                                   (errorData.errors ? errorData.errors.map(err => err.msg).join(', ') : errorMessage);
                } catch (jsonError) {
                    // The error response wasn't JSON
                    const textResponse = await response.text(); // Get text response if not JSON
                    console.error("Could not parse error response as JSON. Status:", response.status, "Response Text:", textResponse);
                    errorMessage = `Registration failed. Server responded with status ${response.status}.`; // Use text if available? Maybe not safe.
                }
                setErrors({ server: errorMessage });
            }

        } catch (error) {
            // Handle network errors
            console.error("Submission network error:", error);
            setErrors({ server: 'Network error during registration. Please check connection or server status.' });
        } finally {
            setLoading(false);
        }
    };

    // --- JSX ---
    return (
        // Assign the ref to the form element
        <div className={styles.container}>
            <h2>Join as a Student</h2>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {/* Display server errors prominently */}
            {errors.server && <div className={styles.errorMessage} style={{ textAlign: 'center', marginBottom: '15px' }}>{errors.server}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data" ref={formRef}>
                {/* First Name */}
                <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text" id="firstName" name="firstName"
                        value={formData.firstName} onChange={handleChange}
                        required // Keep basic HTML5 validation
                        aria-invalid={!!errors.firstName} // Accessibility hint
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
                        value={formData.university} onChange={handleChange} // Use value from state
                        required
                        aria-invalid={!!errors.university}
                        aria-describedby={errors.university ? "universityError" : undefined}
                    >
                        {/* Map over the universities array */}
                        {universities.map((uni) => (
                            // Use uni.value for the option value, uni.name for display
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
                    {/* No error display needed for optional field unless specific format required */}
                </div>

                {/* Graduation Year (Optional) */}
                <div className={styles.formGroup}>
                    <label htmlFor="graduationYear">Expected Graduation Year (Optional):</label>
                    <input
                        type="number" id="graduationYear" name="graduationYear"
                        value={formData.graduationYear} onChange={handleChange}
                        placeholder="e.g., 2025" min="1900" max="2100" // Add sensible min/max
                    />
                </div>

                {/* ID Card Photo */}
                <div className={styles.formGroup}>
                    <label htmlFor="idCardPhoto">Upload ID Card Photo:</label>
                    <input
                        type="file" id="idCardPhoto" name="idCardPhoto"
                        accept="image/jpeg, image/png, image/jpg" // Specify accepted types
                        onChange={handleChange} // Handles file selection
                        aria-invalid={!!errors.idCardPhoto}
                        aria-describedby={errors.idCardPhoto ? "idCardPhotoError" : undefined}
                    />
                    {/* Display selected filename (optional) */}
                    {/* {formData.idCardPhoto && <span>Selected: {formData.idCardPhoto.name}</span>} */}
                    {errors.idCardPhoto && <div id="idCardPhotoError" className={styles.errorMessage}>{errors.idCardPhoto}</div>}
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default StudentRegistrationForm;