require("dotenv").config();
const mongoose = require("mongoose");
const faker = require("faker"); // Use @faker-js/faker if you're on the latest version
const Gig = require("../models/gigModel"); // Update the path as needed

async function seedGigs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Delete existing gigs
    await Gig.deleteMany({});
    console.log("🧹 Cleared existing gigs");

    const fakeGigs = [];

    for (let i = 0; i < 30; i++) {
      const status = faker.random.arrayElement([
        "pending",
        "assigned",
        "expired",
        "unassigned",
        "completed"
      ]);

      const acceptedBy =
        status === "completed" || status === "assigned"
          ? new mongoose.Types.ObjectId()
          : null;

      const notifiedStudents =
        acceptedBy === null
          ? [
              new mongoose.Types.ObjectId(),
              new mongoose.Types.ObjectId(),
              new mongoose.Types.ObjectId()
            ]
          : [];

      const fakeGig = new Gig({
        createdBy: new mongoose.Types.ObjectId(),
        refinedFilters: {
          RS: [faker.hacker.noun(), faker.hacker.verb()],
          Req_CS: faker.datatype.number({ min: 1, max: 5 }),
          Req_EXL: faker.datatype.number({ min: 0, max: 3 }),
        },
        category: faker.commerce.department(),
        companyTitle: faker.company.companyName(),
        projectTitle: faker.commerce.productName(),
        projectDescription: faker.lorem.paragraph(),
        expectedDeliverables: [
          faker.commerce.product(),
          faker.commerce.product(),
          faker.commerce.product(),
        ],
        deadline: faker.date.future(),
        projectBudget: faker.datatype.number({ min: 100, max: 5000 }),
        referenceLinks: [faker.internet.url(), faker.internet.url()],
        additionalNotes: faker.lorem.sentence(),
        topMatchedStudents: [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId(),
        ],
        notifiedStudents,
        acceptedBy,
        batchPointer: faker.datatype.number({ min: 0, max: 3 }),
        offerExpiresAt: acceptedBy ? null : faker.date.future(),
        status,
      });

      fakeGigs.push(fakeGig);
    }

    await Gig.insertMany(fakeGigs);
    console.log("🚀 Inserted 30 fake gigs");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedGigs();
