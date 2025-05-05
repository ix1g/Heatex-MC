import { rateLimit } from '../config/config';

class RateLimiter {
    private userTimestamps: Map<string, number[]>;

    constructor() {
        this.userTimestamps = new Map();
    }

    isRateLimited(userId: string): boolean {
        const now = Date.now();
        const timestamps = this.userTimestamps.get(userId) || [];
        
        // Remove timestamps older than the rate limit window
        const recentTimestamps = timestamps.filter(
            timestamp => now - timestamp < rateLimit.time
        );

        // Update timestamps
        this.userTimestamps.set(userId, recentTimestamps);

        // Check if user has exceeded rate limit
        if (recentTimestamps.length >= rateLimit.maxMessages) {
            return true;
        }

        // Add new timestamp
        recentTimestamps.push(now);
        this.userTimestamps.set(userId, recentTimestamps);
        return false;
    }

    getRemainingTime(userId: string): number {
        const timestamps = this.userTimestamps.get(userId) || [];
        if (timestamps.length === 0) return 0;

        const oldestTimestamp = Math.min(...timestamps);
        const timeLeft = rateLimit.time - (Date.now() - oldestTimestamp);
        return Math.max(0, timeLeft);
    }
}
// Well i am cookin just let me finish this
export const rateLimiter = new RateLimiter();