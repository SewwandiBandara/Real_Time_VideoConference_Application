import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdVideoCall, MdContentCopy, MdQrCode, MdHistory, MdGroups } from 'react-icons/md';

const JoinMeeting = () => {
  const [meetingCode, setMeetingCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  // Mock recent meetings data
  const recentMeetings = [
    { id: 'ABC123', name: 'Team Standup', host: 'John Doe', lastJoined: '2 hours ago' },
    { id: 'XYZ789', name: 'Client Call', host: 'Sarah Wilson', lastJoined: '1 day ago' },
    { id: 'DEF456', name: 'Project Review', host: 'Mike Chen', lastJoined: '3 days ago' },
  ];

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (!meetingCode.trim()) {
      alert('Please enter a meeting code');
      return;
    }

    setIsJoining(true);
    
    // Simulate joining process
    setTimeout(() => {
      setIsJoining(false);
      navigate(`/meeting/${meetingCode.toUpperCase()}`);
    }, 1500);
  };

  const handleQuickJoin = (code) => {
    setMeetingCode(code);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Meeting code copied to clipboard!');
  };

  const generateSampleCode = () => {
    const codes = ['TEAM123', 'MEET456', 'JOIN789', 'VIDEO999'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    setMeetingCode(randomCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdVideoCall className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join a Meeting</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enter a meeting code or join from your recent meetings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Join Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <form onSubmit={handleJoinMeeting} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={meetingCode}
                        onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono tracking-wider"
                        placeholder="Enter meeting code"
                        maxLength={9}
                        required
                      />
                      <button
                        type="button"
                        onClick={generateSampleCode}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Try Sample
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Enter the code provided by the meeting host
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name for the meeting"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <MdGroups className="w-5 h-5" />
                      <span className="font-medium">Up to 50 participants</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-1">
                      Your camera and microphone will be off by default
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isJoining || !meetingCode.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
                  >
                    {isJoining ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Joining Meeting...</span>
                      </>
                    ) : (
                      <>
                        <MdVideoCall className="w-5 h-5" />
                        <span>Join Meeting</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Tips */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <MdQrCode className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">QR Code</h4>
                        <p className="text-sm text-gray-600">Scan QR codes for quick access</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <MdContentCopy className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Copy & Paste</h4>
                        <p className="text-sm text-gray-600">Easily copy meeting codes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Meetings */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MdHistory className="w-5 h-5 text-gray-600" />
                <span>Recent Meetings</span>
              </h2>
              
              {recentMeetings.length > 0 ? (
                <div className="space-y-4">
                  {recentMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{meeting.name}</h3>
                        <button
                          onClick={() => copyToClipboard(meeting.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <MdContentCopy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Host: {meeting.host}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Last joined: {meeting.lastJoined}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleQuickJoin(meeting.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MdGroups className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent meetings</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Join meetings to see them here
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/createroom')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <MdVideoCall className="w-5 h-5" />
                    <span>Start New Meeting</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help Joining?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Get the Code</h4>
                <p className="text-sm text-gray-600">
                  Ask the meeting host for the meeting code
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Enter Code</h4>
                <p className="text-sm text-gray-600">
                  Type or paste the code in the field above
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Join</h4>
                <p className="text-sm text-gray-600">
                  Click join and enter your name when prompted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMeeting;