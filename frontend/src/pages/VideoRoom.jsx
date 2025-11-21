import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaPhone, FaComment, FaCopy, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BACKEND_URL = 'http://localhost:5001';

const VideoRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();

  // User info
  const [currentUser, setCurrentUser] = useState(null);

  // Media states
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState(new Map());
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // UI states
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [participants, setParticipants] = useState([]);

  // Refs
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const peersRef = useRef(new Map());
  const screenStreamRef = useRef(null);

  // Initialize media and socket connection
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.name) {
      toast.error('Please sign in first');
      navigate('/signin');
      return;
    }
    setCurrentUser(user);

    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Connect to socket
        const socket = io(BACKEND_URL);
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Connected to signaling server');
          socket.emit('join-room', {
            roomId: meetingId,
            userId: user.id,
            userName: user.name
          });
        });

        // Existing participants in the room
        socket.on('existing-participants', (existingUsers) => {
          console.log('Existing participants:', existingUsers);
          existingUsers.forEach(participant => {
            createPeerConnection(participant.socketId, participant.userName, true, stream);
          });
          setParticipants(prev => [...prev, ...existingUsers]);
        });

        // New user joined
        socket.on('user-joined', ({ socketId, userName, userId }) => {
          console.log('User joined:', userName);
          toast.info(`${userName} joined the meeting`);
          setParticipants(prev => [...prev, { socketId, userName, userId }]);
        });

        // Receive offer
        socket.on('offer', ({ offer, from, userName }) => {
          console.log('Received offer from:', userName);
          createPeerConnection(from, userName, false, stream, offer);
        });

        // Receive answer
        socket.on('answer', ({ answer, from }) => {
          console.log('Received answer from:', from);
          const peer = peersRef.current.get(from);
          if (peer) {
            peer.signal(answer);
          }
        });

        // Receive ICE candidate
        socket.on('ice-candidate', ({ candidate, from }) => {
          const peer = peersRef.current.get(from);
          if (peer) {
            peer.signal(candidate);
          }
        });

        // User left
        socket.on('user-left', ({ socketId, userName }) => {
          console.log('User left:', userName);
          toast.info(`${userName} left the meeting`);
          removePeer(socketId);
          setParticipants(prev => prev.filter(p => p.socketId !== socketId));
        });

        // Chat message
        socket.on('chat-message', ({ message, userName, userId, timestamp }) => {
          setChatMessages(prev => [...prev, { message, userName, userId, timestamp }]);
        });

        // User media toggle
        socket.on('user-media-toggle', ({ socketId, type, enabled }) => {
          setPeers(prevPeers => {
            const newPeers = new Map(prevPeers);
            const peerData = newPeers.get(socketId);
            if (peerData) {
              newPeers.set(socketId, {
                ...peerData,
                [type]: enabled
              });
            }
            return newPeers;
          });
        });
      })
      .catch(err => {
        console.error('Error accessing media devices:', err);
        toast.error('Failed to access camera/microphone. Please check permissions.');
      });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-room', { roomId: meetingId });
        socketRef.current.disconnect();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      peersRef.current.forEach(peer => peer.destroy());
    };
  }, [meetingId, navigate]);

  // Create peer connection
  const createPeerConnection = (socketId, userName, initiator, stream, offer = null) => {
    const peer = new Peer({
      initiator,
      trickle: true,
      stream
    });

    peer.on('signal', signal => {
      if (signal.type === 'offer') {
        socketRef.current.emit('offer', {
          offer: signal,
          to: socketId,
          from: socketRef.current.id,
          userName: currentUser?.name
        });
      } else if (signal.type === 'answer') {
        socketRef.current.emit('answer', {
          answer: signal,
          to: socketId,
          from: socketRef.current.id
        });
      } else {
        // ICE candidate
        socketRef.current.emit('ice-candidate', {
          candidate: signal,
          to: socketId,
          from: socketRef.current.id
        });
      }
    });

    peer.on('stream', remoteStream => {
      console.log('Received remote stream from:', userName);
      setPeers(prevPeers => {
        const newPeers = new Map(prevPeers);
        newPeers.set(socketId, {
          peer,
          stream: remoteStream,
          userName,
          socketId,
          audio: true,
          video: true
        });
        return newPeers;
      });
    });

    peer.on('error', err => {
      console.error('Peer error:', err);
    });

    if (offer) {
      peer.signal(offer);
    }

    peersRef.current.set(socketId, peer);
  };

  // Remove peer connection
  const removePeer = (socketId) => {
    const peer = peersRef.current.get(socketId);
    if (peer) {
      peer.destroy();
      peersRef.current.delete(socketId);
    }
    setPeers(prevPeers => {
      const newPeers = new Map(prevPeers);
      newPeers.delete(socketId);
      return newPeers;
    });
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
        socketRef.current.emit('toggle-media', {
          roomId: meetingId,
          type: 'audio',
          enabled: audioTrack.enabled
        });
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
        socketRef.current.emit('toggle-media', {
          roomId: meetingId,
          type: 'video',
          enabled: videoTrack.enabled
        });
      }
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }

      // Switch back to camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Replace tracks for all peers
      peersRef.current.forEach(peer => {
        const videoTrack = stream.getVideoTracks()[0];
        const sender = peer._pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      setIsScreenSharing(false);
      socketRef.current.emit('stop-screen-share', {
        roomId: meetingId,
        userId: currentUser.id
      });
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;

        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        // Replace video track for all peers
        peersRef.current.forEach(peer => {
          const screenTrack = screenStream.getVideoTracks()[0];
          const sender = peer._pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        // Handle screen share stop
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
        socketRef.current.emit('start-screen-share', {
          roomId: meetingId,
          userId: currentUser.id,
          userName: currentUser.name
        });
      } catch (err) {
        console.error('Error sharing screen:', err);
        toast.error('Failed to share screen');
      }
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (messageInput.trim() && socketRef.current) {
      socketRef.current.emit('chat-message', {
        roomId: meetingId,
        message: messageInput,
        userName: currentUser.name,
        userId: currentUser.id
      });
      setMessageInput('');
    }
  };

  // Leave meeting
  const leaveMeeting = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId: meetingId });
      socketRef.current.disconnect();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    peersRef.current.forEach(peer => peer.destroy());
    navigate('/dashboard');
  };

  // Copy meeting link
  const copyMeetingLink = () => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
    toast.success('Meeting link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">VideoFlow Meeting</h1>
          <button
            onClick={copyMeetingLink}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            <FaCopy />
            <span className="text-sm">Copy Link</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
            <FaUsers />
            <span className="text-sm">{participants.length + 1} Participants</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Grid */}
        <div className={`flex-1 p-4 ${showChat ? 'pr-2' : ''}`}>
          <div className={`grid gap-4 h-full ${
            peers.size === 0 ? 'grid-cols-1' :
            peers.size === 1 ? 'grid-cols-2' :
            peers.size <= 4 ? 'grid-cols-2 grid-rows-2' :
            'grid-cols-3'
          }`}>
            {/* Local Video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded">
                <span className="text-sm font-medium">{currentUser?.name} (You)</span>
              </div>
              {!videoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold">{currentUser?.name?.charAt(0)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Remote Videos */}
            {Array.from(peers.values()).map(({ stream, userName, socketId, video }) => (
              <div key={socketId} className="relative bg-gray-800 rounded-lg overflow-hidden">
                <video
                  autoPlay
                  playsInline
                  ref={ref => {
                    if (ref) ref.srcObject = stream;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded">
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                {!video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                    <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold">{userName?.charAt(0)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-96 bg-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{msg.userName}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition ${
              audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
            title={audioEnabled ? 'Mute' : 'Unmute'}
          >
            {audioEnabled ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition ${
              videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
            title={videoEnabled ? 'Stop Video' : 'Start Video'}
          >
            {videoEnabled ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition ${
              isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          >
            <FaDesktop size={24} />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-full transition ${
              showChat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Toggle Chat"
          >
            <FaComment size={24} />
          </button>

          <button
            onClick={leaveMeeting}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition"
            title="Leave Meeting"
          >
            <FaPhone size={24} className="rotate-135" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
