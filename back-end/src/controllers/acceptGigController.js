const Gig = require("../models/gigModel");

const acceptGig = async (req, res) => {
    const studentId = req.user._id;
  const gig = await Gig.findById(req.params.id);

  if (!gig.notifiedStudents.includes(studentId)) {
    return res.status(403).send("You're not in the current batch.");
  }

  if (gig.acceptedBy) {
    return res.status(400).send("Already accepted by another student.");
  }

  gig.acceptedBy = studentId;
  gig.status = "assigned";
  gig.notifiedStudents = [];
  gig.offerExpiresAt = null;

  await gig.save();
  res.send("Gig accepted successfully.");
}

module.exports = acceptGig