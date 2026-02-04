import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  try {
    const { rawText, cleanedText } = req.body;

    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Classify this email:\n\nRAW: ${rawText}\n\nPREPROCESSED: ${cleanedText}`,
      config: {
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

    res.status(200).json(JSON.parse(response.text));

  } catch (error) {
    res.status(500).json({ error: "Classification failed." });
  }
}
