const mongoose = require("mongoose");
const Gig = require("../models/gigModel"); // Adjust this path if needed
require("dotenv").config(); // Load .env file

// Dummy Professional and Student IDs
const mockProfessionalId = new mongoose.Types.ObjectId();
const mockStudentIds = Array.from({ length: 10 }, () => new mongoose.Types.ObjectId());

const categories = ["Web Development", "Graphic Design", "Data Entry", "Marketing", "AI"];
const companies = ["AlphaTech", "DesignCo", "MarketMasters", "Codeverse", "PixelEdge"];
const titles = ["Website Revamp", "Logo Creation", "Excel Data Entry", "SEO Boost", "AI Chatbot"];
const descriptions = [
  "Revamp the company website with modern design.",
  "Create a minimalistic logo.",
  "Input data into excel from scanned sheets.",
  "Improve website SEO using keywords.",
  "Develop an AI-powered chatbot for FAQ."
];
const deliverables = [["Website"], ["Logo Files"], ["Excel Sheet"], ["SEO Report"], ["Chatbot Code"]];
const links = [["https://example.com"], ["https://portfolio.com"]];
const notes = ["Urgent", "Can extend deadline", "More details on call"];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomFutureDate() {
  const now = new Date();
  return new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // within 30 days
}

async function seedGigs() {
  try {
    const dbURI = process.env.MONGO_URI;
    if (!dbURI) throw new Error("MONGO_URI is not defined in your .env file.");

    await mongoose.connect(dbURI);
    console.log("✅ Connected to MongoDB Atlas");

    await Gig.deleteMany({});
    console.log("🧹 Old gigs removed");

    const gigs = [];

    for (let i = 0; i < 10; i++) {
      gigs.push({
        createdBy: mockProfessionalId,
        refinedFilters: {
          RS: ["JS", "Node", "Mongo"],
          Req_CS: Math.floor(Math.random() * 10),
          Req_EXL: Math.floor(Math.random() * 5),
        },
        category: getRandomElement(categories),
        companyTitle: getRandomElement(companies),
        projectTitle: getRandomElement(titles),
        projectDescription: getRandomElement(descriptions),
        expectedDeliverables: getRandomElement(deliverables),
        deadline: getRandomFutureDate(),
        projectBudget: Math.floor(Math.random() * 5000) + 500,
        referenceLinks: getRandomElement(links),
        additionalNotes: getRandomElement(notes),
        topMatchedStudents: mockStudentIds,
        notifiedStudents: mockStudentIds.slice(0, 3),
        acceptedBy: null,
        batchPointer: 0,
        offerExpiresAt: getRandomFutureDate(),
        status: "pending",
      });
    }

    await Gig.insertMany(gigs);
    console.log("🌱 Seeded 10 gigs");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  }
}

seedGigs();
