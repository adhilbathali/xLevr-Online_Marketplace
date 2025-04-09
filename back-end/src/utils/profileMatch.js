const Student = require("../models/student_user");
const calculateStudentScore = require("./calculateScore");

async function getTopStudents(refinedFilters) {
  try {
    // Step 1: Get all students from the DB
    const students = await Student.find({}); // You can add filters if needed

    // Step 2: Calculate scores
    const scoredStudents = students.map(student => ({
      ...student.toObject(), // Convert Mongoose document to plain JS object
      score: calculateStudentScore(student, refinedFilters)
    }));

    // Step 3: Sort and return top 10
    scoredStudents.sort((a, b) => b.score - a.score);
    return scoredStudents.slice(0, 10);
  } catch (error) {
    console.error("Error fetching students or calculating scores:", error);
    throw error;
  }
}

module.exports = getTopStudents;
