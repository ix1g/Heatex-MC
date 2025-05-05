import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config';
import { UserChatHistory } from '../types/config';

class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private chatHistory: Map<string, UserChatHistory[]>;

    constructor() {
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        this.chatHistory = new Map();
    }

    async generateResponse(userId: string, input: string): Promise<string> {
        try {
            if (!this.chatHistory.has(userId)) {
                this.chatHistory.set(userId, []);
            }

            const history = this.chatHistory.get(userId)!;
            history.push({ role: "user", parts: input });

            const chat = this.model.startChat({
                history,
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                },
            });

            const result = await chat.sendMessage(input);
            const response = await result.response;
            const responseText = response.text();

            history.push({ role: "model", parts: responseText });

            // Keep only last 20 messages
            if (history.length > 20) {
                this.chatHistory.set(userId, history.slice(-20));
            }

            return responseText;
        } catch (error) {
            console.error('AI Service Error:', error);
            return "I encountered an error processing your request. Please try again.";
        }
    }

    resetMemory(userId: string): void {
        this.chatHistory.delete(userId);
    }

    async processImage(imageUrl: string, prompt: string): Promise<string> {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
            const result = await model.generateContent([imageUrl, prompt]);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Image Processing Error:', error);
            return "I encountered an error processing the image. Please try again.";
        }
    }
}
// Initialize the AI service
// and export it for use in other parts of the application
// This allows you to use the same instance of AiService across your application
// without creating multiple instances, which can be resource-intensive.
// This is especially useful for managing chat history and memory
// for each user in a centralized manner.
// This is a singleton pattern, ensuring that only one instance of AiService exists.
// This is useful for managing shared resources like chat history and memory.
export const aiService = new AiService();