require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("../models/student_user");

// Connect to MongoDB using env variable
const mongoUri = process.env.MONGO_URI;

const skillPool = [
  "JavaScript", "Python", "React", "Node.js", "UI/UX", "Graphic Design",
  "Poster Making", "Copywriting", "Technical Writing", "Video Editing",
  "Photography", "Illustration", "Animation", "Canva", "After Effects",
  "Premiere Pro", "Figma", "Content Writing", "Proofreading", "Blogging"
];

function getRandomSkills() {
  const shuffled = skillPool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 5) + 1);
}

function generateStudent(index) {
  const firstNames = ["Alex", "Jamie", "Taylor", "Jordan", "Morgan", "Casey"];
  const lastNames = ["Lee", "Kim", "Patel", "Sharma", "Ali", "Fernandez"];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}${lastName.toLowerCase()}${index}@example.com`,
    password: "hashedpassword", // Replace with hash if needed
    university: "XLevr University",
    graduationYear: 2025 + Math.floor(Math.random() * 4),
    skills: getRandomSkills(),
    pastCompletedSkills: getRandomSkills(),
    expertise: Math.floor(Math.random() * 10) + 1,
    completionSpeed: Math.floor(Math.random() * 30) + 1
  };
}

async function seedStudents() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    await Student.deleteMany({});
    console.log("🧹 Cleared existing students");

    const students = Array.from({ length: 100 }, (_, i) => generateStudent(i + 1));
    await Student.insertMany(students);

    console.log("🎉 Successfully added 100 test students!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding students:", error);
    process.exit(1);
  }
}

seedStudents();
