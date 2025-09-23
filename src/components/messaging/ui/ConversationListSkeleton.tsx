// src/components/messaging/ui/ConversationListSkeleton.tsx

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ConversationListSkeleton = () => {
    return (
        <div className="w-full md:w-80 border-r border-border flex flex-col bg-card h-full">
            <div className="p-4 flex-shrink-0">
                <Skeleton className="h-10 w-full bg-slate-two" />
            </div>
            <div className="flex-grow overflow-y-auto">
                <ul>
                    {[...Array(10)].map((_, i) => (
                        <li key={i} className="p-3 flex items-center">
                            <Skeleton className="h-12 w-12 rounded-full mr-4 bg-slate-two" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-4 w-3/4 bg-slate-two" />
                                <Skeleton className="h-3 w-1/2 bg-slate-two" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ConversationListSkeleton;
