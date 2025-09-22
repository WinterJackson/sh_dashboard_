// src/components/messaging/ChatWindow.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Conversation, Message } from "@/lib/definitions";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import VideoCall from "./VideoCall";
import IncomingCall from "./IncomingCall";
import SimplePeer, { SignalData } from "simple-peer";
import { useDebouncedCallback } from 'use-debounce';
import { ArrowLeft } from "lucide-react";

interface ChatWindowProps {
    socket: Socket | null;
    selectedConversation: Conversation | null;
    userId: string;
    onSendMessage: (content: string, file?: File, isUrgent?: boolean) => void;
    onlineUsers: string[];
    isTyping: boolean;
    replyingTo: Message | null;
    setReplyingTo: (message: Message | null) => void;
    messages: Message[];
    fetchNextPage: () => void;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    onToggleInfoPanel: () => void;
    onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    socket,
    selectedConversation,
    userId,
    onSendMessage,
    onlineUsers,
    isTyping,
    replyingTo,
    setReplyingTo,
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onToggleInfoPanel,
    onBack,
}) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerName, setCallerName] = useState("");
    const [callerSignal, setCallerSignal] = useState<SignalData | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [isRinging, setIsRinging] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Message[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchAttempted, setSearchAttempted] = useState(false);
    const [isVideoCall, setIsVideoCall] = useState(false);

    const userVideo = useRef<HTMLVideoElement>(null);
    const partnerVideo = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<SimplePeer.Instance>();
    const screenTrackRef = useRef<MediaStreamTrack | null>(null);
    const cameraTrackRef = useRef<MediaStreamTrack | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    const debouncedSearch = useDebouncedCallback(async (query) => {
        if (!query || !selectedConversation) {
            setSearchResults([]);
            setSearchAttempted(false);
            return;
        }
        setIsSearching(true);
        setSearchAttempted(true);
        try {
            const response = await fetch(`/api/messaging/messages/search?conversationId=${selectedConversation.conversationId}&query=${query}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, 500);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const handleSearchClose = () => {
        setSearchQuery("");
        setSearchResults([]);
        setSearchAttempted(false);
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("call-made", (data: { from: string; signal: SignalData; callerName: string; video: boolean }) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerName(data.callerName);
            setCallerSignal(data.signal);
            setIsVideoCall(data.video);
        });

        socket.on("call-ended", () => {
            setCallAccepted(false);
            setReceivingCall(false);
            setIsRinging(false);
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        });

        return () => {
            socket?.off("call-made");
            socket?.off("call-ended");
        };
    }, [socket]);

    const callPeer = (id: string, video: boolean) => {
        setIsVideoCall(video);
        navigator.mediaDevices
            .getUserMedia({ video: video, audio: true })
            .then((mediaStream: MediaStream) => {
                setStream(mediaStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = mediaStream;
                }
                if (video) {
                    cameraTrackRef.current = mediaStream.getVideoTracks()[0];
                }

                if (!socket) return;

                setIsRinging(true);
                const peer = new SimplePeer({
                    initiator: true,
                    trickle: false,
                    stream: mediaStream,
                });
                peerRef.current = peer;

                peer.on("signal", (data: SignalData) => {
                    socket.emit("call-user", {
                        userToCall: id,
                        signalData: data,
                        from: userId,
                        video: video,
                    });
                });

                peer.on("stream", (remoteStream: MediaStream) => {
                    if (partnerVideo.current) {
                        partnerVideo.current.srcObject = remoteStream;
                    }
                });

                socket.on("call-accepted", (signal: SignalData) => {
                    setIsRinging(false);
                    setCallAccepted(true);
                    peer.signal(signal);
                });
            });
    };

    const acceptCall = () => {
        navigator.mediaDevices
            .getUserMedia({ video: isVideoCall, audio: true })
            .then((mediaStream: MediaStream) => {
                setStream(mediaStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = mediaStream;
                }
                if (isVideoCall) {
                    cameraTrackRef.current = mediaStream.getVideoTracks()[0];
                }

                if (!socket) return;

                setCallAccepted(true);
                setReceivingCall(false);

                const peer = new SimplePeer({
                    initiator: false,
                    trickle: false,
                    stream: mediaStream,
                });
                peerRef.current = peer;

                peer.on("signal", (data: SignalData) => {
                    socket.emit("accept-call", { signal: data, to: caller });
                });

                peer.on("stream", (remoteStream: MediaStream) => {
                    if (partnerVideo.current) {
                        partnerVideo.current.srcObject = remoteStream;
                    }
                });

                if (callerSignal) {
                    peer.signal(callerSignal);
                }
            });
    };

    const endCall = () => {
        console.log("endCall: function called");
        if (mediaRecorderRef.current && isRecording) {
            console.log("endCall: stopping media recorder");
            mediaRecorderRef.current.stop();
        }

        if (!socket) {
            console.log("endCall: socket is null, returning");
            return;
        }

        const otherParticipant = selectedConversation?.participants.find(
            (p) => p.userId !== userId
        );

        if (otherParticipant) {
            console.log("endCall: emitting end-call to", otherParticipant.userId);
            socket.emit("end-call", { to: otherParticipant.userId });
        }

        console.log("endCall: resetting call states");
        setCallAccepted(false);
        setIsRinging(false);
        setReceivingCall(false);
        if (peerRef.current) {
            console.log("endCall: destroying peer");
            peerRef.current.destroy();
        }

        if (stream) {
            console.log("endCall: stopping stream tracks");
            stream.getTracks().forEach(track => track.stop());
        }
        if (screenTrackRef.current) {
            console.log("endCall: stopping screen track");
            screenTrackRef.current.stop();
        }

        console.log("endCall: getting new user media");
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((mediaStream: MediaStream) => {
                setStream(mediaStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = mediaStream;
                }
                cameraTrackRef.current = mediaStream.getVideoTracks()[0];
                console.log("endCall: successfully got new user media");
            });
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];
                screenTrackRef.current = screenTrack;
    
                if (peerRef.current && cameraTrackRef.current) {
                    peerRef.current.replaceTrack(cameraTrackRef.current, screenTrack, stream!);
                }
                setIsScreenSharing(true);
    
                screenTrack.onended = () => {
                    if (peerRef.current && cameraTrackRef.current && screenTrackRef.current) {
                        peerRef.current.replaceTrack(screenTrackRef.current, cameraTrackRef.current, stream!);
                    }
                    setIsScreenSharing(false);
                    screenTrackRef.current = null;
                };
            } catch (err) {
                console.error("Error sharing screen:", err);
            }
        } else {
            if (peerRef.current && cameraTrackRef.current && screenTrackRef.current) {
                peerRef.current.replaceTrack(screenTrackRef.current, cameraTrackRef.current, stream!);
                screenTrackRef.current.stop();
                screenTrackRef.current = null;
            }
            setIsScreenSharing(false);
        }
    };

    const handleToggleRecord = () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
        } else {
            const streamToRecord = partnerVideo.current?.srcObject as MediaStream;
            if (streamToRecord) {
                mediaRecorderRef.current = new MediaRecorder(streamToRecord);
                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunksRef.current.push(event.data);
                    }
                };
                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'recording.webm';
                    a.click();
                    recordedChunksRef.current = [];
                    setIsRecording(false);
                };
                mediaRecorderRef.current.start();
                setIsRecording(true);
            }
        }
    };

    const handleAudioCall = () => {
        const otherParticipant = selectedConversation?.participants.find(
            (p) => p.userId !== userId
        );
        if (otherParticipant?.user?.userId) {
            callPeer(otherParticipant.user.userId, false);
        }
    };

    const handleVideoCall = () => {
        const otherParticipant = selectedConversation?.participants.find(
            (p) => p.userId !== userId
        );
        if (otherParticipant?.user?.userId) {
            callPeer(otherParticipant.user.userId, true);
        }
    };

    if (!selectedConversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">
                        Select a conversation to start messaging
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-background h-full">
            <div className="flex items-center md:hidden p-2 border-b border-border">
                {onBack && (
                    <button onClick={onBack} className="p-2 hover:bg-accent rounded-full mr-2">
                        <ArrowLeft size={20} />
                    </button>
                )}
            </div>
            <ChatHeader
                userId={userId}
                conversation={selectedConversation}
                onlineUsers={onlineUsers}
                isTyping={isTyping}
                onAudioCall={handleAudioCall}
                onVideoCall={handleVideoCall}
                onToggleInfoPanel={onToggleInfoPanel}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchClose={handleSearchClose}
            />
            {isRinging && !receivingCall && (
                <div className="p-4 text-center">
                    Ringing...
                    <button onClick={endCall} className="ml-4 bg-red-500 text-white p-2 rounded-full">
                        Cancel Call
                    </button>
                </div>
            )}
            {receivingCall && (
                <IncomingCall
                    callerName={callerName}
                    onAccept={acceptCall}
                    onReject={() => setReceivingCall(false)}
                />
            )}
            {callAccepted ? (
                <VideoCall
                    stream={stream!}
                    partnerVideo={partnerVideo}
                    userVideo={userVideo}
                    onEndCall={endCall}
                    onToggleScreenShare={toggleScreenShare}
                    isScreenSharing={isScreenSharing}
                    onToggleRecord={handleToggleRecord}
                    isRecording={isRecording}
                    peer={peerRef}
                    video={isVideoCall}
                />
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto scrollbar-custom">
                        {searchAttempted ? (
                            <div className="p-4">
                                {isSearching ? (
                                    <div className="text-center text-muted-foreground">Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    <div>
                                        <h3 className="font-bold mb-2">Search Results ({searchResults.length})</h3>
                                        {searchResults.map(msg => (
                                            <div key={msg.messageId} className="p-2 border-b border-border">
                                                <p>{msg.content}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground">No results found for "{searchQuery}"</div>
                                )}
                            </div>
                        ) : (
                            <MessageList
                                socket={socket}
                                messages={messages}
                                currentUserId={userId}
                                setReplyingTo={setReplyingTo}
                                fetchNextPage={fetchNextPage}
                                hasNextPage={hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                            />
                        )}
                    </div>
                    <MessageInput
                        socket={socket}
                        onSend={onSendMessage}
                        conversationId={selectedConversation.conversationId}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                    />
                </>
            )}

        </div>
    );
};

export default ChatWindow;
