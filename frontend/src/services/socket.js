import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket && this.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✓ Socket connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('✗ Socket disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('✓ Socket disconnected');
    }
  }

  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Room management
  joinRoom(roomId, userId, userData) {
    this.emit('join-room', roomId, userId, userData);
  }

  // WebRTC signaling
  sendOffer(target, offer, sender) {
    this.emit('offer', { target, offer, sender });
  }

  sendAnswer(target, answer, sender) {
    this.emit('answer', { target, answer, sender });
  }

  sendIceCandidate(target, candidate, sender) {
    this.emit('ice-candidate', { target, candidate, sender });
  }

  // Screen sharing
  startScreenShare(roomId, userId) {
    this.emit('screen-share-started', { roomId, userId });
  }

  stopScreenShare(roomId, userId) {
    this.emit('screen-share-stopped', { roomId, userId });
  }

  // Chat
  sendMessage(roomId, userId, userName, message, messageType = 'text') {
    this.emit('send-message', { roomId, userId, userName, message, messageType });
  }

  // Whiteboard
  sendDrawData(roomId, drawData) {
    this.emit('whiteboard-draw', { roomId, ...drawData });
  }

  clearWhiteboard(roomId) {
    this.emit('whiteboard-clear', { roomId });
  }

  // Media controls
  toggleVideo(roomId, userId, enabled) {
    this.emit('toggle-video', { roomId, userId, enabled });
  }

  toggleAudio(roomId, userId, enabled) {
    this.emit('toggle-audio', { roomId, userId, enabled });
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
