import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generate content using Google Gemini
 * @param {string} prompt - The prompt to send to Gemini
 * @param {number} timeoutMs - Timeout in milliseconds (default 15s)
 * @returns {Promise<string>} - The generated text
 */
export const generateContent = async (prompt, timeoutMs = 15000) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await model.generateContent(prompt);
    clearTimeout(timeout);
    const response = result.response;
    return response.text();
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === "AbortError") {
      throw new Error("AI request timed out");
    }

    throw error;
  }
};

/**
 * Generate content and parse as JSON
 * @param {string} prompt - The prompt (must instruct JSON output)
 * @returns {Promise<object>} - Parsed JSON object
 */
export const generateJSON = async (prompt) => {
  const text = await generateContent(prompt);

  // Extract JSON from possible markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

  try {
    return JSON.parse(jsonStr);
  } catch {
    throw new Error("AI returned invalid JSON");
  }
};
