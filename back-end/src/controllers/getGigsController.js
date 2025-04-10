const Gig = require('../models/gigModel');

// --- getGigsStudent ---
// This function looks logically correct based on its description.
// No changes needed here unless your requirements are different.
const getGigsStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        // 1. Gigs where student is notified
        const notifiedGigs = await Gig.find({
            notifiedStudents: studentId // Finds gigs where studentId is in the array
        });

        // 2. Gigs accepted by student
        const acceptedGigs = await Gig.find({
            acceptedBy: studentId, // Finds gigs where studentId matches the acceptedBy field
            status: "assigned"
        });

        // 3. Gigs completed by student
        const completedGigs = await Gig.find({
            acceptedBy: studentId,
            status: "completed"
        })

        res.json({
            notifiedGigs,
            acceptedGigs,
            completedGigs
        });
    } catch (err) {
        console.error("Error in getGigsStudent:", err); // Added context to error log
        res.status(500).send('Internal Server Error');
    }
};

// --- getGigsProfessional ---
// Fixed issues with query syntax, variable names, and response structure.
const getGigsProfessional = async (req, res) => {
    try {
        const professionalId = req.params.id;

        // 1. Gigs created by the professional that are NOT completed
        const activeGigs = await Gig.find({
            createdBy: professionalId,
            status: { $ne: "completed" }, // Correct syntax for "not equal to completed"
            acceptedBy: { $ne: null }
        });

        // 2. Gigs created by the professional that ARE completed
        // Note: Changed from acceptedBy to createdBy based on common requirements.
        // If you need gigs *accepted* by the professional, change createdBy back to acceptedBy.
        const completedGigs = await Gig.find({
            createdBy: professionalId,    // Correct variable and assumed logic
            status: "completed"         // Correct status check
        });

        // 3. unacceptedGigs
        const unacceptedGigs = await Gig.find({
            createdBy: professionalId,
            acceptedBy: null
        });

        // Corrected response to use the variables defined in this function
        res.json({
            activeGigs,
            completedGigs,
            unacceptedGigs
        });
    } catch (err) {
        console.error("Error in getGigsProfessional:", err); // Added context to error log
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getGigsStudent, getGigsProfessional };