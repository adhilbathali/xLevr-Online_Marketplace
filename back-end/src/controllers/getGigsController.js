const Gig = require('../models/gigModel');

const getGigs = async (req, res) => {
    try {
        const studentId = req.params.id;

        // 1. Gigs where student is notified
        const notifiedGigs = await Gig.find({
            notifiedStudents: studentId
        });
    
        // 2. Gigs accepted by student
        const acceptedGigs = await Gig.find({
            acceptedBy: studentId
        });

        res.json({
            notifiedGigs,
            acceptedGigs 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getGigs };