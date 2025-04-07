const { genAI } = require("../config/googleGenAI.js");
const getRemainingDays = require("../utils/getDeadline.js");

const generateRefinedFilters = async (gigData) => {

    const remainingDays = getRemainingDays(gigData.deadline);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `
      You are a skilled AI expert in generating refined filters for student matching based on Gig data.
      Refined Filters:
      - RS: Required Skills (Only specific technologies/tools, NOT broad categories, minimum 3)
      - Req_CS: Required Completion Speed (Strict integer value from 1 to 10)
      - Req_EXL: Required Expertise Level (Strict integer value from 1 to 5)
      
      ### Important Rules:
      1. **RS must include at least 3 technologies/tools**, e.g., ["React", "Next.js", "Tailwind CSS", "Node.js"]  
         ❌ Incorrect: ["Front-End Development", "Mobile Development"]  
         ✅ Correct: ["React", "JavaScript", "Tailwind CSS"]  
      2. **Some technologies require dependencies:**  
         - If "React" is present, **JavaScript** must be included.  
         - If "Next.js" is present, **React** must be included.  
         - If "Node.js" is present, **Express.js** should be considered.  
         - If "Flutter" is present, **Dart** must be included.  
         - If "MongoDB" is present, **Mongoose** should be considered.  
      3. **Req_CS should be a single integer between 1 and 10** (not a string range like "1-5")  
      4. **Req_EXL should be a single integer between 1 and 5** (not a string range like "2-4")  
      
      Analyze the gig data carefully and generate structured refined filters optimized for precise student matching.
      
      Gig Data: ${JSON.stringify(gigData)}      
      Output strictly in JSON format without explanations:
      \`\`\`json
      {
          "RS": ["React", "JavaScript", "Tailwind CSS"],
          "Req_CS": ${remainingDays},
          "Req_EXL": 3
      }
      \`\`\`
      `;
      

  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponseText = await response.text(); // Ensure async call to properly resolve
  
      // Ensure we only parse valid JSON
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/); // Extract JSON content
      if (!jsonMatch) throw new Error("AI did not return valid JSON");
  
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error generating refined filters:", error);
      throw new Error("Failed to process refined filters using Google AI.");
    }
  };

  module.exports = { generateRefinedFilters };
  