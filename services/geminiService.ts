
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants.ts";
import { ClassificationResult } from "../types.ts";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const classifyEmail = async (rawText: string, cleanedText: string): Promise<ClassificationResult> => {
  const startTime = performance.now();
  
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Classify this email: \n\nRAW: ${rawText}\n\nPREPROCESSED: ${cleanedText}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSpam: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            topFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["isSpam", "confidence", "explanation", "topFeatures"]
        }
      }
    });

    const endTime = performance.now();
    const data = JSON.parse(response.text.trim());

    return {
      ...data,
      metadata: {
        processingTimeMs: Math.round(endTime - startTime),
        tokensCount: rawText.length / 4 // Rough estimate
      }
    };
  } catch (error) {
    console.error("Classification error:", error);
    throw new Error("Failed to classify content. Please check API connectivity.");
  }
};
