const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [255, 'First name cannot exceed 255 characters']
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [255, 'Last name cannot exceed 255 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: [255, 'Email cannot exceed 255 characters'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true,
    maxlength: [255, 'Company name cannot exceed 255 characters']
  },
  message: {
    type: String,
    trim: true
  },
  submission_type: {
    type: String,
    enum: ['enterprise_sales', 'general'],
    default: 'enterprise_sales'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
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

// Index for faster queries
contactSubmissionSchema.index({ status: 1 });
contactSubmissionSchema.index({ submission_type: 1 });
contactSubmissionSchema.index({ created_at: -1 });

const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);

module.exports = ContactSubmission;
