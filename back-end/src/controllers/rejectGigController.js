const Gig = require("../models/gigModel");
const { BATCH_SIZE, EXPIRY_HOURS } = require("../services/cron/hybridQueManagement");

const rejectGig = async (req, res) => {
    const { studentId } = req.body;
    const gig = await Gig.findById(req.params.id);

    gig.notifiedStudents = gig.notifiedStudents.filter(
        (id) => id.toString() !== studentId.toString()
    );

    // If all 3 reject, trigger next batch early
    if (gig.notifiedStudents.length === 0 && !gig.acceptedBy) {
        const nextStart = (gig.batchPointer + 1) * BATCH_SIZE;
        const nextBatch = gig.topMatchedStudents.slice(nextStart, nextStart + BATCH_SIZE);

        if (nextBatch.length > 0) {
        gig.batchPointer += 1;
        gig.notifiedStudents = nextBatch;
        gig.offerExpiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);
        } else {
        gig.status = "unassigned";
        gig.offerExpiresAt = null;
        }
    }

    await gig.save();
    res.send("Gig rejected.");
}

module.exports = rejectGig