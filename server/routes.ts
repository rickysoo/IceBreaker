import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSpeechRequestSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/speech/generate", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertSpeechRequestSchema.parse(req.body);
      
      // Create speech request record
      const speechRequest = await storage.createSpeechRequest(validatedData);
      
      // Generate speech using OpenAI
      const prompt = `Create a compelling 300-word self-introduction SPEECH using the Who-What-Why framework based on the following information:

Name: ${validatedData.name}
Identity/Role: ${validatedData.identity}
Background: ${validatedData.background || 'Not provided'}
What they do: ${validatedData.whatYouDo}
Motivation/Why: ${validatedData.motivation}

CRITICAL: This is a SPEECH to be SPOKEN out loud, not an essay to be read. Make it sound natural when spoken aloud.

Speech Requirements:
- Use conversational language with natural speech patterns
- Include pauses, transitions, and speaking rhythms (use punctuation to indicate)
- Use shorter sentences that are easy to speak
- Include contractions and casual language where appropriate
- Make it flow naturally when read aloud
- Use "you" to directly address the audience
- Include natural speaking connectors like "Now," "So," "And here's the thing..."

Framework guidelines:
- WHO: Start with clear identity, add meaningful context, connect with audience
- WHAT: Describe who they help and how, use simple specific language, show results not just roles  
- WHY: Share belief or turning point, make it relatable and emotional, tie why to what

The speech should be exactly around 300 words, engaging, and follow the Who-What-Why structure naturally. Write it as if the person is speaking directly to a live audience.

Please respond with JSON in this exact format:
{
  "speech": "The complete 300-word speech text optimized for speaking",
  "wordCount": actual_word_count_number,
  "readTime": estimated_read_time_in_minutes
}`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert speech writer who specializes in creating compelling self-introduction speeches using the Who-What-Why framework. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.7,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      if (!result.speech || !result.wordCount) {
        throw new Error("Invalid response from OpenAI");
      }

      // Update speech request with generated content
      await storage.updateSpeechRequest(speechRequest.id, {
        generatedSpeech: result.speech,
        wordCount: result.wordCount
      });

      res.json({
        speech: result.speech,
        wordCount: result.wordCount,
        readTime: result.readTime || Math.ceil(result.wordCount / 150) // 150 words per minute average
      });

    } catch (error: any) {
      console.error("Speech generation error:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: error.message || "Failed to generate speech. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
