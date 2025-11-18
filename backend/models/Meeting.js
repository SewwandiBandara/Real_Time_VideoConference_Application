const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  host_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host ID is required']
  },
  title: {
    type: String,
    required: [true, 'Meeting title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true
  },
  scheduled_time: {
    type: Date
  },
  duration: {
    type: Number,
    default: 60,
    min: [1, 'Duration must be at least 1 minute']
  },
  max_participants: {
    type: Number,
    default: 50,
    min: [1, 'Max participants must be at least 1']
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for faster queries (room_id already has unique index from schema)
meetingSchema.index({ host_id: 1, status: 1 });
meetingSchema.index({ scheduled_time: 1 });

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
