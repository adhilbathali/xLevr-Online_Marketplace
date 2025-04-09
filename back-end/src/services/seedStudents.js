require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const faker = require("faker");
const StudentUser = require("../models/student_user");

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

async function generateStudent() {
  const plainPassword = faker.internet.password();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    university: faker.company.companyName() + " University",
    graduationYear: faker.datatype.number({ min: 2023, max: 2028 }).toString(),
    idCardPhotoPath: faker.image.imageUrl(), // Simulated ID photo
    skills: getRandomSkills(),
    pastCompletedSkills: getRandomSkills(),
    expertise: faker.datatype.number({ min: 1, max: 10 }),
    completionSpeed: faker.datatype.number({ min: 1, max: 30 }),
    isVerified: faker.datatype.boolean()
  };
}

async function seedStudents() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Connected to MongoDB Atlas");

    await StudentUser.deleteMany({});
    console.log("🧹 Cleared student_users collection");

    const students = [];
    for (let i = 0; i < 100; i++) {
      const student = await generateStudent();
      students.push(student);
    }

    await StudentUser.insertMany(students);
    console.log("🎉 100 students added with hashed passwords!");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding students:", err);
    process.exit(1);
  }
}

seedStudents();
