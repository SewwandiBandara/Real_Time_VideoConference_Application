// Export all models from a single file for easier imports
const User = require('./User');
const Meeting = require('./Meeting');
const MeetingParticipant = require('./MeetingParticipant');
const SharedFile = require('./SharedFile');
const ContactSubmission = require('./ContactSubmission');

module.exports = {
  User,
  Meeting,
  MeetingParticipant,
  SharedFile,
  ContactSubmission
};
