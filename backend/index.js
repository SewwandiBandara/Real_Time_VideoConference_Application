require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
const { User, Meeting, MeetingParticipant, SharedFile, ContactSubmission } = require('./models');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

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
    const user = await User.findById(decoded.userId).select('name email plan');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
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
    const totalUsers = await User.countDocuments();

    // Total meetings count
    const totalMeetings = await Meeting.countDocuments();

    // Total participants count
    const totalParticipants = await MeetingParticipant.countDocuments();

    // Recent contact submissions
    const pendingContacts = await ContactSubmission.countDocuments({ status: 'new' });

    // Plan distribution
    const planStats = await User.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({ created_at: { $gte: sevenDaysAgo } });

    const planDistribution = planStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      totalUsers,
      totalMeetings,
      totalParticipants,
      pendingContacts,
      recentUsers,
      planDistribution
    });
  } catch (error) {
    console.error('❌ Admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users for admin
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('name email company plan created_at')
      .sort({ created_at: -1 });

    res.json({ users });
  } catch (error) {
    console.error('❌ Get admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all meetings for admin
app.get('/api/admin/meetings', authenticateAdmin, async (req, res) => {
  try {
    const meetings = await Meeting.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'host_id',
          foreignField: '_id',
          as: 'host'
        }
      },
      {
        $lookup: {
          from: 'meetingparticipants',
          localField: 'room_id',
          foreignField: 'meeting_id',
          as: 'participants'
        }
      },
      {
        $unwind: { path: '$host', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          title: 1,
          description: 1,
          room_id: 1,
          scheduled_time: 1,
          duration: 1,
          max_participants: 1,
          status: 1,
          created_at: 1,
          host_name: '$host.name',
          host_email: '$host.email',
          participant_count: { $size: '$participants' }
        }
      },
      { $sort: { created_at: -1 } }
    ]);

    res.json({ meetings });
  } catch (error) {
    console.error('❌ Get admin meetings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact submissions for admin
app.get('/api/admin/contacts', authenticateAdmin, async (req, res) => {
  try {
    const contacts = await ContactSubmission.find().sort({ created_at: -1 });

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

    const contact = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
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
    database: 'MongoDB connected',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

    res.json({
      status: 'OK',
      service: 'VideoFlow Backend',
      database: dbStatus,
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
    const contact = await ContactSubmission.create({
      first_name: firstName,
      last_name: lastName,
      email,
      company,
      message: message || '',
      submission_type: 'enterprise_sales'
    });

    console.log('✅ Contact sales submission saved with ID:', contact._id);

    res.status(201).json({
      message: 'Thank you for your interest! Our sales team will contact you shortly.',
      submissionId: contact._id
    });
  } catch (error) {
    console.error('❌ Contact sales submission error:', error);
    res.status(500).json({
      error: 'Failed to submit form. Please try again later.'
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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      company,
      plan: plan || 'free'
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ User created successfully with ID:', user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        plan: user.plan
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

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ User signed in successfully:', user.email);

    res.json({
      message: 'Sign in successful',
      token,
      user: {
        id: user._id,
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

    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Demo User',
        email: demoEmail,
        password: demoPassword,
        plan: 'pro'
      });
      console.log('✅ Demo user created');
    } else {
      console.log('✅ Demo user found');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Demo login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('❌ Demo login error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get user profile (for token verification)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        company: req.user.company,
        plan: req.user.plan
      }
    });
  } catch (error) {
    console.error('❌ Get user profile error:', error);
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
    const roomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const meeting = await Meeting.create({
      host_id: req.user._id,
      room_id: roomId,
      title,
      description,
      scheduled_time,
      duration: duration || 60,
      max_participants: max_participants || 50,
      status: 'scheduled'
    });

    console.log('✅ Meeting created successfully with ID:', roomId);

    res.status(201).json({
      message: 'Meeting created successfully',
      meeting: {
        id: meeting._id,
        meeting_id: roomId,
        room_id: roomId,
        title: meeting.title,
        description: meeting.description,
        scheduled_time: meeting.scheduled_time,
        duration: meeting.duration,
        max_participants: meeting.max_participants,
        status: meeting.status
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
    const meetings = await Meeting.aggregate([
      {
        $match: {
          host_id: req.user._id,
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'meetingparticipants',
          localField: 'room_id',
          foreignField: 'meeting_id',
          as: 'participants'
        }
      },
      {
        $addFields: {
          participant_count: { $size: '$participants' }
        }
      },
      {
        $sort: { created_at: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({ meetings });
  } catch (error) {
    console.error('❌ Get recent meetings error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get user's upcoming meetings
app.get('/api/meetings/upcoming', authenticateToken, async (req, res) => {
  try {
    const meetings = await Meeting.find({
      host_id: req.user._id,
      status: 'scheduled',
      scheduled_time: { $gt: new Date() }
    })
      .sort({ scheduled_time: 1 })
      .limit(5);

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
    const totalMeetings = await Meeting.countDocuments({ host_id: req.user._id });

    // Get user's meeting ObjectIds
    const userMeetings = await Meeting.find({ host_id: req.user._id }).select('_id');
    const meetingIds = userMeetings.map(m => m._id);

    // Total participants across all meetings
    const totalParticipants = await MeetingParticipant.countDocuments({
      meeting_id: { $in: meetingIds }
    });

    // Average meeting duration
    const avgResult = await Meeting.aggregate([
      {
        $match: {
          host_id: req.user._id,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$duration' }
        }
      }
    ]);

    const avgDuration = avgResult.length > 0 ? Math.round(avgResult[0].average || 0) : 0;

    // Upcoming meetings count
    const upcomingCount = await Meeting.countDocuments({
      host_id: req.user._id,
      status: 'scheduled',
      scheduled_time: { $gt: new Date() }
    });

    res.json({
      meetingsHosted: totalMeetings,
      totalParticipants,
      averageDuration: avgDuration + 'min',
      upcomingMeetings: upcomingCount
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
    const meeting = await Meeting.findOne({ room_id: meetingId });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Add participant
    await MeetingParticipant.create({
      meeting_id: meeting._id,
      user_id: req.user._id,
      user_name: req.user.name,
      user_email: req.user.email
    });

    res.json({
      message: 'Joined meeting successfully',
      meeting: {
        title: meeting.title,
        meeting_id: meeting.room_id
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
    const users = await User.find().select('name email plan created_at');

    res.json({ users });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler for API routes - must come after all other routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: 'API endpoint not found',
      path: req.originalUrl,
      method: req.method
    });
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err);

  // Always return JSON for API routes
  if (req.path.startsWith('/api')) {
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } else {
    res.status(err.status || 500).send(err.message || 'Internal server error');
  }
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Test URL: http://localhost:${PORT}/api/test`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 CORS enabled for: http://localhost:3000, http://localhost:5174`);
});