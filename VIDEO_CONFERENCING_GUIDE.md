# Real-Time Video Conferencing - Complete Guide

## Overview

This application now has **full real-time video conferencing** capabilities powered by WebRTC and Socket.io. Users can create meetings, join video calls, share screens, chat, and more!

## Features Implemented

### Core Video Features
- ✅ **Real-time Video & Audio**: WebRTC peer-to-peer connections
- ✅ **Multi-participant Support**: Up to 50 participants per meeting
- ✅ **Dynamic Grid Layout**: Automatically adjusts based on participant count
- ✅ **Audio/Video Controls**: Mute/unmute microphone and camera
- ✅ **Screen Sharing**: Share your screen with all participants
- ✅ **Real-time Chat**: Send messages during meetings
- ✅ **Participant Management**: See who's in the meeting
- ✅ **Automatic Reconnection**: Handles network issues gracefully

### Technical Implementation
- **Backend**: Socket.io signaling server for WebRTC
- **Frontend**: Simple-peer for WebRTC connections
- **Video Codec**: VP8/VP9 (browser dependent)
- **Audio Codec**: Opus
- **Signaling**: Socket.io with STUN/TURN support

## How to Start the Application

### 1. Start Backend Server

```bash
cd backend
npm install  # If not already installed
npm start
```

The backend will run on: `http://localhost:5001`

**Expected Output:**
```
🚀 Server running on port 5001
📍 Test URL: http://localhost:5001/api/test
📍 Health check: http://localhost:5001/api/health
📍 CORS enabled for: http://localhost:3000, http://localhost:5174
🔌 Socket.IO ready for WebRTC signaling
```

### 2. Start Frontend Application

```bash
cd frontend
npm install  # If not already installed
npm run dev
```

The frontend will run on: `http://localhost:5173` or `http://localhost:5174`

## How to Use Video Conferencing

### Creating a Meeting

1. **Sign In** to your account
2. Navigate to **Dashboard**
3. Click **"Start New Meeting"** or go to `/createroom`
4. Configure your meeting:
   - Optional: Add a meeting name
   - Choose privacy setting (Public/Private)
   - View participant limit
5. Click **"Create Meeting Room"**
6. You'll receive a unique **Meeting ID** (e.g., `abc123xyz456`)
7. Click **"Join Meeting Now"** to enter the video room

### Joining a Meeting

#### As the Host:
- Click "Join Meeting Now" after creating the meeting

#### As a Participant:
1. Go to **"Join Meeting"** page or `/join`
2. Enter the **Meeting ID** shared by the host
3. Optional: Enter your name
4. Click **"Join Meeting"**
5. Grant camera/microphone permissions when prompted

### Video Room Controls

Once in the meeting, you'll see a control bar at the bottom with these buttons:

#### 🎤 Microphone
- Click to mute/unmute your microphone
- Gray = Active | Red = Muted

#### 📹 Camera
- Click to turn camera on/off
- Gray = Active | Red = Off
- When off, shows avatar with your initials

#### 🖥️ Screen Share
- Click to start sharing your screen
- Select window/screen to share
- Blue = Sharing | Gray = Not sharing
- Click again to stop sharing

#### 💬 Chat
- Click to open/close chat sidebar
- Send messages to all participants
- Messages show sender name and timestamp
- Blue = Chat open | Gray = Chat closed

#### ☎️ Leave Meeting
- Click to end your session and return to dashboard
- Stops all media streams
- Disconnects from the room

### Video Grid Layout

The video grid automatically adapts:
- **1 participant (you)**: Full screen
- **2 participants**: 2-column grid
- **3-4 participants**: 2x2 grid
- **5+ participants**: 3-column grid

### Meeting Link Sharing

Click the **"Copy Link"** button in the header to copy the meeting URL:
```
http://localhost:5173/meeting/abc123xyz456
```

Share this link with participants for easy access.

## Testing the Application

### Single User Test (Yourself)

1. **Create a meeting**
2. **Join the meeting**
3. Verify you can see yourself on camera
4. Test audio by speaking (check browser's audio indicator)
5. Toggle camera off/on
6. Toggle microphone mute/unmute
7. Try screen sharing
8. Open chat and send a message

### Multi-User Test (2+ People)

#### Option 1: Two Browser Windows
1. Open the application in **two different browsers** (e.g., Chrome and Firefox)
2. Sign in to both with different accounts
3. Create a meeting in Browser 1
4. Copy the Meeting ID
5. Join from Browser 2 using the Meeting ID
6. Test video, audio, chat, and screen sharing

#### Option 2: Incognito/Private Window
1. Open normal browser window and incognito window
2. Sign in as different users
3. Create meeting in one window
4. Join from the other window

#### Option 3: Multiple Devices
1. Open on your computer and phone/tablet
2. Ensure all devices are on the same network
3. Use the full URL: `http://[YOUR_IP]:5173/meeting/[MEETING_ID]`

### What to Test

- [ ] **Video**: Both users should see each other
- [ ] **Audio**: Speak and verify the other person hears you
- [ ] **Mute**: Toggle microphone and verify mute indicator
- [ ] **Camera Off**: Turn off camera, verify avatar shows
- [ ] **Screen Share**: Share screen from one user, verify other sees it
- [ ] **Chat**: Send messages, verify they appear for all users
- [ ] **Participant List**: Verify participant count updates
- [ ] **Leave/Join**: One user leaves, verify video removes
- [ ] **Network Resilience**: Disconnect/reconnect network

## Troubleshooting

### Camera/Microphone Not Working

**Issue**: "Failed to access camera/microphone"

**Solutions**:
1. **Check Browser Permissions**:
   - Chrome: Settings → Privacy and security → Site settings → Camera/Microphone
   - Firefox: Preferences → Privacy & Security → Permissions
   - Grant permissions for `localhost:5173`

2. **Use HTTPS** (for production):
   - WebRTC requires HTTPS in production
   - localhost works with HTTP for development

3. **Check Device Usage**:
   - Close other applications using camera/mic
   - Restart browser

### No Video/Audio Between Participants

**Issue**: Users can't see/hear each other

**Solutions**:
1. **Check Network**:
   - Ensure both users are online
   - Check firewall settings
   - Some corporate networks block WebRTC

2. **Check Backend Connection**:
   - Verify backend is running on port 5001
   - Check browser console for Socket.io errors
   - Look for "Connected to signaling server" message

3. **STUN/TURN Servers** (if behind NAT):
   - For production, configure TURN servers
   - Update `simple-peer` config in VideoRoom.jsx

### Screen Sharing Not Working

**Issue**: Screen share button doesn't work

**Solutions**:
1. **Browser Support**:
   - Use Chrome, Firefox, or Edge (latest versions)
   - Safari has limited support

2. **Permissions**:
   - Grant screen recording permissions (macOS)
   - Allow screen capture in browser

### Socket Connection Failed

**Issue**: "Socket.IO connection failed"

**Solutions**:
1. **Backend Running**: Ensure backend is on port 5001
2. **CORS Configuration**: Check backend allows your frontend origin
3. **Network**: Check no proxy/VPN blocking WebSocket connections

### High CPU/Battery Usage

**Issue**: Browser consuming lots of resources

**Solutions**:
1. **Close Unused Tabs**: Reduce browser load
2. **Reduce Video Quality**: Browser may auto-adjust
3. **Limit Participants**: More participants = more resources
4. **Screen Share**: Stop when not needed

## Browser Requirements

### Supported Browsers
- ✅ Google Chrome 74+
- ✅ Mozilla Firefox 66+
- ✅ Microsoft Edge 79+
- ✅ Safari 12.1+ (macOS/iOS)
- ✅ Opera 62+

### Required Permissions
- Camera access
- Microphone access
- Screen sharing (for that feature)

## Security & Privacy

### Data Transmission
- **Peer-to-peer**: Video/audio goes directly between users (not through server)
- **Encrypted**: WebRTC uses DTLS/SRTP encryption
- **Signaling**: Socket.io messages go through server

### Privacy Features
- Camera/mic off by default option
- Manual permission prompts
- Meeting IDs are randomly generated
- No recording by default

## Architecture Overview

### Backend (index.js)
```
Socket.io Events:
- join-room: User joins a meeting
- offer/answer/ice-candidate: WebRTC signaling
- chat-message: Send chat messages
- toggle-media: Update audio/video status
- start/stop-screen-share: Screen sharing
- leave-room: User leaves meeting
- disconnect: Handle disconnections
```

### Frontend (VideoRoom.jsx)
```
Key Components:
- Media Stream Management
- Peer Connection Setup (simple-peer)
- Socket.io Event Handlers
- UI Controls (mute, camera, screen share, chat)
- Dynamic Grid Layout
- Participant Management
```

### Data Flow
```
User A                  Signaling Server              User B
  |                            |                         |
  |-- join-room -------------->|                         |
  |                            |<------ join-room -------|
  |                            |                         |
  |-- offer ------------------>|                         |
  |                            |-------- offer --------->|
  |                            |<------- answer ---------|
  |<----- answer --------------|                         |
  |                            |                         |
  |<=== P2P Video/Audio ===============================>|
```

## API Endpoints

### Meeting Management
- `POST /api/meetings` - Create new meeting
- `GET /api/meetings/recent` - Get recent meetings
- `GET /api/meetings/upcoming` - Get upcoming meetings
- `POST /api/meetings/:meetingId/join` - Join meeting (adds participant to DB)

### Socket.io Events (Port 5001)
See backend Socket.io section above

## Production Deployment

### Environment Variables

Create `.env` file in backend:
```env
PORT=5001
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
NODE_ENV=production
```

### TURN Server Configuration

For production behind NAT/firewall, add TURN servers in `VideoRoom.jsx`:

```javascript
const peer = new Peer({
  initiator,
  trickle: true,
  stream,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls: 'turn:your-turn-server.com:3478',
        username: 'username',
        credential: 'password'
      }
    ]
  }
});
```

### HTTPS Required

For production:
1. Obtain SSL certificate
2. Configure HTTPS in backend
3. Update frontend API URLs
4. Deploy with reverse proxy (nginx)

## Future Enhancements

Potential additions:
- Recording functionality
- Virtual backgrounds
- Noise suppression
- Hand raising
- Breakout rooms
- Waiting room
- Recording playback
- Mobile app (React Native)

## Support

For issues:
1. Check browser console for errors
2. Verify backend logs
3. Test network connectivity
4. Review this guide's troubleshooting section

## Credits

Built with:
- **WebRTC**: Real-time communication
- **Socket.io**: Signaling server
- **Simple-peer**: WebRTC wrapper
- **React**: Frontend framework
- **Express**: Backend server
- **MongoDB**: Database

---

**Enjoy your video conferencing! 🎥📞**
