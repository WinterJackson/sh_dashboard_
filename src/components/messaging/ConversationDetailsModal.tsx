// src/components/messaging/ConversationDetailsModal.tsx

"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Conversation, User, Role } from "@/lib/definitions";
import Image from "next/image";
import { X, UserPlus } from "lucide-react";
import { useAddParticipant } from "@/hooks/useAddParticipant";
import { useFetchAllUsers } from "@/hooks/useFetchAllUsers";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession } from "next-auth/react";

interface ConversationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversation: Conversation | null;
    currentUserId: string;
}

const ConversationDetailsModal: React.FC<ConversationDetailsModalProps> = ({
    isOpen,
    onClose,
    conversation,
    currentUserId,
}) => {
    const { data: session } = useSession();
    const [openCombobox, setOpenCombobox] = useState(false);
    const { data: users, isLoading: isLoadingUsers } = useFetchAllUsers();
    const addParticipantMutation = useAddParticipant();

    if (!isOpen || !conversation) {
        return null;
    }

    const handleAddParticipant = (userId: string) => {
        addParticipantMutation.mutate({ conversationId: conversation.conversationId, userId });
        setOpenCombobox(false);
    };

    const existingParticipantIds = new Set(conversation.participants.map(p => p.userId));
    const availableUsers = users?.filter(user => !existingParticipantIds.has(user.userId));

    const canAddParticipants = session?.user?.role === Role.ADMIN || session?.user?.role === Role.SUPER_ADMIN;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Conversation Details</DialogTitle>
                    <DialogDescription>
                        Information about this conversation and its participants.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <h3 className="font-semibold mb-2">Participants</h3>
                    <div className="space-y-2">
                        {conversation.participants.map(p => p.user && (
                            <div key={p.userId} className="flex items-center gap-2">
                                <Image
                                    src={p.user.profile?.imageUrl || "/images/default-avatar.png"}
                                    alt={p.user.username}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <span>{p.user.profile?.firstName} {p.user.profile?.lastName} (@{p.user.username})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {canAddParticipants && (
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Participant
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search user..." className="h-9" />
                                <CommandEmpty>No user found.</CommandEmpty>
                                <CommandGroup>
                                    {availableUsers?.map((user) => (
                                        <CommandItem
                                            key={user.userId}
                                            onSelect={() => handleAddParticipant(user.userId)}
                                        >
                                            {user.username}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}

                <DialogClose asChild>
                    <Button variant="outline" onClick={onClose} className="mt-4">
                        Close
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default ConversationDetailsModal;
