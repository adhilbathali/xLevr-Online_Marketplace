import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RequirementForm.css";

const userID = JSON.parse(localStorage.getItem("user")).id;
console.log(userID);

const initialForm = {
  createdBy: userID,
  category: "",
  companyTitle: "",
  projectTitle: "",
  projectDescription: "",
  expectedDeliverables: [""],
  deadline: "",
  projectBudget: "",
  referenceLinks: [""],
  additionalNote: "",
};

const RequirementForm = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  // Autofill category from localStorage
  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
      setForm((prev) => ({ ...prev, category: savedCategory }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, index, value) => {
    const updated = [...form[name]];
    updated[index] = value;
    setForm((prev) => ({ ...prev, [name]: updated }));
  };

  const addToArray = (name) => {
    setForm((prev) => ({ ...prev, [name]: [...prev[name], ""] }));
  };

  const removeFromArray = (name, index) => {
    const updated = [...form[name]];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, [name]: updated }));
  };

  const validateLocal = () => {
    const newErrors = {};
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.companyTitle.trim()) newErrors.companyTitle = "Company title is required";
    if (!form.projectTitle.trim()) newErrors.projectTitle = "Project title is required";
    if (!form.projectDescription.trim()) newErrors.projectDescription = "Project description is required";
    if (!form.expectedDeliverables.length || form.expectedDeliverables.some((d) => !d.trim()))
      newErrors.expectedDeliverables = "All expected deliverables must be filled";
    if (!form.deadline) newErrors.deadline = "Deadline is required";
    if (!form.projectBudget || isNaN(form.projectBudget)) newErrors.projectBudget = "Valid budget is required";

    form.referenceLinks.forEach((link, i) => {
      if (link.trim()) {
        try {
          new URL(link);
        } catch {
          newErrors[`referenceLinks-${i}`] = "Invalid URL";
        }
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLocal();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus(null);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/gigs/postgig", form);
      console.log("Submitted:", response.data);
      setSubmitStatus("success");
      setForm(initialForm);
      localStorage.removeItem("selectedCategory");
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Submit Your Project Requirements</h2>

      {[
        { label: "Category", name: "category" },
        { label: "Company Title", name: "companyTitle" },
        { label: "Project Title", name: "projectTitle" },
        { label: "Project Description", name: "projectDescription" },
        { label: "Deadline", name: "deadline", type: "date" },
        { label: "Project Budget", name: "projectBudget" },
        { label: "Additional Note", name: "additionalNote" },
      ].map(({ label, name, type = "text" }) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            readOnly={name === "category"}
          />
          {errors[name] && <p className="error">{errors[name]}</p>}
        </div>
      ))}

      <div className="form-group">
        <label>Expected Deliverables</label>
        {form.expectedDeliverables.map((item, i) => (
          <div key={i} className="array-field">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("expectedDeliverables", i, e.target.value)}
            />
            <button type="button" onClick={() => removeFromArray("expectedDeliverables", i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addToArray("expectedDeliverables")}>Add Deliverable</button>
        {errors.expectedDeliverables && <p className="error">{errors.expectedDeliverables}</p>}
      </div>

      <div className="form-group">
        <label>Reference Links</label>
        {form.referenceLinks.map((link, i) => (
          <div key={i} className="array-field">
            <input
              type="url"
              value={link}
              onChange={(e) => handleArrayChange("referenceLinks", i, e.target.value)}
            />
            <button type="button" onClick={() => removeFromArray("referenceLinks", i)}>Remove</button>
            {errors[`referenceLinks-${i}`] && <p className="error">{errors[`referenceLinks-${i}`]}</p>}
          </div>
        ))}
        <button type="button" onClick={() => addToArray("referenceLinks")}>Add Link</button>
      </div>

      <button type="submit" className="submit-btn">Submit</button>

      {submitStatus === "success" && <p className="success-msg">Form submitted successfully!</p>}
      {submitStatus === "error" && <p className="error-msg">Submission failed. Please try again.</p>}
    </form>
  );
};

export default RequirementForm;
