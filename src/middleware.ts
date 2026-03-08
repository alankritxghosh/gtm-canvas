import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit: Ratelimit | null = null;
try {
    const redis = new Redis({
        url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
        token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
    });
    ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(10, '1 h'),
    });
} catch (error) {
    console.error("Failed to initialize Upstash Redis:", error);
}

export async function middleware(request: NextRequest) {
    // True client IP on Vercel Edge + Fallbacks without easily spoofable headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // CORS & Origin verification 
    const origin = request.headers.get('origin') || request.headers.get('referer');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

    // Loosened Origin check to allow any Vercel domain during preview/launch, and the explicit NEXT_PUBLIC_SITE_URL
    if (origin && !origin.includes('localhost') && !origin.includes('vercel.app') && (!siteUrl || !origin.includes(siteUrl))) {
        return NextResponse.json({ error: 'Unauthorized Origin. Please update NEXT_PUBLIC_SITE_URL.' }, { status: 403 });
    }

    if (!ratelimit) {
        return NextResponse.json({ error: 'Internal Security Error: Upstash Redis not configured. Check Environment Variables.' }, { status: 500 });
    }

    try {
        const { success, limit, reset, remaining } = await ratelimit.limit(
            `ratelimit_gtm_canvas_${ip}`
        );

        if (!success) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Too many requests.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString(),
                    },
                }
            );
        }
    } catch (e) {
        console.error("Rate limit check failed:", e);
        return NextResponse.json({ error: 'Rate limit engine failed to respond. Check Upstash configuration.' }, { status: 500 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/generate', '/api/expand'],
};
