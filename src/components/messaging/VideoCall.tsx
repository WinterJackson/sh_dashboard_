// src/components/messaging/VideoCall.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, Circle } from 'lucide-react';

interface VideoCallProps {
  stream: MediaStream;
  partnerVideo: React.RefObject<HTMLVideoElement>;
  userVideo: React.RefObject<HTMLVideoElement>;
  onEndCall: () => void;
  onToggleScreenShare: () => void;
  isScreenSharing: boolean;
  onToggleRecord: () => void;
  isRecording: boolean;
  peer: React.RefObject<any>;
  video: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ stream, partnerVideo, userVideo, onEndCall, onToggleScreenShare, isScreenSharing, onToggleRecord, isRecording, peer, video }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<'good' | 'fair' | 'poor'>('good');

  useEffect(() => {
    const interval = setInterval(() => {
      if (peer.current) {
        peer.current.getStats((err: any, stats: any[]) => {
          if (err) {
            console.error(err);
            return;
          }
          const transportStats = stats.find(s => s.type === 'transport');
          if (transportStats) {
            const rtt = transportStats.currentRoundTripTime;
            if (rtt < 0.1) setNetworkQuality('good');
            else if (rtt < 0.3) setNetworkQuality('fair');
            else setNetworkQuality('poor');
          }
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [peer]);

  const toggleMute = () => {
    stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    stream.getVideoTracks().forEach(track => track.enabled = !isCameraOff);
    setIsCameraOff(!isCameraOff);
  };

  const qualityColor = {
    good: 'bg-green-500',
    fair: 'bg-yellow-500',
    poor: 'bg-red-500',
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        {video ? (
            <>
                <video ref={partnerVideo} playsInline autoPlay className="w-full h-full object-cover" />
                <video ref={userVideo} playsInline autoPlay muted className="absolute bottom-24 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white" />
            </>
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white">
                <p className="text-2xl">Audio Call</p>
            </div>
        )}
        <div className={`absolute top-4 left-4 h-4 w-4 rounded-full ${qualityColor[networkQuality]}`}></div>
      </div>
      <div className="absolute bottom-8 flex items-center justify-center w-full">
        <div className="flex gap-4 bg-gray-800/50 p-4 rounded-full">
            <button onClick={toggleMute} className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-500'} text-white hover:bg-gray-600`}>
                {isMuted ? <MicOff /> : <Mic />}
            </button>
            {video && (
                <button onClick={toggleCamera} className={`p-3 rounded-full ${isCameraOff ? 'bg-red-500' : 'bg-gray-500'} text-white hover:bg-gray-600`}>
                    {isCameraOff ? <VideoOff /> : <Video />}
                </button>
            )}
            {video && (
                <button onClick={onToggleScreenShare} className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500' : 'bg-gray-500'} text-white hover:bg-gray-600`}>
                    <ScreenShare />
                </button>
            )}
            <button onClick={onToggleRecord} className={`p-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-500'} text-white hover:bg-gray-600`}>
                <Circle />
            </button>
            <button onClick={onEndCall} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600">
                <PhoneOff />
            </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
