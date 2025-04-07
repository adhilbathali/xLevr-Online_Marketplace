const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const API_KEY = process.env.GOOGLE_GEN_AI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

module.exports = { genAI };
