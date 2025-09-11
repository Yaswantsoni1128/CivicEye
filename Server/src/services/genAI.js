import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze an image URL and return type + priority
 * @param {string} photoUrl
 * @returns {Promise<{type: string, priority: number}>}
 */
export async function analyzeComplaintImage(photoUrl) {
  const response = await fetch(photoUrl);
  const buffer = await response.arrayBuffer();

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are a civic issue complaint analyzer.
  Look at the given image and:
  1. Classify it into one of: ["garbage", "pothole", "water_leak", "streetlight", "other"].
  2. Assign a priority score: 
     - 2 = High (urgent safety/environment issue like pothole, water leak)
     - 1 = Medium (important but less urgent like garbage, streetlight)
     - 0 = Low (other or unclear)
  Respond strictly in JSON format like this:
  {"type": "garbage", "priority": 1}
  `;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: Buffer.from(buffer).toString("base64"),
        mimeType: "image/jpeg", // adjust if PNG/WebP
      },
    },
  ]);

  try {
    let text = result.response.text().trim();

    // 🔹 Clean Gemini response (remove ```json or ``` if present)
    text = text.replace(/```json|```/g, "").trim();

    // 🔹 Extract first {...} JSON object if extra text is around
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }

    throw new Error("No valid JSON found");
  } catch (err) {
    console.error("Failed to parse AI response:", result.response.text());
    return { type: "other", priority: 0 }; // fallback
  }
}
