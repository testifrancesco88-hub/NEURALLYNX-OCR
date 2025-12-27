
export interface ExtractionResult {
  id: string;
  imageUrl: string;
  extractedText: string;
  fileName: string;
  status: 'processing' | 'completed' | 'error';
  errorMessage?: string;
  timestamp: number;
}

export interface GeminiPart {
  inlineData?: {
    mimeType: string;
    data: string;
  };
  text?: string;
}
