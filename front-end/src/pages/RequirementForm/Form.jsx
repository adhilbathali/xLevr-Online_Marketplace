import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RequirementForm.css"; // Ensure this CSS file matches the new structure/class names

// Define the initial structure outside the component for clarity
const initialFormState = {
  createdBy: null, // Will be set in useEffect
  category: "",
  companyTitle: "",
  projectTitle: "",
  projectDescription: "",
  expectedDeliverables: [""], // Start with one empty deliverable
  deadline: "",
  projectBudget: "",
  referenceLinks: [""], // Start with one empty link field
  additionalNote: "",
};

const RequirementForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'submitting' | 'success' | 'error'
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check for user on component mount
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (!user || !user.id) {
      console.error("User not found or missing ID, redirecting to login.");
      navigate("/login");
    } else {
      setUserId(user.id); // Store user ID
      const savedCategory = localStorage.getItem("selectedCategory") || ""; // Get saved category or default to empty

      // Set initial values including fetched ones
      setForm((prevForm) => ({
        ...initialFormState, // Reset to initial structure
        createdBy: user.id,  // Set the fetched user ID
        category: savedCategory, // Set the fetched category
      }));
    }
  }, [navigate]); // Dependency: navigate

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm((prevForm) => ({
      ...prevForm,
      [field]: newArray,
    }));
    // Clear specific array item error
    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: null }));
    }
  };

  const handleAddField = (field) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: [...prevForm[field], ""], // Add an empty string
    }));
  };

  const handleRemoveField = (field, index) => {
    // Prevent removing the last field if you always want at least one
    if (form[field].length <= 1) return;
    const newArray = form[field].filter((_, i) => i !== index);
    setForm((prevForm) => ({
      ...prevForm,
      [field]: newArray,
    }));
     // Clear potential errors associated with removed field index (optional but clean)
     const baseErrorKey = `${field}-`;
     const updatedErrors = { ...errors };
     Object.keys(updatedErrors).forEach(key => {
       if (key.startsWith(baseErrorKey) && parseInt(key.split('-')[1]) >= index) {
         delete updatedErrors[key]; // Remove errors for the removed item and subsequent items
       }
     });
     setErrors(updatedErrors);
  };

  // --- Validation ---

  const validate = () => {
    const newErrors = {};
    if (!form.category?.trim()) newErrors.category = "Category is required"; // Added from old form
    if (!form.companyTitle?.trim()) newErrors.companyTitle = "Company Title is required";
    if (!form.projectTitle?.trim()) newErrors.projectTitle = "Project Title is required";
    if (!form.projectDescription?.trim()) newErrors.projectDescription = "Project Description is required";
    if (!form.deadline) newErrors.deadline = "Deadline is required";

    // Validate Project Budget (Required and must be a number)
    if (!form.projectBudget) {
        newErrors.projectBudget = "Project Budget is required";
    } else if (isNaN(Number(form.projectBudget)) || Number(form.projectBudget) <= 0) { // Improved check
        newErrors.projectBudget = "Please enter a valid positive budget amount";
    }

    // Validate Expected Deliverables (Ensure non-empty if needed)
    // This validation ensures *every* deliverable field added is filled. Adjust if optional is okay.
    form.expectedDeliverables.forEach((deliverable, index) => {
        if (!deliverable.trim()) {
            newErrors[`expectedDeliverables-${index}`] = `Deliverable #${index + 1} cannot be empty`;
        }
    });
    // Optional: Add a general error if the list itself is empty (if at least one is required)
    // if (form.expectedDeliverables.length === 0 || (form.expectedDeliverables.length === 1 && !form.expectedDeliverables[0].trim())) {
    //    newErrors.expectedDeliverables = "At least one expected deliverable is required";
    // }


    // Validate each Reference Link (if provided, must be a valid URL)
    form.referenceLinks.forEach((link, index) => {
      if (link.trim()) { // Only validate if non-empty
        try {
          new URL(link);
        } catch (_) {
          newErrors[`referenceLinks-${index}`] = "Invalid URL format";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // --- Submission ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setSubmitStatus("submitting"); // Indicate submission start

    if (!validate()) {
      setSubmitStatus(null); // Reset status if validation fails
      console.log("Validation Errors:", errors); // Log errors for debugging
      return;
    }

    // Ensure createdBy is set before submitting
    if (!form.createdBy) {
        console.error("User ID not set in form state.");
        setSubmitStatus("error");
        setErrors({ general: "User information is missing. Please refresh and try again." });
        return;
    }

    // Filter out empty reference links before sending (optional, backend might handle it)
    const submissionData = {
        ...form,
        referenceLinks: form.referenceLinks.filter(link => link.trim() !== ""),
        // Ensure budget is sent as a number if your backend expects it
        projectBudget: Number(form.projectBudget)
    };


    try {
      // IMPORTANT: Verify this is your correct API endpoint!
      // Use '/api/requirements' (from current) or 'http://localhost:5000/api/gigs/postgig' (from old)
      const response = await axios.post("http://localhost:5000/api/gigs/postgig", submissionData); // <-- UPDATE URL AS NEEDED

      console.log("Submission successful:", response.data);
      setSubmitStatus("success");
      setForm(initialFormState); // Reset form to initial state (blank)
      localStorage.removeItem("selectedCategory"); // Clear category from storage (from old form)

      // Optional: Redirect after successful submission
      // setTimeout(() => navigate('/dashboard'), 2000); // Example redirect after 2s

    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      setSubmitStatus("error");
      // Set a general error or specific errors based on backend response
      setErrors({ general: err.response?.data?.message || "An unexpected error occurred. Please try again." });
    }
  };

  // Prevent rendering the form until user ID is confirmed
  if (!userId) {
    return <div>Loading user data...</div>; // Or a spinner component
  }

  // --- JSX ---
  return (
    // Use class name from your CSS file, e.g., "requirement-form" or "form-container"
    <form className="requirement-form" onSubmit={handleSubmit} noValidate>
      <h2>Submit Your Project Requirement</h2>

      {/* General Error Display */}
      {errors.general && <p className="error form-error">{errors.general}</p>}

      {/* Category (Read-only) */}
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={form.category}
          readOnly // Keep it read-only as it's pre-filled
        />
        {/* No error display needed if read-only and validated before submit */}
      </div>

      {/* Company Title */}
      <div className="form-group">
        <label htmlFor="companyTitle">Company Title *</label>
        <input
          type="text"
          id="companyTitle"
          name="companyTitle"
          placeholder="Your Company Name"
          value={form.companyTitle}
          onChange={handleChange}
          aria-invalid={!!errors.companyTitle}
          aria-describedby="companyTitle-error"
        />
        {errors.companyTitle && <span id="companyTitle-error" className="error">{errors.companyTitle}</span>}
      </div>

      {/* Project Title */}
      <div className="form-group">
        <label htmlFor="projectTitle">Project Title *</label>
        <input
          type="text"
          id="projectTitle"
          name="projectTitle"
          placeholder="Brief Title for Your Project"
          value={form.projectTitle}
          onChange={handleChange}
          aria-invalid={!!errors.projectTitle}
          aria-describedby="projectTitle-error"
        />
        {errors.projectTitle && <span id="projectTitle-error" className="error">{errors.projectTitle}</span>}
      </div>

      {/* Project Description */}
      <div className="form-group">
        <label htmlFor="projectDescription">Project Description *</label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          placeholder="Describe the project goals, requirements, and scope..."
          value={form.projectDescription}
          onChange={handleChange}
          rows={5}
          aria-invalid={!!errors.projectDescription}
          aria-describedby="projectDescription-error"
        />
        {errors.projectDescription && <span id="projectDescription-error" className="error">{errors.projectDescription}</span>}
      </div>

      {/* Expected Deliverables */}
      <div className="form-group dynamic-field">
        <label>Expected Deliverables *</label>
        {form.expectedDeliverables.map((item, index) => (
          <div key={index} className="array-input">
            <input
              type="text"
              placeholder={`Deliverable #${index + 1}`}
              value={item}
              onChange={(e) => handleArrayChange(e, index, "expectedDeliverables")}
              aria-label={`Expected Deliverable ${index + 1}`}
              aria-invalid={!!errors[`expectedDeliverables-${index}`]}
              aria-describedby={`expectedDeliverables-${index}-error`}
            />
            {form.expectedDeliverables.length > 1 && ( // Show remove button only if more than one item exists
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleRemoveField("expectedDeliverables", index)}
                aria-label={`Remove Deliverable ${index + 1}`}
              >
                Remove
              </button>
            )}
          </div>
         ))}
         {/* Display errors for specific deliverables */}
        {Object.keys(errors).map(key => key.startsWith("expectedDeliverables-") && errors[key] && (
            <span key={key} id={`${key}-error`} className="error array-item-error">{errors[key]}</span>
        ))}
        {/* Optional general error for the deliverables section */}
        {errors.expectedDeliverables && <span className="error">{errors.expectedDeliverables}</span>}

        <button
          type="button"
          className="add-btn"
          onClick={() => handleAddField("expectedDeliverables")}
        >
          Add Another Deliverable
        </button>
      </div>

      {/* Deadline */}
      <div className="form-group">
        <label htmlFor="deadline">Deadline *</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          // Set min date to today if needed: min={new Date().toISOString().split("T")[0]}
          aria-invalid={!!errors.deadline}
          aria-describedby="deadline-error"
        />
        {errors.deadline && <span id="deadline-error" className="error">{errors.deadline}</span>}
      </div>

      {/* Project Budget */}
      <div className="form-group">
        <label htmlFor="projectBudget">Project Budget (e.g., USD) *</label>
        <input
          type="number" // Use type="number" for better mobile input
          id="projectBudget"
          name="projectBudget"
          placeholder="e.g., 5000"
          value={form.projectBudget}
          onChange={handleChange}
          min="1" // Prevent negative numbers directly in input
          step="any" // Allow decimals if needed, or "1" for whole numbers
          aria-invalid={!!errors.projectBudget}
          aria-describedby="projectBudget-error"
        />
        {errors.projectBudget && <span id="projectBudget-error" className="error">{errors.projectBudget}</span>}
      </div>

      {/* Reference Links */}
      <div className="form-group dynamic-field">
        <label>Reference Links (Optional)</label>
        {form.referenceLinks.map((item, index) => (
          <div key={index} className="array-input">
            <input
              type="url" // Use type="url" for basic browser validation
              placeholder="https://example.com"
              value={item}
              onChange={(e) => handleArrayChange(e, index, "referenceLinks")}
              aria-label={`Reference Link ${index + 1}`}
              aria-invalid={!!errors[`referenceLinks-${index}`]}
              aria-describedby={`referenceLinks-${index}-error`}
            />
             {form.referenceLinks.length > 1 && ( // Show remove only if more than one
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleRemoveField("referenceLinks", index)}
                aria-label={`Remove Reference Link ${index + 1}`}
              >
                Remove
              </button>
            )}
            {errors[`referenceLinks-${index}`] && (
              <span id={`referenceLinks-${index}-error`} className="error array-item-error">
                {errors[`referenceLinks-${index}`]}
              </span>
            )}
          </div>
        ))}
        <button
            type="button"
            className="add-btn"
            onClick={() => handleAddField("referenceLinks")}
        >
            Add Another Link
        </button>
      </div>

      {/* Additional Note */}
      <div className="form-group">
        <label htmlFor="additionalNote">Additional Notes (Optional)</label>
        <textarea
          id="additionalNote"
          name="additionalNote"
          placeholder="Anything else the service provider should know?"
          value={form.additionalNote}
          onChange={handleChange}
          rows={4}
        />
        {/* No error validation typically needed for optional fields */}
      </div>

      {/* Submit Button and Status Messages */}
      <div className="form-actions">
        <button
            type="submit"
            className="submit-btn"
            disabled={submitStatus === 'submitting'} // Disable button while submitting
        >
          {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Requirement'}
        </button>

        {submitStatus === "success" && (
          <p className="success form-success">Requirement submitted successfully!</p>
        )}
        {/* Error message displayed near the top now (errors.general) */}
        {submitStatus === "error" && !errors.general && ( // Show generic error if no specific one was set
          <p className="error form-error">Submission failed. Please check the form or try again later.</p>
        )}
      </div>
    </form>
  );
};

export default RequirementForm;