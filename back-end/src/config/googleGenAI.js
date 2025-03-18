import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GOOGLE_GEN_AI_API_KEY;

export const genAI = new GoogleGenerativeAI(API_KEY);