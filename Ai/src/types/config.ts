export interface ClientConfig {
    token: string;
    clientId: string;
    guildId: string;
    aiChannelId: string;
    geminiApiKey: string;
}

export interface RateLimitConfig {
    time: number;
    maxMessages: number;
}

export interface UserChatHistory {
    role: string;
    parts: string;
}