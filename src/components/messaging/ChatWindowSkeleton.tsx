// src/components/messaging/ChatWindowSkeleton.tsx

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ChatWindowSkeleton = () => {
    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex justify-end mb-2">
                    <Skeleton className="h-16 w-48 rounded-lg" />
                </div>
                <div className="flex justify-start mb-2">
                    <Skeleton className="h-16 w-48 rounded-lg" />
                </div>
                <div className="flex justify-end mb-2">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <div className="flex justify-start mb-2">
                    <Skeleton className="h-12 w-40 rounded-lg" />
                </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center bg-gray-50 dark:bg-gray-800">
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    );
};

export default ChatWindowSkeleton;
