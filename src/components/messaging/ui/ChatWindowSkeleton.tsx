// src/components/messaging/ui/ChatWindowSkeleton.tsx

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ChatWindowSkeleton = () => {
    return (
        <div className="flex-1 flex flex-col bg-background">
            <div className="border-b border-border p-4 flex items-center justify-between bg-slate-two">
                <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full mr-3 bg-slate" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-slate" />
                        <Skeleton className="h-3 w-16 bg-slate" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full bg-slate" />
                    <Skeleton className="h-8 w-8 rounded-full bg-slate" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-end">
                    <Skeleton className="h-16 w-48 rounded-lg bg-slate-two" />
                </div>
                <div className="flex justify-start">
                    <Skeleton className="h-16 w-48 rounded-lg bg-slate-two" />
                </div>
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32 rounded-lg bg-slate-two" />
                </div>
                <div className="flex justify-start">
                    <Skeleton className="h-12 w-40 rounded-lg bg-slate-two" />
                </div>
            </div>
            <div className="border-t border-border p-4 flex items-center bg-slate-two">
                <Skeleton className="h-10 w-full rounded-lg bg-slate" />
            </div>
        </div>
    );
};

export default ChatWindowSkeleton;
