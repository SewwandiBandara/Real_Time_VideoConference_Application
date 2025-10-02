const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'video_conferencing'
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Protected route example
app.get('/api/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const connection = await mysql.createConnection(dbConfig);
    
    const [users] = await connection.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get user meetings
app.get('/api/meetings', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const connection = await mysql.createConnection(dbConfig);
    
    const [meetings] = await connection.execute(
      `SELECT m.* FROM meetings m 
       LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id 
       WHERE m.host_id = ? OR mp.user_id = ? 
       ORDER BY m.created_at DESC 
       LIMIT 10`,
      [decoded.userId, decoded.userId]
    );

    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Socket.io for real-time communication
const rooms = new Map();
const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId, userId, userData) => {
    socket.join(roomId);
    users.set(socket.id, { roomId, userId, userData });
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);

    // Notify other users
    socket.to(roomId).emit('user-connected', userId, userData);
    
    // Send current users to the new user
    const roomUsers = Array.from(rooms.get(roomId))
      .map(socketId => users.get(socketId))
      .filter(user => user.userId !== userId);
    
    socket.emit('current-users', roomUsers);
  });

  socket.on('offer', (data) => {
    socket.to(data.target).emit('offer', {
      offer: data.offer,
      sender: data.sender
    });
  });

  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', {
      answer: data.answer,
      sender: data.sender
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      sender: data.sender
    });
  });

  socket.on('screen-share', (data) => {
    socket.to(data.roomId).emit('screen-share', data);
  });

  socket.on('whiteboard-draw', (data) => {
    socket.to(data.roomId).emit('whiteboard-draw', data);
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(user.roomId).emit('user-disconnected', user.userId);
      rooms.get(user.roomId)?.delete(socket.id);
      users.delete(socket.id);
    }
  });
});

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if user exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.insertId, name, email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Encrypt file data (simplified example)
  const fileData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    uploadTime: new Date()
  };

  res.json({
    message: 'File uploaded successfully',
    file: fileData
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});