import dotenv from 'dotenv';
import { ClientConfig, RateLimitConfig } from '../types/config';

dotenv.config();

export const config: ClientConfig = {
    token: process.env.DISCORD_TOKEN!,
    clientId: process.env.CLIENT_ID!,
    guildId: process.env.GUILD_ID!,
    aiChannelId: process.env.AI_CHANNEL_ID!,
    geminiApiKey: process.env.GEMINI_API_KEY!,
};

export const rateLimit: RateLimitConfig = {
    time: parseInt(process.env.RATE_LIMIT_TIME!) || 60000,
    maxMessages: parseInt(process.env.MAX_MESSAGES_PER_MINUTE!) || 5,
};