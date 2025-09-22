// src/components/messaging/ConversationListSkeleton.tsx

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ConversationListSkeleton = () => {
    return (
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
            <div className="p-4 flex-shrink-0">
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex-grow overflow-y-auto">
                <ul>
                    {[...Array(10)].map((_, i) => (
                        <li key={i} className="p-3 flex items-center">
                            <Skeleton className="h-12 w-12 rounded-full mr-4" />
                            <div className="flex-grow">
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ConversationListSkeleton;
