// genAI.js  (updated)
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// DEBUG helper: run once to see model names available to your key
export async function listModels() {
  try {
    if (!ai.models || !ai.models.list) {
      console.warn("ai.models.list() not available on this SDK; consult docs.");
      return null;
    }
    const models = await ai.models.list();
    console.log("Available models:", JSON.stringify(models, null, 2));
    return models;
  } catch (e) {
    console.error("Failed to list models:", e);
    return null;
  }
}

/**
 * Analyze an image URL and return type + priority
 * @param {string} photoUrl
 * @returns {Promise<{type: string, priority: number}>}
 */
export async function analyzeComplaintImage(photoUrl) {
  const fallback = { type: "other", priority: 0 };

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found, using fallback classification");
      return fallback;
    }
    console.log("GEMINI_API_KEY found, proceeding with AI analysis");

    // fetch image bytes
    const res = await fetch(photoUrl);
    if (!res.ok) {
      console.error("Failed to fetch image:", res.status, res.statusText);
      return fallback;
    }
    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    const mimeType = res.headers.get("content-type") || "image/jpeg";

    // Build contents with correct parts shape (text part first, then inline_data part)
    const prompt = `
You are a civic issue complaint analyzer.
Look at the given image and:
1. Classify it into one of: ["garbage", "pothole", "water_leak", "streetlight", "other"].
2. Assign a priority score:
   - 2 = High (urgent safety/environment issue like pothole, water leak)
   - 1 = Medium (important but less urgent like garbage, streetlight)
   - 0 = Low (other or unclear)
Respond strictly with ONLY valid JSON like:
{"type": "garbage", "priority": 1}
Respond with no additional commentary.
`.trim();

    // NOTE: contents -> role -> parts -> part objects are { text: "..." } or { inline_data: { mime_type, data } }
    const contents = [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64,
            },
          },
        ],
      },
    ];

    // Choose a model that supports multimodal generateContent (listModels() helps pick it)
    const modelName = "gemini-2.5-flash"; // replace with the exact model from listModels() if different

    // Use ai.models.generateContent if available (preferred new SDK usage)
    let result;
    if (ai.models && typeof ai.models.generateContent === "function") {
      result = await ai.models.generateContent({
        model: modelName,
        contents,
      });
    } else if (typeof ai.getGenerativeModel === "function") {
      // fallback for older SDK shape
      const model = ai.getGenerativeModel({ model: modelName });
      result = await model.generateContent({ contents });
    } else {
      throw new Error("SDK does not expose generateContent API in an expected shape.");
    }

    // Inspect common result shapes to extract text candidate
    // New SDK often returns result.candidates or result.outputText / result.text
    // We try common fields; if none found, log the raw result for debugging
    let textOut = null;

    if (result?.text) textOut = result.text;
    else if (result?.outputText) textOut = result.outputText;
    else if (Array.isArray(result?.candidates) && result.candidates.length) {
      // candidate may have .output or .content
      const candidate = result.candidates[0];
      // Some responses have candidate.output or candidate.content.parts
      if (candidate?.content && Array.isArray(candidate.content.parts)) {
        // find first text part
        for (const p of candidate.content.parts) {
          if (p.text) {
            textOut = p.text;
            break;
          }
          // some SDK shapes: p.inline_data / p.file_data -> not what we want here
        }
      }
      // fallback to candidate.outputText or candidate.text
      if (!textOut && (candidate.outputText || candidate.text)) {
        textOut = candidate.outputText || candidate.text;
      }
    } else if (result?.response && typeof result.response.text === "function") {
      // older SDK that returns a Response-like object
      try {
        textOut = await result.response.text();
      } catch (e) {
        // ignore
      }
    }

    if (!textOut) {
      console.error("No textual output found in AI result. Raw result:", JSON.stringify(result, null, 2));
      return fallback;
    }

    // clean up triple-backticks if any, then extract json object
    let cleaned = textOut.replace(/```json|```/g, "").trim();
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (!m) {
      console.error("AI did not return a JSON object. Text was:", cleaned);
      return fallback;
    }

    const parsed = JSON.parse(m[0]);
    const validTypes = ["garbage", "pothole", "water_leak", "streetlight", "other"];
    if (!parsed || !validTypes.includes(parsed.type) || typeof parsed.priority !== "number") {
      console.warn("Parsed JSON invalid; returning fallback.", parsed);
      return fallback;
    }

    return { type: parsed.type, priority: parsed.priority };
  } catch (err) {
    console.error("Gemini API error:", err);
    return fallback;
  }
}
