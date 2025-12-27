
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiPart } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
export const extractTextFromImage = async (base64Data: string, mimeType: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("CONFIG_ERROR: API key not detected in the execution environment.");
  }

  // Initialize GoogleGenAI with a named parameter.
  const ai = new GoogleGenAI({ apiKey });
  
  const imagePart: GeminiPart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  const textPart: GeminiPart = {
    text: "Estrai il testo dall'immagine mantenendo il layout. Restituisci solo il testo estratto."
  };

  try {
    // Use gemini-3-flash-preview for text extraction tasks.
    // Call generateContent directly with model name and contents.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
    });

    // Directly access the .text property from GenerateContentResponse (do not call as a method).
    return response.text || "Nessun testo rilevato.";
  } catch (error: any) {
    console.error("Neural Error:", error);
    throw new Error(`SYSTEM_FAILURE: ${error.message || "Errore di connessione neurale."}`);
  }
};
