const Gig = require("../models/gigModel");
const StudentUser = require("../models/student_user")

const approveGig = async (req, res) => {
    const { professionalId } = req.body; // ID of the approving professional
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
        return res.status(404).send("Gig not found.");
    }
    
    // Check if a student has accepted the gig
    if (!gig.acceptedBy) {
        return res.status(400).send("No student has accepted this gig yet.");
    }
    
    // Mark as completed
    gig.status = "completed";
    const student = await StudentUser.findById(gig.acceptedBy);
    if (student){
        student.pastCompletedSkills.push(gig.refinedFilters.RS);
    }
    await gig.save();

    res.send("Gig approved and marked as completed.");
};

module.exports = approveGig;
