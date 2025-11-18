import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdVideoCall, MdContentCopy, MdPerson, MdLock, MdPublic } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { meetingAPI } from '../services/api';
import { toast } from 'react-toastify';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleCreateRoom = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please sign in to create a meeting');
      navigate('/signin');
      return;
    }

    if (!roomName.trim()) {
      toast.error('Please enter a meeting name');
      return;
    }

    setLoading(true);

    try {
      const response = await meetingAPI.createMeeting({
        title: roomName,
        description: '',
        password: isPrivate ? roomPassword : null,
        max_participants: 50,
      });

      setRoomId(response.meeting.room_id);
      setRoomCreated(true);
      toast.success('Meeting created successfully!');
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const meetingUrl = `${window.location.origin}/meeting/${roomId}`;
    navigator.clipboard.writeText(meetingUrl);
    toast.success('Meeting link copied to clipboard!');
  };

  const joinRoom = () => {
    navigate(`/meeting/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdVideoCall className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Start a New Meeting</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create a secure meeting room and invite participants to join
            </p>
          </div>

          {!roomCreated ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Name
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter meeting name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Meeting Privacy
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${!isPrivate ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      onClick={() => setIsPrivate(false)}
                    >
                      <MdPublic className="w-8 h-8 text-gray-600 mb-2" />
                      <div className="font-semibold text-gray-900">Public</div>
                      <div className="text-sm text-gray-600">Anyone with link can join</div>
                    </div>
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${isPrivate ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      onClick={() => setIsPrivate(true)}
                    >
                      <MdLock className="w-8 h-8 text-gray-600 mb-2" />
                      <div className="font-semibold text-gray-900">Private</div>
                      <div className="text-sm text-gray-600">Requires password to join</div>
                    </div>
                  </div>
                </div>

                {isPrivate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Password
                    </label>
                    <input
                      type="password"
                      value={roomPassword}
                      onChange={(e) => setRoomPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter a password"
                      required
                    />
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <MdPerson className="w-5 h-5" />
                    <span className="font-medium">Up to 50 participants</span>
                  </div>
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Meeting...' : 'Create Meeting Room'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdVideoCall className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting Room Created!</h2>
                <p className="text-gray-600">Share this link with participants</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Name
                  </label>
                  <div className="text-lg font-semibold text-gray-900">{roomName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 font-mono text-sm overflow-x-auto">
                      {window.location.origin}/meeting/{roomId}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Copy to clipboard"
                    >
                      <MdContentCopy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {isPrivate && roomPassword && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Password:</strong> {roomPassword}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Share this password with participants
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={joinRoom}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    Join Meeting
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Features Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MdVideoCall className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">HD Video & Audio</h3>
              <p className="text-sm text-gray-600">Crystal clear video and audio quality for professional meetings</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MdLock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Meetings</h3>
              <p className="text-sm text-gray-600">End-to-end encryption keeps your conversations private</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MdPerson className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">50 Participants</h3>
              <p className="text-sm text-gray-600">Host meetings with up to 50 participants simultaneously</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
