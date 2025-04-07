const { checkSchema } = require("express-validator");
const gigValidationSchema = checkSchema({
  category: {
    in: ["body"],
    isString: { errorMessage: "Category must be a string" },
    notEmpty: { errorMessage: "Category is required" },
  },

  companyTitle: {
    in: ["body"],
    isString: { errorMessage: "Company Title must be a string" },
    notEmpty: { errorMessage: "Company Title is required" },
  },

  projectTitle: {
    in: ["body"],
    isString: { errorMessage: "Project Title must be a string" },
    notEmpty: { errorMessage: "Project Title is required" },
  },

  projectDescription: {
    in: ["body"],
    isString: { errorMessage: "Project Description must be a string" },
    notEmpty: { errorMessage: "Project Description is required" },
  },

  expectedDeliverables: {
    in: ["body"],
    isArray: { errorMessage: "Expected Deliverables must be an array" },
    notEmpty: { errorMessage: "Expected Deliverables cannot be empty" },
  },

  deadline: {
    in: ["body"],
    isISO8601: { errorMessage: "Deadline must be a valid date (ISO 8601 format)" },
    toDate: true,
  },

  "projectBudget": {
    in: ["body"],
    isNumeric: { errorMessage: "Budget must be a number" },
    notEmpty: { errorMessage: "Budget is required" },
  },

  referenceLinks: {
    in: ["body"],
    optional: true,
    isArray: { errorMessage: "Reference Links must be an array" },
  },

  "referenceLinks.*": {
    in: ["body"],
    optional: true,
    isURL: { errorMessage: "Each reference link must be a valid URL" },
  },

  additionalNote: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "Additional Note must be a string" },
  },
});

module.exports = gigValidationSchema;