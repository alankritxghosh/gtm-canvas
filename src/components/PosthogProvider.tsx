"use client";

import React, { useEffect } from 'react';
import posthog from 'posthog-js';

// Setup posthog instance, if process.env.NEXT_PUBLIC_POSTHOG_KEY is not available it won't initialize.
export function PostHogProvider() {
    useEffect(() => {
        if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host: '/ingest',
                ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
                defaults: '2026-01-30',
                capture_exceptions: true,
                loaded: (posthog) => {
                    if (process.env.NODE_ENV === 'development') posthog.debug()
                }
            })
        }
    }, []);

    return <></>;
}
