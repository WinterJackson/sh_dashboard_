// src/components/messaging/IncomingCall.tsx

import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';

interface IncomingCallProps {
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCall: React.FC<IncomingCallProps> = ({ callerName, onAccept, onReject }) => {
  return (
    <div className="fixed top-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg z-50 flex items-center space-x-4">
      <div className="flex-grow">
        <p className="text-white">Incoming call from</p>
        <p className="font-bold text-white">{callerName}</p>
      </div>
      <div className="flex space-x-2">
        <button onClick={onAccept} className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600">
            <Phone />
        </button>
        <button onClick={onReject} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600">
            <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default IncomingCall;
