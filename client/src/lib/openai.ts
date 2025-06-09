// This file is for any client-side OpenAI related utilities if needed
// Currently all OpenAI calls are handled server-side for security
export const API_BASE_URL = "";

export interface GenerateSpeechRequest {
  name: string;
  identity: string;
  background?: string;
  whatYouDo: string;
  motivation: string;
}

export interface GenerateSpeechResponse {
  speech: string;
  wordCount: number;
  readTime: number;
}
