const Gig = require('../../models/gigModel');

const BATCH_SIZE = 3;
const EXPIRY_HOURS = 24;

async function processHybridQueue() {
  const now = new Date();
  const gigs = await Gig.find({
    status: "pending",
    acceptedBy: null
  });

  console.log(`Found ${gigs.length} gigs to process`);
  const gigsPending = await Gig.find({ status: "pending" });
console.log(gigsPending.length);


  for (const gig of gigs) {
    const { batchPointer, topMatchedStudents } = gig;

    const nextStart = (batchPointer + 1) * BATCH_SIZE;
    const nextBatch = topMatchedStudents.slice(nextStart, nextStart + BATCH_SIZE);

    if (nextBatch.length === 0) {
      gig.status = "unassigned";
      gig.notifiedStudents = [];
      gig.offerExpiresAt = null;
    } else {
      gig.batchPointer += 1;
      gig.notifiedStudents = nextBatch;
      gig.offerExpiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);
    }

    await gig.save();
  }
}

module.exports = processHybridQueue;
