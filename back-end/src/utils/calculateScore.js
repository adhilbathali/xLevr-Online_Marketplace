function calculateStudentScore(student, refinedFilters) {
    const { RS, Req_CS, Req_EXL } = refinedFilters;
    
    // Count Matched Skills
    let matchedSkills = student.skills.filter(skill => RS.includes(skill)).length;

    // Count Past Completed Skills Match
    let pastMatchedSkills = student.pastCompletedSkills.filter(skill => RS.includes(skill)).length;

    // Ensure at least 1 skill exists to prevent division by zero
    let skillScore = (RS.length > 0) ? (matchedSkills / RS.length) * 30 : 0; // 30% weight
    let pastProjectScore = (RS.length > 0) ? (pastMatchedSkills / RS.length) * 35 : 0; // 35% weight

    // Expertise Level is derived from past experience (can be adjusted)
    let expertiseScore = (student.expertise / Req_EXL) * 20; // 20% weight

    // Completion Speed Score (Higher is better, normalized)
    let speedScore = (Req_CS / student.completionSpeed) * 15; // 15% weight

    let score = skillScore + pastProjectScore + expertiseScore + speedScore;

    return score;
}

module.exports = calculateStudentScore;