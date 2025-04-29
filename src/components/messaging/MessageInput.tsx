// src/components/messaging/MessageInput.tsx

import React, { useState } from "react";

interface MessageInputProps {
    onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <div className="border-t border-gray-200 p-4 flex items-center">
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded mr-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSend();
                    }
                }}
            />
            <button
                onClick={handleSend}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Send
            </button>
        </div>
    );
};

export default MessageInput;
