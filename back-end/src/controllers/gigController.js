const Gig = require("../models/gigModel");
const { generateRefinedFilters } = require("../services/googleAIService");
const getTopStudents = require("../utils/profileMatch");

const postGig = async (req, res) => {
  try {
    const gigData = req.body;

    // Make sure 'createdBy' is included in the request
    if (!gigData.createdBy) {
      return res.status(400).json({ error: "'createdBy' (professional ID) is required" });
    }

    // Step 1: Save the Gig in MongoDB
    const gig = new Gig(gigData);
    await gig.save();

    // Step 2: Generate AI-based Refined Filters
    const refinedFilters = await generateRefinedFilters(gigData);

    // Step 3: Update Gig with AI-generated refined filters
    if (refinedFilters) {
      gig.refinedFilters = refinedFilters;
      const topStudents = await getTopStudents(refinedFilters);
      gig.topMatchedStudents = topStudents.map(s => s._id); 
      await gig.save();
    }

    // Step 4: Respond
    res.status(201).json({
      message: "Gig created successfully!",
      gig,
      refinedFilters,
    });
  } catch (error) {
    console.error("Error in postGig:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {
  postGig
}
