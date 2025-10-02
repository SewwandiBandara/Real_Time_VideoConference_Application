import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdCalendarToday, MdAccessTime, MdGroup, MdVideoCall, MdArrowBack } from 'react-icons/md';

const Schedule = () => {
  const navigate = useNavigate();
  const [scheduledMeetings, setScheduledMeetings] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '30',
    participants: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    const newMeeting = {
      id: Date.now(),
      ...formData,
      status: 'scheduled',
      meetingId: `MTG${Date.now().toString().slice(-6)}`
    };

    setScheduledMeetings(prev => [newMeeting, ...prev]);
    
    // Reset form
    setFormData({
      title: '',
      date: '',
      time: '',
      duration: '30',
      participants: '',
      description: ''
    });

    alert('Meeting scheduled successfully!');
  };

  const copyMeetingLink = (meetingId) => {
    const meetingLink = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(meetingLink);
    alert('Meeting link copied to clipboard!');
  };

  const startScheduledMeeting = (meeting) => {
    navigate('/createroom', { 
      state: { 
        scheduledMeeting: meeting 
      } 
    });
  };

  const deleteScheduledMeeting = (meetingId) => {
    if (window.confirm('Are you sure you want to delete this scheduled meeting?')) {
      setScheduledMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
              >
                <MdArrowBack className="w-5 h-5 mr-1" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Schedule Meeting</h1>
            </div>
            <p className="text-gray-600">Plan and schedule your meetings in advance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Schedule Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Meeting Details</h2>
                
                <form onSubmit={handleScheduleMeeting}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter meeting title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <div className="relative">
                        <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <div className="relative">
                        <MdAccessTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>

                    {/* Participants */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Participants
                      </label>
                      <div className="relative">
                        <MdGroup className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="participants"
                          value={formData.participants}
                          onChange={handleInputChange}
                          placeholder="Number of participants"
                          min="1"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Meeting agenda or description"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                    >
                      <MdVideoCall className="w-5 h-5 mr-2" />
                      Schedule Meeting
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Scheduled Meetings List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Scheduled Meetings</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {scheduledMeetings.length} upcoming meetings
                  </p>
                </div>
                
                <div className="p-6">
                  {scheduledMeetings.length === 0 ? (
                    <div className="text-center py-8">
                      <MdCalendarToday className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No scheduled meetings</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Schedule your first meeting using the form
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scheduledMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {meeting.title}
                            </h3>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Scheduled
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {formatDate(meeting.date)} at {meeting.time}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            Duration: {meeting.duration} min
                            {meeting.participants && ` • ${meeting.participants} participants`}
                          </p>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => startScheduledMeeting(meeting)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center"
                            >
                              <MdVideoCall className="w-4 h-4 mr-1" />
                              Start
                            </button>
                            <button
                              onClick={() => copyMeetingLink(meeting.meetingId)}
                              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm transition-colors"
                            >
                              Copy Link
                            </button>
                            <button
                              onClick={() => deleteScheduledMeeting(meeting.id)}
                              className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-6 bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Scheduling Tips</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Schedule meetings at least 15 minutes in advance</li>
                  <li>• Include clear agenda in the description</li>
                  <li>• Share the meeting link with participants</li>
                  <li>• Set appropriate duration for your meeting type</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;