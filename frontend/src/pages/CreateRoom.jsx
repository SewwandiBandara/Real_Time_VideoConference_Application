import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdVideoCall, MdContentCopy, MdPerson, MdLock, MdPublic } from 'react-icons/md';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setRoomCreated(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
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
                    Meeting Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter meeting name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Meeting Privacy
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        !isPrivate ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onClick={() => setIsPrivate(false)}
                    >
                      <MdPublic className="w-8 h-8 text-gray-600 mb-2" />
                      <div className="font-semibold text-gray-900">Public</div>
                      <div className="text-sm text-gray-600">Anyone with link can join</div>
                    </div>
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        isPrivate ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onClick={() => setIsPrivate(true)}
                    >
                      <MdLock className="w-8 h-8 text-gray-600 mb-2" />
                      <div className="font-semibold text-gray-900">Private</div>
                      <div className="text-sm text-gray-600">Requires approval to join</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <MdPerson className="w-5 h-5" />
                    <span className="font-medium">Up to 50 participants</span>
                  </div>
                </div>

                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <MdVideoCall className="w-5 h-5" />
                  <span>Create Meeting Room</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MdVideoCall className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting Room Created!</h2>
                <p className="text-gray-600 mb-6">Share this code with participants to join your meeting</p>
                
                <div className="bg-gray-100 p-6 rounded-lg mb-6">
                  <div className="text-3xl font-bold text-gray-900 tracking-wider mb-2">
                    {roomId}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center space-x-2 mx-auto"
                  >
                    <MdContentCopy className="w-4 h-4" />
                    <span>Copy Room Code</span>
                  </button>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={joinRoom}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Join Meeting Now
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;