const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  companyTitle: {
    type: String,
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  expectedDeliverables: {
    type: [String],
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  projectBudget: {
    type: Number,
    required: true,
  },
  referenceLinks: {
    type: [String],
  },
  additionalNotes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
