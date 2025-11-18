const mongoose = require('mongoose');

const meetingParticipantSchema = new mongoose.Schema({
  meeting_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: [true, 'Meeting ID is required']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  user_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  joined_at: {
    type: Date,
    default: Date.now
  },
  left_at: {
    type: Date,
    default: null
  },
  duration: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: { createdAt: 'joined_at', updatedAt: false }
});

// Index for faster queries
meetingParticipantSchema.index({ meeting_id: 1 });
meetingParticipantSchema.index({ user_id: 1 });
meetingParticipantSchema.index({ meeting_id: 1, user_id: 1 });

const MeetingParticipant = mongoose.model('MeetingParticipant', meetingParticipantSchema);

module.exports = MeetingParticipant;
