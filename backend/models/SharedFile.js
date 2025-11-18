const mongoose = require('mongoose');

const sharedFileSchema = new mongoose.Schema({
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
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true,
    maxlength: [255, 'Filename cannot exceed 255 characters']
  },
  file_path: {
    type: String,
    required: [true, 'File path is required'],
    trim: true,
    maxlength: [500, 'File path cannot exceed 500 characters']
  },
  file_size: {
    type: Number,
    min: [0, 'File size cannot be negative']
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'uploaded_at', updatedAt: false }
});

// Index for faster queries
sharedFileSchema.index({ meeting_id: 1 });
sharedFileSchema.index({ user_id: 1 });
sharedFileSchema.index({ uploaded_at: -1 });

const SharedFile = mongoose.model('SharedFile', sharedFileSchema);

module.exports = SharedFile;
