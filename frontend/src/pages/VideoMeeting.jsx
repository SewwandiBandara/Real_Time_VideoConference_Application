import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer from 'simple-peer';
import {
  MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdScreenShare,
  MdStopScreenShare, MdChat, MdDraw, MdCallEnd, MdAttachFile,
  MdPeople, MdMoreVert, MdSend, MdFullscreen, MdFullscreenExit
} from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import socketService from '../services/socket';
import { meetingAPI, fileAPI } from '../services/api';
import { toast } from 'react-toastify';

const VideoMeeting = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Media refs
  const userVideo = useRef();
  const screenVideo = useRef();

  // State for media controls
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State for UI panels
  const [showChat, setShowChat] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  // State for meeting data
  const [meeting, setMeeting] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Whiteboard state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#000000');
  const [drawWidth, setDrawWidth] = useState(2);

  // Refs for peer connections
  const peersRef = useRef([]);
  const streamRef = useRef();
  const screenStreamRef = useRef();

  // Initialize meeting on mount
  useEffect(() => {
    const initMeeting = async () => {
      try {
        // Get meeting info
        const { meeting: meetingData } = await meetingAPI.getMeetingByRoomId(roomId);
        setMeeting(meetingData);

        // Get user media
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });

        streamRef.current = mediaStream;
        setStream(mediaStream);

        if (userVideo.current) {
          userVideo.current.srcObject = mediaStream;
        }

        // Connect to socket
        socketService.connect();

        // Join room
        socketService.joinRoom(roomId, user?.id || 'guest', {
          name: user?.name || 'Guest',
          email: user?.email
        });

        // Setup socket listeners
        setupSocketListeners();

        // Join meeting on backend
        await meetingAPI.joinMeeting(
          roomId,
          user?.id,
          user?.name || 'Guest',
          null
        );

      } catch (error) {
        console.error('Error initializing meeting:', error);
        toast.error('Failed to join meeting. Please check your camera/microphone permissions.');
      }
    };

    initMeeting();

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      peersRef.current.forEach(peerObj => {
        if (peerObj.peer) {
          peerObj.peer.destroy();
        }
      });
      socketService.disconnect();
    };
  }, [roomId, user]);

  const setupSocketListeners = () => {
    const socket = socketService.getSocket();

    // Handle new user connected
    socket.on('user-connected', (userId, userData) => {
      toast.info(`${userData.name} joined the meeting`);

      // Create peer connection for new user
      const peer = createPeer(socket.id, userId, streamRef.current);

      peersRef.current.push({
        peerID: userId,
        peer,
        userData
      });

      setPeers(prevPeers => [...prevPeers, { peerID: userId, peer, userData }]);
    });

    // Handle existing users
    socket.on('current-users', (users) => {
      const peers = [];
      users.forEach(userInfo => {
        const peer = addPeer(socket.id, userInfo.userId, streamRef.current);
        peersRef.current.push({
          peerID: userInfo.userId,
          peer,
          userData: userInfo.userData
        });
        peers.push({ peerID: userInfo.userId, peer, userData: userInfo.userData });
      });
      setPeers(peers);
    });

    // Handle receiving offer
    socket.on('offer', ({ offer, sender }) => {
      const peer = addPeer(sender, sender, streamRef.current);
      peer.signal(offer);

      peersRef.current.push({
        peerID: sender,
        peer
      });

      setPeers(prevPeers => [...prevPeers, { peerID: sender, peer }]);
    });

    // Handle receiving answer
    socket.on('answer', ({ answer, sender }) => {
      const item = peersRef.current.find(p => p.peerID === sender);
      if (item) {
        item.peer.signal(answer);
      }
    });

    // Handle ICE candidate
    socket.on('ice-candidate', ({ candidate, sender }) => {
      const item = peersRef.current.find(p => p.peerID === sender);
      if (item) {
        item.peer.signal(candidate);
      }
    });

    // Handle user disconnected
    socket.on('user-disconnected', (userId) => {
      const item = peersRef.current.find(p => p.peerID === userId);
      if (item) {
        item.peer.destroy();
      }
      peersRef.current = peersRef.current.filter(p => p.peerID !== userId);
      setPeers(prevPeers => prevPeers.filter(p => p.peerID !== userId));

      toast.info('A user left the meeting');
    });

    // Handle chat messages
    socket.on('receive-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    // Handle whiteboard drawing
    socket.on('whiteboard-draw', (data) => {
      drawOnCanvas(data);
    });

    // Handle whiteboard clear
    socket.on('whiteboard-clear', () => {
      clearCanvas();
    });

    // Handle screen sharing
    socket.on('user-screen-sharing', ({ userId, isSharing }) => {
      if (isSharing) {
        toast.info('Someone started screen sharing');
      }
    });

    // Handle video toggle
    socket.on('user-video-toggled', ({ userId, enabled }) => {
      // Update peer video state
      const peer = peersRef.current.find(p => p.peerID === userId);
      if (peer) {
        peer.videoEnabled = enabled;
      }
    });

    // Handle audio toggle
    socket.on('user-audio-toggled', ({ userId, enabled }) => {
      // Update peer audio state
      const peer = peersRef.current.find(p => p.peerID === userId);
      if (peer) {
        peer.audioEnabled = enabled;
      }
    });
  };

  const createPeer = (mySocketId, userToSignal, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketService.sendOffer(userToSignal, signal, mySocketId);
    });

    return peer;
  };

  const addPeer = (mySocketId, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketService.sendAnswer(callerID, signal, mySocketId);
    });

    return peer;
  };

  // Media controls
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        socketService.toggleVideo(roomId, user?.id || 'guest', videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        socketService.toggleAudio(roomId, user?.id || 'guest', audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false
        });

        screenStreamRef.current = screenStream;
        setScreenStream(screenStream);
        setIsScreenSharing(true);

        if (screenVideo.current) {
          screenVideo.current.srcObject = screenStream;
        }

        socketService.startScreenShare(roomId, user?.id || 'guest');

        // Handle screen share stop
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };

      } catch (error) {
        console.error('Error sharing screen:', error);
        toast.error('Failed to share screen');
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
      setIsScreenSharing(false);
      socketService.stopScreenShare(roomId, user?.id || 'guest');
    }
  };

  const leaveMeeting = () => {
    if (window.confirm('Are you sure you want to leave the meeting?')) {
      navigate('/dashboard');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Chat functions
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socketService.sendMessage(
        roomId,
        user?.id || 'guest',
        user?.name || 'Guest',
        newMessage
      );
      setNewMessage('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Whiteboard functions
  const startDrawing = (e) => {
    if (!showWhiteboard) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !showWhiteboard) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Send drawing data to other users
    socketService.sendDrawData(roomId, {
      x,
      y,
      color: drawColor,
      width: drawWidth,
      action: 'draw'
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawOnCanvas = (data) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(data.x, data.y);
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.width;
    ctx.stroke();
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const clearWhiteboard = () => {
    clearCanvas();
    socketService.clearWhiteboard(roomId);
  };

  // File upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.info('Uploading file...');
      const response = await fileAPI.uploadFile(file, meeting?.id);
      toast.success('File uploaded successfully!');

      // Notify participants about new file
      socketService.sendMessage(
        roomId,
        user?.id || 'guest',
        user?.name || 'Guest',
        `Shared a file: ${file.name}`,
        'file'
      );
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
    }
  };

  if (!meeting) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading meeting...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-white text-lg font-semibold">{meeting.title}</h1>
          <p className="text-gray-400 text-sm">Room ID: {roomId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-700 rounded-lg text-white"
          >
            {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
          </button>
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 hover:bg-gray-700 rounded-lg text-white flex items-center space-x-2"
          >
            <MdPeople size={24} />
            <span>{peers.length + 1}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {/* User's video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
              <video
                ref={userVideo}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                {user?.name || 'You'} (You)
              </div>
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl">
                    {(user?.name || 'U')[0].toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Screen share video */}
            {isScreenSharing && (
              <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video md:col-span-2">
                <video
                  ref={screenVideo}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                  Your Screen
                </div>
              </div>
            )}

            {/* Peer videos */}
            {peers.map((peer, index) => (
              <VideoCard key={index} peer={peer} />
            ))}
          </div>

          {/* Whiteboard Overlay */}
          {showWhiteboard && (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex flex-col">
              <div className="bg-gray-800 p-4 flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold">Whiteboard</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={drawColor}
                    onChange={(e) => setDrawColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={drawWidth}
                    onChange={(e) => setDrawWidth(parseInt(e.target.value))}
                    className="w-24"
                  />
                  <button
                    onClick={clearWhiteboard}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowWhiteboard(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={800}
                  className="bg-white rounded-lg cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white text-lg font-semibold">Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="text-blue-400 text-sm font-semibold">{msg.userName}</div>
                  <div className="text-white text-sm mt-1">{msg.message}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                  <MdSend size={24} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800 px-4 py-4 flex items-center justify-center space-x-4">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full ${
            isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          } text-white transition-colors`}
        >
          {isAudioEnabled ? <MdMic size={24} /> : <MdMicOff size={24} />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          } text-white transition-colors`}
        >
          {isVideoEnabled ? <MdVideocam size={24} /> : <MdVideocamOff size={24} />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-4 rounded-full ${
            isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
          } text-white transition-colors`}
        >
          {isScreenSharing ? <MdStopScreenShare size={24} /> : <MdScreenShare size={24} />}
        </button>

        <button
          onClick={() => setShowChat(!showChat)}
          className={`p-4 rounded-full ${
            showChat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
          } text-white transition-colors`}
        >
          <MdChat size={24} />
        </button>

        <button
          onClick={() => setShowWhiteboard(!showWhiteboard)}
          className={`p-4 rounded-full ${
            showWhiteboard ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
          } text-white transition-colors`}
        >
          <MdDraw size={24} />
        </button>

        <label className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white cursor-pointer transition-colors">
          <MdAttachFile size={24} />
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          onClick={leaveMeeting}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors ml-4"
        >
          <MdCallEnd size={24} />
        </button>
      </div>
    </div>
  );
};

// Video Card Component for Peers
const VideoCard = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    if (peer.peer) {
      peer.peer.on('stream', stream => {
        if (ref.current) {
          ref.current.srcObject = stream;
        }
      });
    }
  }, [peer]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      <video
        ref={ref}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
        {peer.userData?.name || 'Guest'}
      </div>
    </div>
  );
};

export default VideoMeeting;
