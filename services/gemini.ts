import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: We use process.env.API_KEY as per instructions.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askTutor = async (question: string, context?: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure process.env.API_KEY to use the AI Tutor.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `
      You are Captain Kube, a friendly and wise sea captain who explains Kubernetes concepts.
      Your audience is absolute beginners (freshers) or even 5-year-olds.
      
      Rules:
      1. Use the "Shipping Port" analogy consistent with:
         - Cluster = Port
         - Node = Ship
         - Pod = Shipping Container
         - App = Cargo inside the container
         - Service = Dispatcher/Phone Book
      2. Keep answers short (under 3 sentences where possible).
      3. Be encouraging and fun.
      4. If the user asks about specific technical details, relate it back to the analogy first, then explain simply.
      
      Current Context: ${context || 'General Kubernetes questions'}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I'm having trouble checking the ship's log right now. Try again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The radio is down! (API Error: Check console/network)";
  }
};
