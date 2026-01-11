type RateLimitEntry = {
    count: number;
    resetTime: number;
};

// Simple in-memory store for rate limiting
// In a serverless/Edge environment, this might reset frequently, which is fine for "soft" limits.
// For strict enforcement, Redis or a database would be needed.
const requestStore = new Map<string, RateLimitEntry>();

// Configuration
const WINDOW_MS = 60 * 60 * 1000; // 1 hour window
const MAX_REQUESTS = 5; // 5 requests per window for guests

export const rateLimiter = {
    check: (ip: string) => {
        const now = Date.now();
        const entry = requestStore.get(ip);

        // If no entry or window expired, reset
        if (!entry || now > entry.resetTime) {
            requestStore.set(ip, {
                count: 1,
                resetTime: now + WINDOW_MS
            });
            return { allowed: true, remaining: MAX_REQUESTS - 1 };
        }

        // Check if limit exceeded
        if (entry.count >= MAX_REQUESTS) {
            return { 
                allowed: false, 
                remaining: 0,
                resetIn: Math.ceil((entry.resetTime - now) / 1000) 
            };
        }

        // Increment count
        entry.count++;
        return { 
            allowed: true, 
            remaining: MAX_REQUESTS - entry.count 
        };
    },
    
    // Optional: Prune expired entries to prevent memory leaks in long-running processes
    cleanup: () => {
        const now = Date.now();
        for (const [key, val] of requestStore.entries()) {
            if (now > val.resetTime) {
                requestStore.delete(key);
            }
        }
    }
};

// Cleanup periodically (every 10 mins)
if (typeof setInterval !== 'undefined') {
    setInterval(() => rateLimiter.cleanup(), 10 * 60 * 1000);
}
