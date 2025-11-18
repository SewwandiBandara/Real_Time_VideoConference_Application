# VideoFlow - Real-Time Video Conferencing Application

A full-featured video conferencing platform built with React, Node.js, Socket.io, and WebRTC. VideoFlow provides secure, high-quality video calls with screen sharing, chat, whiteboard, and file sharing capabilities.

## ✨ Features

### Core Features
- **HD Video & Audio Calling** - Crystal clear video and audio quality using WebRTC
- **Multi-Party Conferences** - Support for up to 50 participants per meeting
- **Screen Sharing** - Share your screen with meeting participants
- **Real-time Chat** - Text messaging during video calls
- **Interactive Whiteboard** - Collaborative drawing and annotation
- **File Sharing** - Share documents and files during meetings
- **Meeting Recording** - Record meetings for later review (backend ready)
- **User Authentication** - Secure JWT-based authentication
- **Meeting Management** - Create, schedule, and manage meetings
- **Password Protected Meetings** - Secure your meetings with passwords

### Security Features
- JWT token authentication
- Encrypted passwords (bcrypt)
- Secure file uploads with validation
- Protected API endpoints
- CORS configuration
- Helmet.js security headers

## 🚀 Technology Stack

### Frontend
- **React 19.1.1** - UI framework
- **Vite 6.2.0** - Build tool and dev server
- **Tailwind CSS 4.1.13** - Styling
- **React Router DOM 7.9.3** - Navigation
- **Socket.io Client 4.8.1** - Real-time communication
- **Simple Peer 9.11.1** - WebRTC wrapper
- **Axios 1.12.2** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **Socket.io 4.8.1** - WebSocket server
- **MySQL2 3.15.1** - Database driver with connection pooling
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- Modern web browser with WebRTC support (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Real_Time_VideoConference_Application
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
mysql -u root -p < backend/database/schema.sql
```

The schema will create:
- Users table
- Meetings table
- Meeting participants table
- Chat messages table
- Shared files table
- User settings table
- And more...

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Required Environment Variables (.env):**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=video_conferencing

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif
```

**Start the backend server:**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Required Environment Variables (.env):**

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Socket.IO Server URL
VITE_SOCKET_URL=http://localhost:5000
```

**Start the frontend development server:**

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📖 User Guide

### Creating an Account

1. Click "Sign Up" in the navigation bar
2. Fill in your name, email, and password
3. Click "Start Free Trial"
4. You'll be automatically logged in and redirected to the dashboard

### Demo Account

You can try the application using the demo account:
- **Email:** demo@videoflow.com
- **Password:** demo123

### Creating a Meeting

1. Click "Create Room" from the dashboard or navigation
2. Enter a meeting name
3. Choose privacy settings (Public or Password Protected)
4. Click "Create Meeting Room"
5. Share the meeting link with participants
6. Click "Join Meeting" to enter the room

### Joining a Meeting

1. Click "Join Meeting" from the dashboard
2. Enter the meeting room ID
3. Enter password if the meeting is password protected
4. Click "Join Meeting"

### During a Meeting

#### Video Controls
- **Microphone** - Toggle audio on/off
- **Camera** - Toggle video on/off
- **Screen Share** - Share your screen
- **End Call** - Leave the meeting

#### Collaboration Tools
- **Chat** - Open side panel to send text messages
- **Whiteboard** - Open interactive whiteboard for drawing
- **Files** - Upload and share files with participants
- **Participants** - View list of meeting participants

### Settings

Access your settings to configure:
- Video quality preferences
- Audio/Video device selection
- Notification preferences
- Display theme (coming soon)

## 🏗️ Project Structure

```
Real_Time_VideoConference_Application/
├── backend/
│   ├── database/
│   │   └── schema.sql          # Database schema
│   ├── uploads/                # Uploaded files directory
│   ├── index.js                # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx      # Navigation component
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateRoom.jsx
│   │   │   ├── JoinMeeting.jsx
│   │   │   ├── VideoMeeting.jsx # Main video conferencing component
│   │   │   ├── Settings.jsx
│   │   │   ├── Schedule.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.js          # API client
│   │   │   └── socket.js       # Socket.io client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🔒 Security Considerations

### Production Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong, random string
- [ ] Use environment-specific `.env` files
- [ ] Enable HTTPS for both frontend and backend
- [ ] Update `FRONTEND_URL` to your production domain
- [ ] Configure MySQL for production (user permissions, etc.)
- [ ] Set up proper firewall rules
- [ ] Enable rate limiting on API endpoints
- [ ] Regular security audits
- [ ] Keep dependencies up to date

### Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for database and JWT secrets
3. **Enable two-factor authentication** (future enhancement)
4. **Regular backups** of your database
5. **Monitor logs** for suspicious activity
6. **Implement rate limiting** for API endpoints

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```
Solution: Check your MySQL credentials in backend/.env
Verify MySQL server is running: sudo systemctl status mysql
```

**2. Camera/Microphone Permission Denied**
```
Solution: Grant browser permissions for camera and microphone
Check browser settings > Privacy > Camera/Microphone
```

**3. Socket Connection Failed**
```
Solution: Ensure backend server is running
Check VITE_SOCKET_URL in frontend/.env
Verify firewall allows WebSocket connections
```

**4. JWT Token Error**
```
Solution: Clear browser localStorage
Sign out and sign in again
Check JWT_SECRET is properly set in backend/.env
```

**5. File Upload Failed**
```
Solution: Check file size (max 10MB by default)
Verify file type is allowed
Ensure uploads/ directory exists and is writable
```

## 🧪 Development

### Running Tests

```bash
# Backend tests (to be implemented)
cd backend
npm test

# Frontend tests (to be implemented)
cd frontend
npm test
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# The build output will be in frontend/dist/
```

### Code Formatting

```bash
# Frontend linting
cd frontend
npm run lint
```

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/register` - Create new user account
- `POST /api/login` - Login user
- `GET /api/user` - Get current user (requires auth)

### Meeting Endpoints

- `POST /api/meetings` - Create new meeting (requires auth)
- `GET /api/meetings` - Get user's meetings (requires auth)
- `GET /api/meetings/:roomId` - Get meeting by room ID
- `PUT /api/meetings/:roomId/status` - Update meeting status (requires auth)
- `POST /api/meetings/:roomId/join` - Join a meeting

### File Endpoints

- `POST /api/upload` - Upload file (requires auth)
- `GET /api/meetings/:roomId/files` - Get meeting files (requires auth)

### Settings Endpoints

- `GET /api/settings` - Get user settings (requires auth)
- `PUT /api/settings` - Update user settings (requires auth)

### WebSocket Events

#### Client to Server
- `join-room` - Join a meeting room
- `offer`, `answer`, `ice-candidate` - WebRTC signaling
- `send-message` - Send chat message
- `screen-share-started`, `screen-share-stopped` - Screen sharing
- `whiteboard-draw` - Whiteboard drawing
- `toggle-video`, `toggle-audio` - Media controls

#### Server to Client
- `user-connected`, `user-disconnected` - User join/leave
- `current-users` - List of users in room
- `receive-message` - Chat message received
- `user-screen-sharing` - Screen sharing notification
- `whiteboard-draw` - Whiteboard update

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- WebRTC for enabling peer-to-peer communication
- Socket.io for real-time bidirectional communication
- Simple Peer for simplifying WebRTC implementation
- The open-source community for various libraries and tools

## 📞 Support

For support, email support@videoflow.com or create an issue in the GitHub repository.

## 🗺️ Roadmap

### Upcoming Features
- [ ] Meeting recording functionality
- [ ] Breakout rooms
- [ ] Virtual backgrounds
- [ ] Polls and surveys
- [ ] Transcription and closed captions
- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Analytics dashboard
- [ ] Custom branding options
- [ ] API webhooks

---

**Built with ❤️ by the VideoFlow Team**
