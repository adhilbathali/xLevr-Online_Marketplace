import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RequirementForm.css";

const RequirementForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      navigate("/login");
    } else {
      setForm({
        createdBy: user.id,
        category: "",
        companyTitle: "",
        projectTitle: "",
        projectDescription: "",
        expectedDeliverables: [""],
        deadline: "",
        projectBudget: "",
        referenceLinks: [""],
        additionalNote: "",
      });

      const savedCategory = localStorage.getItem("selectedCategory");
      if (savedCategory) {
        setForm((prevForm) => ({
          ...prevForm,
          category: savedCategory,
        }));
      }
    }
  }, [navigate]);

  if (!form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...form[field]];
    newArray[index] = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      [field]: newArray,
    }));
  };

  const handleAddField = (field) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: [...prevForm[field], ""],
    }));
  };

  const handleRemoveField = (field, index) => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm((prevForm) => ({
      ...prevForm,
      [field]: newArray,
    }));
  };

  const validate = () => {
    let newErrors = {};
    if (!form.companyTitle) newErrors.companyTitle = "Company Title is required";
    if (!form.projectTitle) newErrors.projectTitle = "Project Title is required";
    if (!form.projectDescription) newErrors.projectDescription = "Project Description is required";
    if (!form.deadline) newErrors.deadline = "Deadline is required";
    if (!form.projectBudget) newErrors.projectBudget = "Project Budget is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("/api/requirements", form); // update with your API
      setSubmitStatus("success");
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    }
  };

  return (
    <form className="requirement-form" onSubmit={handleSubmit}>
      <h2>Submit Your Project Requirement</h2>

      <input
        type="text"
        name="companyTitle"
        placeholder="Company Title"
        value={form.companyTitle}
        onChange={handleChange}
      />
      {errors.companyTitle && <span className="error">{errors.companyTitle}</span>}

      <input
        type="text"
        name="projectTitle"
        placeholder="Project Title"
        value={form.projectTitle}
        onChange={handleChange}
      />
      {errors.projectTitle && <span className="error">{errors.projectTitle}</span>}

      <textarea
        name="projectDescription"
        placeholder="Project Description"
        value={form.projectDescription}
        onChange={handleChange}
      />
      {errors.projectDescription && <span className="error">{errors.projectDescription}</span>}

      <div className="dynamic-field">
        <label>Expected Deliverables</label>
        {form.expectedDeliverables.map((item, index) => (
          <div key={index} className="array-input">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(e, index, "expectedDeliverables")}
            />
            {index > 0 && (
              <button type="button" onClick={() => handleRemoveField("expectedDeliverables", index)}>Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => handleAddField("expectedDeliverables")}>Add More</button>
      </div>

      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
      />
      {errors.deadline && <span className="error">{errors.deadline}</span>}

      <input
        type="number"
        name="projectBudget"
        placeholder="Project Budget"
        value={form.projectBudget}
        onChange={handleChange}
      />
      {errors.projectBudget && <span className="error">{errors.projectBudget}</span>}

      <div className="dynamic-field">
        <label>Reference Links</label>
        {form.referenceLinks.map((item, index) => (
          <div key={index} className="array-input">
            <input
              type="url"
              value={item}
              onChange={(e) => handleArrayChange(e, index, "referenceLinks")}
            />
            {index > 0 && (
              <button type="button" onClick={() => handleRemoveField("referenceLinks", index)}>Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => handleAddField("referenceLinks")}>Add More</button>
      </div>

      <textarea
        name="additionalNote"
        placeholder="Additional Notes (optional)"
        value={form.additionalNote}
        onChange={handleChange}
      />

      <button type="submit">Submit</button>

      {submitStatus === "success" && <p className="success">Form submitted successfully!</p>}
      {submitStatus === "error" && <p className="error">Something went wrong. Try again.</p>}
    </form>
  );
};

export default RequirementForm;
