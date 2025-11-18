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
const fs = require('fs');
const crypto = require('crypto');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Database connection pool
let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'video_conferencing',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

  // Test connection
  pool.getConnection()
    .then(connection => {
      console.log('✓ Database connected successfully');
      connection.release();
    })
    .catch(err => {
      console.error('✗ Database connection failed:', err.message);
      console.error('Please check your database configuration in .env file');
    });
} catch (error) {
  console.error('✗ Failed to create database pool:', error.message);
}

// File upload configuration with security
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only documents and images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret === 'your-secret-key') {
      console.error('⚠ WARNING: JWT_SECRET is not set or using default value!');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Input validation helper
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// ============= AUTH ROUTES =============

// Register new user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const connection = await pool.getConnection();

    try {
      // Check if user exists
      const [existing] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name.trim(), email.toLowerCase().trim(), hashedPassword]
      );

      // Create default settings for user
      await connection.execute(
        'INSERT INTO user_settings (user_id) VALUES (?)',
        [result.insertId]
      );

      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(
        { userId: result.insertId, email: email.toLowerCase().trim() },
        jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: result.insertId,
          name: name.trim(),
          email: email.toLowerCase().trim()
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase().trim()]
      );

      if (users.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const user = users[0];
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?',
        [req.user.userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: users[0] });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============= MEETING ROUTES =============

// Create new meeting
app.post('/api/meetings', authenticateToken, async (req, res) => {
  try {
    const { title, description, scheduled_time, duration, max_participants, password } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Meeting title is required' });
    }

    // Generate unique room ID
    const roomId = crypto.randomBytes(8).toString('hex');

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute(
        `INSERT INTO meetings (room_id, title, description, host_id, scheduled_time, duration, max_participants, password)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          roomId,
          title,
          description || null,
          req.user.userId,
          scheduled_time || null,
          duration || 60,
          max_participants || 50,
          password || null
        ]
      );

      const [meetings] = await connection.execute(
        'SELECT * FROM meetings WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({
        message: 'Meeting created successfully',
        meeting: meetings[0]
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ error: 'Server error creating meeting' });
  }
});

// Get user meetings
app.get('/api/meetings', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [meetings] = await connection.execute(
        `SELECT DISTINCT m.*, u.name as host_name
         FROM meetings m
         LEFT JOIN users u ON m.host_id = u.id
         LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id
         WHERE m.host_id = ? OR mp.user_id = ?
         ORDER BY
           CASE WHEN m.scheduled_time IS NOT NULL THEN m.scheduled_time ELSE m.created_at END DESC
         LIMIT 50`,
        [req.user.userId, req.user.userId]
      );

      res.json({ meetings });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get meeting by room ID
app.get('/api/meetings/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    const connection = await pool.getConnection();

    try {
      const [meetings] = await connection.execute(
        `SELECT m.*, u.name as host_name, u.email as host_email
         FROM meetings m
         LEFT JOIN users u ON m.host_id = u.id
         WHERE m.room_id = ?`,
        [roomId]
      );

      if (meetings.length === 0) {
        return res.status(404).json({ error: 'Meeting not found' });
      }

      // Don't send password in response
      const meeting = { ...meetings[0] };
      if (meeting.password) {
        meeting.hasPassword = true;
        delete meeting.password;
      }

      res.json({ meeting });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update meeting status
app.put('/api/meetings/:roomId/status', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'active', 'ended', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute(
        'UPDATE meetings SET status = ? WHERE room_id = ? AND host_id = ?',
        [status, roomId, req.user.userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Meeting not found or unauthorized' });
      }

      res.json({ message: 'Meeting status updated' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join meeting (add participant)
app.post('/api/meetings/:roomId/join', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, guestName, password } = req.body;

    const connection = await pool.getConnection();

    try {
      // Get meeting
      const [meetings] = await connection.execute(
        'SELECT * FROM meetings WHERE room_id = ?',
        [roomId]
      );

      if (meetings.length === 0) {
        return res.status(404).json({ error: 'Meeting not found' });
      }

      const meeting = meetings[0];

      // Check password if required
      if (meeting.password && meeting.password !== password) {
        return res.status(403).json({ error: 'Invalid meeting password' });
      }

      // Check participant limit
      const [participants] = await connection.execute(
        'SELECT COUNT(*) as count FROM meeting_participants WHERE meeting_id = ? AND left_at IS NULL',
        [meeting.id]
      );

      if (participants[0].count >= meeting.max_participants) {
        return res.status(403).json({ error: 'Meeting is full' });
      }

      // Add participant
      await connection.execute(
        'INSERT INTO meeting_participants (meeting_id, user_id, guest_name) VALUES (?, ?, ?)',
        [meeting.id, userId || null, guestName || null]
      );

      // Update meeting status to active if it's the first join
      if (meeting.status === 'scheduled') {
        await connection.execute(
          'UPDATE meetings SET status = ? WHERE id = ?',
          ['active', meeting.id]
        );
      }

      res.json({ message: 'Joined meeting successfully', meeting });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Join meeting error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============= FILE UPLOAD ROUTES =============

app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { meetingId } = req.body;

    const connection = await pool.getConnection();

    try {
      // Save file info to database
      const [result] = await connection.execute(
        `INSERT INTO shared_files (meeting_id, user_id, filename, original_name, file_path, file_size, file_type)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          meetingId || null,
          req.user.userId,
          req.file.filename,
          req.file.originalname,
          req.file.path,
          req.file.size,
          req.file.mimetype
        ]
      );

      res.json({
        message: 'File uploaded successfully',
        file: {
          id: result.insertId,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
          url: `/uploads/${req.file.filename}`
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Upload error:', error);
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// Get meeting files
app.get('/api/meetings/:roomId/files', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;

    const connection = await pool.getConnection();

    try {
      const [files] = await connection.execute(
        `SELECT sf.*, u.name as uploader_name
         FROM shared_files sf
         LEFT JOIN users u ON sf.user_id = u.id
         LEFT JOIN meetings m ON sf.meeting_id = m.id
         WHERE m.room_id = ?
         ORDER BY sf.uploaded_at DESC`,
        [roomId]
      );

      res.json({ files });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============= SETTINGS ROUTES =============

// Get user settings
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [settings] = await connection.execute(
        'SELECT * FROM user_settings WHERE user_id = ?',
        [req.user.userId]
      );

      if (settings.length === 0) {
        // Create default settings if not exist
        await connection.execute(
          'INSERT INTO user_settings (user_id) VALUES (?)',
          [req.user.userId]
        );

        const [newSettings] = await connection.execute(
          'SELECT * FROM user_settings WHERE user_id = ?',
          [req.user.userId]
        );

        return res.json({ settings: newSettings[0] });
      }

      res.json({ settings: settings[0] });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user settings
app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const {
      enable_video,
      enable_audio,
      enable_notifications,
      enable_screen_sharing,
      video_quality,
      audio_input_device,
      audio_output_device,
      video_input_device,
      theme,
      language
    } = req.body;

    const connection = await pool.getConnection();

    try {
      const updates = [];
      const values = [];

      if (enable_video !== undefined) { updates.push('enable_video = ?'); values.push(enable_video); }
      if (enable_audio !== undefined) { updates.push('enable_audio = ?'); values.push(enable_audio); }
      if (enable_notifications !== undefined) { updates.push('enable_notifications = ?'); values.push(enable_notifications); }
      if (enable_screen_sharing !== undefined) { updates.push('enable_screen_sharing = ?'); values.push(enable_screen_sharing); }
      if (video_quality) { updates.push('video_quality = ?'); values.push(video_quality); }
      if (audio_input_device !== undefined) { updates.push('audio_input_device = ?'); values.push(audio_input_device); }
      if (audio_output_device !== undefined) { updates.push('audio_output_device = ?'); values.push(audio_output_device); }
      if (video_input_device !== undefined) { updates.push('video_input_device = ?'); values.push(video_input_device); }
      if (theme) { updates.push('theme = ?'); values.push(theme); }
      if (language) { updates.push('language = ?'); values.push(language); }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No settings to update' });
      }

      values.push(req.user.userId);

      await connection.execute(
        `UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`,
        values
      );

      const [settings] = await connection.execute(
        'SELECT * FROM user_settings WHERE user_id = ?',
        [req.user.userId]
      );

      res.json({
        message: 'Settings updated successfully',
        settings: settings[0]
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============= SOCKET.IO FOR REAL-TIME COMMUNICATION =============

const rooms = new Map();
const users = new Map();

io.on('connection', (socket) => {
  console.log('✓ User connected:', socket.id);

  // Join room
  socket.on('join-room', async (roomId, userId, userData) => {
    try {
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
        .filter(user => user && user.userId !== userId);

      socket.emit('current-users', roomUsers);

      console.log(`✓ User ${userId} joined room ${roomId}`);
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // WebRTC signaling
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

  // Screen sharing
  socket.on('screen-share-started', (data) => {
    socket.to(data.roomId).emit('user-screen-sharing', {
      userId: data.userId,
      isSharing: true
    });
  });

  socket.on('screen-share-stopped', (data) => {
    socket.to(data.roomId).emit('user-screen-sharing', {
      userId: data.userId,
      isSharing: false
    });
  });

  // Whiteboard
  socket.on('whiteboard-draw', (data) => {
    socket.to(data.roomId).emit('whiteboard-draw', data);
  });

  socket.on('whiteboard-clear', (data) => {
    socket.to(data.roomId).emit('whiteboard-clear', data);
  });

  // Chat messages
  socket.on('send-message', async (data) => {
    try {
      const { roomId, userId, userName, message, messageType } = data;

      // Broadcast to room
      io.to(roomId).emit('receive-message', {
        userId,
        userName,
        message,
        messageType: messageType || 'text',
        timestamp: new Date()
      });

      // Save to database if meeting exists
      if (pool) {
        const connection = await pool.getConnection();
        try {
          const [meetings] = await connection.execute(
            'SELECT id FROM meetings WHERE room_id = ?',
            [roomId]
          );

          if (meetings.length > 0) {
            await connection.execute(
              'INSERT INTO chat_messages (meeting_id, user_id, message, message_type) VALUES (?, ?, ?, ?)',
              [meetings[0].id, userId || null, message, messageType || 'text']
            );
          }
        } finally {
          connection.release();
        }
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  });

  // Toggle video/audio
  socket.on('toggle-video', (data) => {
    socket.to(data.roomId).emit('user-video-toggled', {
      userId: data.userId,
      enabled: data.enabled
    });
  });

  socket.on('toggle-audio', (data) => {
    socket.to(data.roomId).emit('user-audio-toggled', {
      userId: data.userId,
      enabled: data.enabled
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(user.roomId).emit('user-disconnected', user.userId);

      const room = rooms.get(user.roomId);
      if (room) {
        room.delete(socket.id);
        if (room.size === 0) {
          rooms.delete(user.roomId);
        }
      }

      users.delete(socket.id);
      console.log(`✓ User ${user.userId} disconnected from room ${user.roomId}`);
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n✓ Server running on port ${PORT}`);
  console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}\n`);

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
    console.warn('⚠ WARNING: JWT_SECRET is not set or using default value!');
    console.warn('⚠ Please set a secure JWT_SECRET in your .env file\n');
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    if (pool) {
      await pool.end();
      console.log('Database pool closed');
    }
    process.exit(0);
  });
});
