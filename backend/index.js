const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
const server = http.createServer(app);

// Database connection pool
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'videflow',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Initialize Database Tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        plan ENUM('free', 'pro') DEFAULT 'free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Meetings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS meetings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        meeting_id VARCHAR(50) UNIQUE NOT NULL,
        scheduled_time DATETIME,
        duration INT DEFAULT 60,
        max_participants INT DEFAULT 50,
        status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Participants table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        meeting_id VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        left_at TIMESTAMP NULL,
        duration INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Contact submissions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        message TEXT,
        submission_type ENUM('enterprise_sales', 'general') DEFAULT 'enterprise_sales',
        status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.execute(
      'SELECT id, name, email, plan FROM users WHERE id = ?',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// ==================== ADMIN ROUTES ====================

// Admin Login with hardcoded credentials
app.post('/api/admin/login', async (req, res) => {
  console.log('🔐 Admin login attempt:', req.body);
  
  try {
    const { email, password } = req.body;

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'Admin123@gmail.com';
    const ADMIN_PASSWORD = 'admin123';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Case-insensitive email comparison
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Create admin token
    const adminToken = jwt.sign(
      { 
        userId: 'admin', 
        email: ADMIN_EMAIL,
        isAdmin: true 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Admin login successful');
    
    res.json({
      message: 'Admin login successful',
      token: adminToken,
      user: {
        id: 'admin',
        name: 'Administrator',
        email: ADMIN_EMAIL,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Middleware
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Admin token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid admin token' });
  }
};

// Admin Dashboard Stats
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    // Total users count
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    
    // Total meetings count
    const [totalMeetings] = await pool.execute('SELECT COUNT(*) as count FROM meetings');
    
    // Total participants count
    const [totalParticipants] = await pool.execute('SELECT COUNT(*) as count FROM participants');
    
    // Recent contact submissions
    const [contactSubmissions] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions WHERE status = "new"');
    
    // Plan distribution
    const [planStats] = await pool.execute('SELECT plan, COUNT(*) as count FROM users GROUP BY plan');
    
    // Recent users (last 7 days)
    const [recentUsers] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    res.json({
      totalUsers: totalUsers[0].count,
      totalMeetings: totalMeetings[0].count,
      totalParticipants: totalParticipants[0].count,
      pendingContacts: contactSubmissions[0].count,
      recentUsers: recentUsers[0].count,
      planDistribution: planStats.reduce((acc, stat) => {
        acc[stat.plan] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('❌ Admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users for admin
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT id, name, email, company, plan, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    res.json({ users });
  } catch (error) {
    console.error('❌ Get admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all meetings for admin
app.get('/api/admin/meetings', authenticateAdmin, async (req, res) => {
  try {
    const [meetings] = await pool.execute(`
      SELECT m.*, u.name as host_name, u.email as host_email,
             COUNT(p.id) as participant_count
      FROM meetings m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN participants p ON m.meeting_id = p.meeting_id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `);
    
    res.json({ meetings });
  } catch (error) {
    console.error('❌ Get admin meetings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact submissions for admin
app.get('/api/admin/contacts', authenticateAdmin, async (req, res) => {
  try {
    const [contacts] = await pool.execute(`
      SELECT * FROM contact_submissions 
      ORDER BY created_at DESC
    `);
    
    res.json({ contacts });
  } catch (error) {
    console.error('❌ Get admin contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update contact submission status
app.put('/api/admin/contacts/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await pool.execute(
      'UPDATE contact_submissions SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('❌ Update contact status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== EXISTING ROUTES ====================

// Test route
app.get('/api/test', (req, res) => {
  console.log('✅ Test route accessed successfully');
  res.json({ 
    message: 'Backend server is running!',
    status: 'success',
    database: 'MySQL connected',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT 1 as test');
    connection.release();
    
    res.json({ 
      status: 'OK', 
      service: 'VideoFlow Backend',
      database: 'Connected',
      time: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      service: 'VideoFlow Backend',
      database: 'Connection failed',
      error: error.message
    });
  }
});

// Contact Sales Form Submission
app.post('/api/contact/sales', async (req, res) => {
  console.log('📧 Contact sales submission:', req.body);
  
  try {
    const { firstName, lastName, email, company, message } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !company) {
      return res.status(400).json({ 
        error: 'First name, last name, email, and company are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Insert into database
    const [result] = await pool.execute(
      `INSERT INTO contact_submissions (first_name, last_name, email, company, message, submission_type) 
       VALUES (?, ?, ?, ?, ?, 'enterprise_sales')`,
      [firstName, lastName, email, company, message || '']
    );

    console.log('✅ Contact sales submission saved with ID:', result.insertId);
    
    res.status(201).json({
      message: 'Thank you for your interest! Our sales team will contact you shortly.',
      submissionId: result.insertId
    });
  } catch (error) {
    console.error('❌ Contact sales submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit form. Please try again later.' 
    });
  }
});


// Test route
app.get('/api/test', (req, res) => {
  console.log('✅ Test route accessed successfully');
  res.json({ 
    message: 'Backend server is running!',
    status: 'success',
    database: 'MySQL connected',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT 1 as test');
    connection.release();
    
    res.json({ 
      status: 'OK', 
      service: 'VideoFlow Backend',
      database: 'Connected',
      time: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      service: 'VideoFlow Backend',
      database: 'Connection failed',
      error: error.message
    });
  }
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  console.log('📝 Signup request:', req.body);
  
  try {
    const { name, email, password, company, plan } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, company, plan) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, company, plan || 'free']
    );

    const token = jwt.sign(
      { userId: result.insertId, email: email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ User created successfully with ID:', result.insertId);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertId,
        name,
        email,
        company,
        plan: plan || 'free'
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  console.log('🔑 Signin request:', req.body);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ User signed in successfully:', user.email);
    
    res.json({
      message: 'Sign in successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('❌ Signin error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

app.post('/api/auth/demo', async (req, res) => {
  try {
    const demoEmail = 'demo@videflow.com';
    const demoPassword = 'demo123';

    const [users] = await pool.execute(
      'SELECT id, name, email, plan FROM users WHERE email = ?',
      [demoEmail]
    );

    let user;
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash(demoPassword, 12);
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, plan) VALUES (?, ?, ?, ?)',
        ['Demo User', demoEmail, hashedPassword, 'pro']
      );
      
      user = {
        id: result.insertId,
        name: 'Demo User',
        email: demoEmail,
        plan: 'pro'
      };
      console.log('✅ Demo user created');
    } else {
      user = users[0];
      console.log('✅ Demo user found');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Demo login successful',
      token,
      user: user
    });
  } catch (error) {
    console.error('❌ Demo login error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Meeting Routes
// Create a new meeting
app.post('/api/meetings', authenticateToken, async (req, res) => {
  console.log('📅 Creating meeting:', req.body);
  
  try {
    const { title, description, scheduled_time, duration, max_participants } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Meeting title is required' });
    }

    // Generate unique meeting ID
    const meetingId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const [result] = await pool.execute(
      `INSERT INTO meetings (user_id, title, description, meeting_id, scheduled_time, duration, max_participants) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, description, meetingId, scheduled_time, duration || 60, max_participants || 50]
    );

    console.log('✅ Meeting created successfully with ID:', meetingId);
    
    res.status(201).json({
      message: 'Meeting created successfully',
      meeting: {
        id: result.insertId,
        meeting_id: meetingId,
        title,
        description,
        scheduled_time,
        duration: duration || 60,
        max_participants: max_participants || 50,
        status: 'scheduled'
      }
    });
  } catch (error) {
    console.error('❌ Create meeting error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get user's recent meetings (completed)
app.get('/api/meetings/recent', authenticateToken, async (req, res) => {
  try {
    const [meetings] = await pool.execute(
      `SELECT m.*, COUNT(p.id) as participant_count 
       FROM meetings m 
       LEFT JOIN participants p ON m.meeting_id = p.meeting_id 
       WHERE m.user_id = ? AND m.status = 'completed' 
       GROUP BY m.id 
       ORDER BY m.created_at DESC 
       LIMIT 5`,
      [req.user.id]
    );

    res.json({ meetings });
  } catch (error) {
    console.error('❌ Get recent meetings error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get user's upcoming meetings
app.get('/api/meetings/upcoming', authenticateToken, async (req, res) => {
  try {
    const [meetings] = await pool.execute(
      `SELECT * FROM meetings 
       WHERE user_id = ? AND status = 'scheduled' AND scheduled_time > NOW() 
       ORDER BY scheduled_time ASC 
       LIMIT 5`,
      [req.user.id]
    );

    res.json({ meetings });
  } catch (error) {
    console.error('❌ Get upcoming meetings error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get user dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Total meetings hosted
    const [totalMeetings] = await pool.execute(
      'SELECT COUNT(*) as count FROM meetings WHERE user_id = ?',
      [req.user.id]
    );

    // Total participants across all meetings
    const [totalParticipants] = await pool.execute(
      `SELECT COUNT(DISTINCT p.id) as count 
       FROM participants p 
       JOIN meetings m ON p.meeting_id = m.meeting_id 
       WHERE m.user_id = ?`,
      [req.user.id]
    );

    // Average meeting duration
    const [avgDuration] = await pool.execute(
      `SELECT AVG(duration) as average FROM meetings WHERE user_id = ? AND status = 'completed'`,
      [req.user.id]
    );

    // Upcoming meetings count
    const [upcomingCount] = await pool.execute(
      `SELECT COUNT(*) as count FROM meetings 
       WHERE user_id = ? AND status = 'scheduled' AND scheduled_time > NOW()`,
      [req.user.id]
    );

    res.json({
      meetingsHosted: totalMeetings[0].count,
      totalParticipants: totalParticipants[0].count,
      averageDuration: Math.round(avgDuration[0].average || 0) + 'min',
      upcomingMeetings: upcomingCount[0].count
    });
  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Join a meeting (add participant)
app.post('/api/meetings/:meetingId/join', authenticateToken, async (req, res) => {
  try {
    const { meetingId } = req.params;

    // Check if meeting exists
    const [meetings] = await pool.execute(
      'SELECT * FROM meetings WHERE meeting_id = ?',
      [meetingId]
    );

    if (meetings.length === 0) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const meeting = meetings[0];

    // Add participant
    await pool.execute(
      'INSERT INTO participants (meeting_id, user_id, user_name, user_email) VALUES (?, ?, ?, ?)',
      [meetingId, req.user.id, req.user.name, req.user.email]
    );

    res.json({ 
      message: 'Joined meeting successfully',
      meeting: {
        title: meeting.title,
        meeting_id: meeting.meeting_id
      }
    });
  } catch (error) {
    console.error('❌ Join meeting error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, plan, created_at FROM users'
    );
    
    res.json({ users });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Initialize database and start server
initializeDatabase().then(() => {
  const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid conflicts
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Test URL: http://localhost:${PORT}/api/test`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Admin test: http://localhost:${PORT}/api/admin/test`);
    console.log(`📍 CORS enabled for: http://localhost:3000, http://localhost:5174`);
  });
}).catch(error => {
  console.error('❌ Failed to start server:', error);
});