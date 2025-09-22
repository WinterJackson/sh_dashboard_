// src/components/messaging/ChatHeader.tsx

import Image from "next/image";
import React from "react";
import { Conversation, Role } from "@/lib/definitions";
import { Phone, Info, Video, Lock, User, Search, X } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface ChatHeaderProps {
    userId: string;
    conversation: Conversation | null;
    onlineUsers: string[];
    isTyping: boolean;
    onAudioCall: () => void;
    onVideoCall: () => void;
    onToggleInfoPanel: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearchClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({
    userId,
    conversation,
    onlineUsers,
    isTyping,
    onAudioCall,
    onVideoCall,
    onToggleInfoPanel,
    searchQuery,
    onSearchChange,
    onSearchClose,
}) => {
    const [isSearchVisible, setIsSearchVisible] = React.useState(false);

    if (!conversation) {
        return (
            <div className="border-b border-border p-2 sm:p-4 flex items-center justify-between bg-card">
                <div></div>
                <div></div>
            </div>
        );
    }

    const otherParticipant = conversation.participants.find(
        (p) => p.user?.userId !== userId
    )?.user;

    const patientParticipant = conversation.participants.find(
        (p) => p.user?.role === Role.PATIENT
    )?.user;

    const isOnline = otherParticipant
        ? onlineUsers.includes(otherParticipant.userId)
        : false;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    const handleCloseSearch = () => {
        setIsSearchVisible(false);
        onSearchClose();
    };

    return (
        <div className="border-b border-l border-border p-2 sm:p-4 flex items-center justify-between bg-slate-two">
            <div className="flex items-center">
                <div className="relative mr-2 sm:mr-3">
                    <Image
                        src={
                            otherParticipant?.profile?.imageUrl ||
                            "/images/default-avatar.png"
                        }
                        alt="avatar"
                        width={40}
                        height={40}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    />
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-constructive border-2 border-card"></span>
                    )}
                </div>
                <div>
                    <p className="font-medium text-foreground text-sm sm:text-base">
                        {otherParticipant?.profile?.firstName || "Unknown"}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
                {isSearchVisible ? (
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="p-1 rounded-md border w-24 sm:w-auto"
                        />
                        <button onClick={handleCloseSearch} className="p-1 sm:p-2 hover:bg-accent rounded-full">
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => setIsSearchVisible(true)} className="p-1 sm:p-2 hover:bg-accent rounded-full">
                                    <Search size={18} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Search Messages</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Lock size={16} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Messages are end-to-end encrypted.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {patientParticipant && patientParticipant.patient && (
                        <Link href={`/dashboard/patients/${patientParticipant.patient.patientId}`} passHref>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="p-1 sm:p-2 hover:bg-accent rounded-full">
                                            <User size={18} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View Patient Chart</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Link>
                    )}
                    <button
                        onClick={onAudioCall}
                        disabled={!otherParticipant}
                        className="p-1 sm:p-2 hover:bg-accent rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Phone size={18} />
                    </button>
                    <button
                        onClick={onVideoCall}
                        disabled={!otherParticipant}
                        className="p-1 sm:p-2 hover:bg-accent rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Video size={18} />
                    </button>
                </div>
                <button
                    onClick={onToggleInfoPanel}
                    className="p-1 sm:p-2 hover:bg-accent rounded-full"
                >
                    <Info size={18} />
                </button>
            </div>
        </div>
    );
});

export default ChatHeader;
