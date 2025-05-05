import { rateLimit } from '../config/config';

interface UserRate {
    timestamps: number[];
    lastWarning?: number;
}

class RateLimiter {
    private userRates: Map<string, UserRate>;

    constructor() {
        this.userRates = new Map();
    }

    isRateLimited(userId: string): boolean {
        const now = Date.now();
        const userRate = this.getUserRate(userId);

        // Clean up old timestamps
        userRate.timestamps = userRate.timestamps.filter(
            timestamp => now - timestamp < rateLimit.time
        );

        // Check if user has exceeded rate limit
        if (userRate.timestamps.length >= rateLimit.maxMessages) {
            return true;
        }

        // Add new timestamp
        userRate.timestamps.push(now);
        return false;
    }
    // Check if user is rate limited and send warning if necessary
    getRemainingTime(userId: string): number {
        const userRate = this.getUserRate(userId);
        const now = Date.now();
        
        if (userRate.timestamps.length < rateLimit.maxMessages) {
            return 0;
        }

        const oldestTimestamp = userRate.timestamps[0];
        return (oldestTimestamp + rateLimit.time) - now;
    }

    private getUserRate(userId: string): UserRate {
        let userRate = this.userRates.get(userId);
        if (!userRate) {
            userRate = { timestamps: [] };
            this.userRates.set(userId, userRate);
        }
        return userRate;
    }
}

export const rateLimiter = new RateLimiter();