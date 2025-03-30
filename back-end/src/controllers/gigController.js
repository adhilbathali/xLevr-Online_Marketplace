import Gig from "../models/gigModel.js";
import { generateRefinedFilters } from "../services/googleAIService.js";

export const postGig = async (req, res) => {
  try {
    const gigData = req.body;

    // Step 1: Save the Gig in MongoDB
    const gig = new Gig(gigData);
    await gig.save();

    // Step 2: Generate AI-based Refined Filters
    const refinedFilters = await generateRefinedFilters(gigData);

    // Step 3: Update Gig with AI-generated refined filters
    if (refinedFilters) {
      gig.refinedFilters = refinedFilters;
      gig.studentsQue = [];
      await gig.save();
    }

    // Step 4: Respond with the created Gig
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
