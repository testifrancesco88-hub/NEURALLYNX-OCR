
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiPart } from "../types";

export const extractTextFromImage = async (base64Data: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const imagePart: GeminiPart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  const textPart: GeminiPart = {
    text: "Estrai tutto il testo visibile da questa immagine. Mantieni il layout il più possibile, inclusi elenchi, tabelle e paragrafi. Restituisci solo il testo estratto, senza frasi introduttive o commenti."
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] as any },
    });

    return response.text || "Non è stato possibile estrarre alcun testo.";
  } catch (error) {
    console.error("Extraction failed:", error);
    throw new Error("Impossibile estrarre il testo dall'immagine. Riprova.");
  }
};
