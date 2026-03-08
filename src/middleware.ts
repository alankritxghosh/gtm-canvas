import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
    redis: kv,
    // 10 requests per 1 hour
    limiter: Ratelimit.slidingWindow(10, '1 h'),
});

export async function middleware(request: NextRequest) {
    // True client IP on Vercel Edge + Fallbacks without easily spoofable headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // CORS & Origin verification
    const origin = request.headers.get('origin') || request.headers.get('referer');
    if (origin && !origin.includes('localhost') && !origin.includes('agentic-gtm-canvas.vercel.app')) {
        return NextResponse.json({ error: 'Unauthorized Origin' }, { status: 403 });
    }

    const { success, limit, reset, remaining } = await ratelimit.limit(
        `ratelimit_gtm_canvas_${ip}`
    );

    if (!success) {
        return NextResponse.json(
            { error: 'Too Many Requests' },
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

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/generate', '/api/expand'],
};
