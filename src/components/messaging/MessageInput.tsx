// src/components/messaging/MessageInput.tsx

"use client";

import React, { useState, useRef } from "react";
import { Socket } from "socket.io-client";
import {
    X,
    Image as ImageIcon,
    Video as VideoIcon,
    File as FileIcon,
    AlertTriangle,
    BookText,
    Mic,
    StopCircle,
    Play,
    Download
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Message } from "@/lib/definitions";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const templates = [
    {
        id: "reminder",
        title: "Appointment Reminder",
        text: "Just a friendly reminder that you have an upcoming appointment on [Date] at [Time]. Please let us know if you need to reschedule.",
    },
    {
        id: "follow-up",
        title: "Post-Appointment Follow-Up",
        text: "We hope you are recovering well. Please follow the post-appointment instructions we provided. If you have any questions, feel free to reach out.",
    },
    {
        id: "info-request",
        title: "Information Request",
        text: "To proceed with your request, we need some additional information. Please provide [Information Needed] at your earliest convenience.",
    },
];

interface MessageInputProps {
    socket: Socket | null;
    onSend: (message: string, file?: File, isUrgent?: boolean) => void;
    conversationId: string;
    replyingTo: Message | null;
    setReplyingTo: (message: Message | null) => void;
}

const MessageInput: React.FC<MessageInputProps> = React.memo(({
    socket,
    onSend,
    conversationId,
    replyingTo,
    setReplyingTo,
}) => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUrgent, setIsUrgent] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    const handleTyping = () => {
        if (socket) {
            socket.emit("typing", { conversationId });
        }
    };

    const handleSend = () => {
        if (audioFile) {
            onSend("", audioFile, isUrgent);
            setAudioFile(null);
            setAudioPreview(null);
            setIsUrgent(false);
        } else if (file) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/messaging/upload", true);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setUploadProgress(percentComplete);
                }
            };
            xhr.onload = () => {
                setUploadProgress(null);
                if (xhr.status === 200) {
                    onSend(message, file || undefined, isUrgent);
                    setMessage("");
                    setFile(null);
                    setPreview(null);
                    setIsUrgent(false);
                } else {
                    console.error("Upload failed");
                }
            };
            const formData = new FormData();
            formData.append("file", file);
            xhr.send(formData);
        } else if (message.trim()) {
            onSend(message, undefined, isUrgent);
            setMessage("");
            setIsUrgent(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (selectedFile.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setPreview(null);
            }
        }
    };

    const handleAttachmentClick = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    const clearAttachment = () => {
        setFile(null);
        setPreview(null);
    };

    const handleTemplateSelect = (templateText: string) => {
        setMessage(templateText);
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioPreview(audioUrl);
                const audioFile = new File([audioBlob], "voice-memo.webm", { type: "audio/webm" });
                setAudioFile(audioFile);
                recordedChunksRef.current = [];
            };
            mediaRecorderRef.current.start();
        }
        setIsRecording(!isRecording);
    };

    return (
        <div>
            {replyingTo && (
                <div className="p-2 bg-muted text-sm text-muted-foreground flex justify-between items-center">
                    <div>
                        <p className="font-bold">
                            Replying to {replyingTo.sender.username}
                        </p>
                        <p className="italic truncate">{replyingTo.content}</p>
                    </div>
                    <button onClick={() => setReplyingTo(null)}>
                        <X size={16} />
                    </button>
                </div>
            )}
            {preview && (
                <div className="p-2 relative">
                    <Image
                        src={preview}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="rounded-lg"
                    />
                    <button
                        onClick={clearAttachment}
                        className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            {audioPreview && (
                <div className="p-2 flex items-center gap-2 bg-muted rounded-lg">
                    <audio src={audioPreview} controls className="w-full" />
                    <a href={audioPreview} download="recording.webm" className="p-2 hover:bg-accent rounded-full">
                        <Download size={18} />
                    </a>
                    <button onClick={() => { setAudioPreview(null); setAudioFile(null); }} className="p-2 hover:bg-destructive rounded-full">
                        <X size={16} />
                    </button>
                </div>
            )}
            {uploadProgress !== null && (
                <div className="p-2">
                    <progress value={uploadProgress} max="100" className="w-full" />
                </div>
            )}
            <div className="border-t border-border p-2 sm:p-4 flex items-center bg-card">
                <div className="flex gap-1 sm:gap-2 mr-1 sm:mr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-full hover:bg-accent">
                                <BookText size={18} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {templates.map((template) => (
                                <DropdownMenuItem
                                    key={template.id}
                                    onSelect={() => handleTemplateSelect(template.text)}
                                >
                                    {template.title}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                        onClick={() => handleAttachmentClick(imageInputRef)}
                        className="p-2 rounded-full hover:bg-accent"
                    >
                        <ImageIcon size={18} />
                    </button>
                    <input
                        type="file"
                        ref={imageInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => handleAttachmentClick(videoInputRef)}
                        className="p-2 rounded-full hover:bg-accent"
                    >
                        <VideoIcon size={18} />
                    </button>
                    <input
                        type="file"
                        ref={videoInputRef}
                        style={{ display: "none" }}
                        accept="video/*"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => handleAttachmentClick(fileInputRef)}
                        className="p-2 rounded-full hover:bg-accent"
                    >
                        <FileIcon size={18} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleToggleRecording}
                        className={`p-2 rounded-full hover:bg-accent relative ${isRecording ? 'bg-red-500 text-white' : ''}`}>
                        {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
                        {isRecording && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>}
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg mr-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                />
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <Switch id="urgent-switch" checked={isUrgent} onCheckedChange={setIsUrgent} />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Label htmlFor="urgent-switch" className={`flex items-center ${isUrgent ? 'text-destructive' : ''}`}>
                                    <AlertTriangle className="mr-1 h-4 w-4" />
                                </Label>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Mark this message as urgent. The recipient will be notified.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <button
                    onClick={handleSend}
                    className="bg-primary text-primary-foreground p-2 rounded-lg ml-2 text-sm"
                >
                    Send
                </button>
            </div>
        </div>
    );
});

export default MessageInput;
