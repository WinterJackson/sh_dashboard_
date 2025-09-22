// src/app/api/link-preview/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch link preview from external API');
        }
        const data = await response.json();

        // Basic sanitization/selection of fields
        const sanitizedData = {
            title: data.title,
            description: data.description,
            image: data.image,
            url: data.url,
        };

        return NextResponse.json(sanitizedData);
    } catch (error) {
        console.error('Link preview error:', error);
        return NextResponse.json({ error: 'Failed to fetch link preview' }, { status: 500 });
    }
}
