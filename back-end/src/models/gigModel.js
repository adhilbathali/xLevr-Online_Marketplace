const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  // Who created this gig (professional)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professional",
    required: true,
  },

    // AI-generated Refined Filters
    refinedFilters: {
      RS: [String],
      Req_CS: Number,
      Req_EXL: Number
    },

  // Gig Details
  category: { type: String, required: true },
  companyTitle: { type: String, required: true },
  projectTitle: { type: String, required: true },
  projectDescription: { type: String, required: true },
  expectedDeliverables: { type: [String], required: true },
  deadline: { type: Date, required: true },
  projectBudget: { type: Number, required: true },
  referenceLinks: { type: [String] },
  additionalNotes: { type: String },
  createdAt: { type: Date, default: Date.now },

  // Hybrid Matching Logic
  topMatchedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // All 10 students
  notifiedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],   // Current batch (3 students)
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null }, // If anyone accepts
  batchPointer: { type: Number, default: 0 , enum: [0, 1, 2, 3]}, // Tracks current batch index
  offerExpiresAt: { type: Date }, // Deadline for batch to respond

  // Status Tracking
  status: {
    type: String,
    enum: ["pending", "assigned", "expired", "unassigned"],
    default: "pending"
  }
});

const Gig = mongoose.model("Gig", gigSchema);
module.exports = Gig;
