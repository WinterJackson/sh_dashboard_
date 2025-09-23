// src/components/messaging/ui/LinkPreview.tsx

import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LinkPreviewProps {
    url: string;
}

interface PreviewData {
    title: string;
    description: string;
    image: string;
    url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
    const [preview, setPreview] = useState<PreviewData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Call the new backend API route
                const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch link preview');
                }
                const data = await response.json();
                setPreview(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreview();
    }, [url]);

    if (isLoading) {
        return (
            <div className="border rounded-lg overflow-hidden flex my-2">
                <Skeleton className="w-32 h-32" />
                <div className="p-4 space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        );
    }

    if (error || !preview) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline my-2 block"
            >
                {url}
            </a>
        );
    }

    return (
        <a
            href={preview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block my-2"
        >
            <div className="border rounded-lg overflow-hidden flex bg-background hover:bg-slate-two/50 transition-colors">
                {preview.image && (
                    <img
                        src={preview.image}
                        alt={preview.title}
                        className="w-32 h-32 object-cover"
                    />
                )}
                <div className="p-4">
                    <h3 className="font-bold">{preview.title}</h3>
                    <p className="text-sm text-gray-500">{preview.description}</p>
                </div>
            </div>
        </a>
    );
};

export default LinkPreview;
