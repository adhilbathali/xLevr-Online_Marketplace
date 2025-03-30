import { getTopStudents } from "./scoreUtilis.js";

const students = [
    { _id:2, skills: ["React", "Node.js"], pastCompletedSkills: ["React"], expertise: 3, completionSpeed: 5 },
    { _id:3, skills: ["JavaScript", "CSS"], pastCompletedSkills: ["JavaScript"], expertise: 2, completionSpeed: 8 }
    // Add more student objects...
];

const refinedFilters = {
    RS: ["React", "Node.js", "JavaScript"],
    Req_CS: 7, 
    Req_EXL: 3
};

const topStudents = getTopStudents(students, refinedFilters);

console.log("Top 10 Students:", topStudents);
