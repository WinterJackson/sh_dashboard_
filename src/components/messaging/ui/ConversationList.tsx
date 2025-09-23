// src/components/messaging/ui/ConversationList.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Conversation } from '@/lib/definitions';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  userId: string;
  onlineUsers: string[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

const ConversationList: React.FC<ConversationListProps> = React.memo(({
    conversations, 
    selectedConversationId, 
    onSelectConversation, 
    userId, 
    onlineUsers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
        fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const filteredConversations = useMemo(() => conversations.filter(conv => {
      const otherParticipant = conv.participants.find(p => p.user?.userId !== userId);
      const name = otherParticipant?.user?.profile?.firstName || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
  }), [conversations, searchTerm, userId]);

  return (
    <div className="w-full border-r border-border flex flex-col bg-card h-full">
      <div className="p-2 sm:p-4 flex-shrink-0 border-b border-border">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full p-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-custom">
        <ul>
          {filteredConversations.map((conv) => {
            const otherParticipant = conv.participants.find(
              (p) => p.user?.userId !== userId
            );
            const isOnline = otherParticipant?.user?.userId
              ? onlineUsers.includes(otherParticipant.user.userId)
              : false;
            const unreadCount = conv.messages.filter(
              (m) => !m.readReceipts?.some((r) => r.userId === userId)
            ).length;

            return (
              <li
                key={conv.conversationId}
                onClick={() => onSelectConversation(conv.conversationId)}
                className={`p-2 sm:p-3 cursor-pointer flex items-center border-b border-border transition-colors ${
                  selectedConversationId === conv.conversationId
                    ? "bg-primary/20"
                    : "hover:bg-accent"
                }`}
              >
                <div className="relative mr-3 sm:mr-4">
                  <Image
                    src={
                      otherParticipant?.user?.profile?.imageUrl ||
                      "/images/default-avatar.png"
                    }
                    alt="avatar"
                    width={48}
                    height={48}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-constructive ring-2 ring-card"></span>
                  )}
                </div>
                <div className="flex-grow overflow-hidden w-1/2">
                  <div className="flex justify-between">
                    <p className="font-semibold text-foreground truncate text-sm sm:text-base">
                      {otherParticipant?.user?.profile?.firstName || "Unknown"}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {new Date(
                        conv.lastMessageAt || conv.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {conv.messages?.[0]?.content || "No messages yet"}
                    </p>
                    {unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 ml-2 flex-shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={ref} className="h-1" />
        {isFetchingNextPage && <p className="text-center py-2 text-muted-foreground text-sm">Loading more...</p>}
      </div>
    </div>
  );
});

export default ConversationList;
