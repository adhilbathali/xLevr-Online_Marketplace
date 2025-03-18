import Gig from "../models/gigModel.js"

export const postGig = async (req, res) => {
  try {
    const gig = new Gig(req.body);
    await gig.save();
    res.status(201).json({ message: "Gig created successfully", gig });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
