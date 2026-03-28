import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

interface RateLimitResult {
  allowed: boolean;
  response?: NextResponse;
  limit?: number;
  remaining?: number;
  reset?: number;
}

// Initialize Upstash Ratelimit (lazy - only when called)
let ratelimit: Ratelimit | null = null;

function getRatelimit() {
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute per IP
      analytics: true,
      prefix: 'car-wala',
    });
  }
  return ratelimit;
}

export async function applyRateLimit(key: string): Promise<RateLimitResult> {
  // Always enforce in production
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true };
  }

  try {
    const { success, limit, reset, remaining } = await getRatelimit().limit(key);

    if (!success) {
      return {
        allowed: false,
        response: NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        ),
        limit,
        remaining,
        reset,
      };
    }

    return {
      allowed: true,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    // Fail open if Upstash is unavailable - log error but allow request
    console.error('Rate limiting error:', error instanceof Error ? error.message : 'Unknown error');
    return { allowed: true };
  }
}