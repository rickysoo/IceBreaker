import { users, speechRequests, type User, type InsertUser, type SpeechRequest, type InsertSpeechRequest } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSpeechRequest(request: InsertSpeechRequest): Promise<SpeechRequest>;
  updateSpeechRequest(id: number, updates: Partial<SpeechRequest>): Promise<SpeechRequest | undefined>;
  getSpeechRequest(id: number): Promise<SpeechRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private speechRequests: Map<number, SpeechRequest>;
  private currentUserId: number;
  private currentSpeechRequestId: number;

  constructor() {
    this.users = new Map();
    this.speechRequests = new Map();
    this.currentUserId = 1;
    this.currentSpeechRequestId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSpeechRequest(insertRequest: InsertSpeechRequest): Promise<SpeechRequest> {
    const id = this.currentSpeechRequestId++;
    const request: SpeechRequest = { 
      ...insertRequest, 
      id,
      generatedSpeech: null,
      wordCount: null
    };
    this.speechRequests.set(id, request);
    return request;
  }

  async updateSpeechRequest(id: number, updates: Partial<SpeechRequest>): Promise<SpeechRequest | undefined> {
    const existing = this.speechRequests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.speechRequests.set(id, updated);
    return updated;
  }

  async getSpeechRequest(id: number): Promise<SpeechRequest | undefined> {
    return this.speechRequests.get(id);
  }
}

export const storage = new MemStorage();
