import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiPart } from "../types";

/**
 * Servizio neurale per l'estrazione di testo da immagini.
 * Utilizza il modello gemini-3-flash-preview per un'elaborazione rapida e accurata.
 */
export const extractTextFromImage = async (base64Data: string, mimeType: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("CONFIG_ERROR: Chiave API non valida o mancante nell'ambiente di esecuzione.");
  }

  // Inizializzazione del core neurale
  const ai = new GoogleGenAI({ apiKey });
  
  const imagePart: GeminiPart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  const textPart: GeminiPart = {
    text: "Estrai tutto il testo presente nell'immagine. Mantieni la struttura originale del testo, inclusi paragrafi e liste. Restituisci esclusivamente il testo estratto senza commenti aggiuntivi."
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
    });

    // Accesso diretto alla proprietà text della risposta
    const extracted = response.text;
    
    if (!extracted || extracted.trim().length === 0) {
      return "Nessun dato testuale rilevato nella sorgente visiva.";
    }

    return extracted;
  } catch (error: any) {
    console.error("Neural Synthesis Error:", error);
    
    // Gestione specifica per errori comuni
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error("AUTH_FAILURE: La chiave API fornita non è valida.");
    }
    
    throw new Error(`SYSTEM_FAILURE: ${error.message || "Errore sconosciuto durante l'estrazione."}`);
  }
};