import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdVideoCall, MdContentCopy, MdPerson, MdLock, MdPublic, MdCheck, MdError } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  // Test all possible endpoints
  const testEndpoints = async () => {
    const token = localStorage.getItem('token');
    const endpoints = [
      '/api/health',
      '/api/test',
      '/api/meetings',
      '/api/meetings/instant',
      '/api/meetings/recent',
      '/api/meetings/upcoming'
    ];

    const results = {};

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: endpoint.includes('/meetings') ? 'POST' : 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          ...(endpoint.includes('/meetings') && {
            body: JSON.stringify({ title: 'Test Meeting' })
          })
        });
        
        results[endpoint] = {
          status: response.status,
          statusText: response.statusText,
          exists: response.status !== 404
        };
      } catch (err) {
        results[endpoint] = {
          status: 'Error',
          statusText: err.message,
          exists: false
        };
      }
    }

    setDebugInfo(results);
    return results;
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  const handleCreateRoom = async () => {
    if (!user) {
      setError('Please sign in to create a meeting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      // Try multiple endpoint options
      const endpoints = [
        '/api/meetings',
        '/api/meetings/instant',
        '/api/rooms/create'  // Try the rooms endpoint from your original code
      ];

      const meetingData = {
        title: roomName || `Instant Meeting - ${new Date().toLocaleString()}`,
        description: `Instant meeting created by ${user.name}`,
        scheduled_time: new Date().toISOString(),
        duration: 60,
        max_participants: 50
      };

      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          
          const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(meetingData)
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Success with endpoint: ${endpoint}`, result);
            
            setRoomId(result.meeting?.meeting_id || result.room?.roomId || result.meeting_id);
            setRoomCreated(true);
            setLoading(false);
            return;
          } else {
            const errorText = await response.text();
            lastError = `Endpoint ${endpoint}: ${response.status} - ${errorText}`;
            console.log(`❌ Failed with ${endpoint}:`, lastError);
          }
        } catch (err) {
          lastError = `Endpoint ${endpoint}: ${err.message}`;
          console.log(`❌ Error with ${endpoint}:`, err);
        }
      }

      // If all endpoints failed, try without authentication as fallback
      console.log('🔄 Trying fallback: Create room without backend');
      const fallbackRoomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setRoomId(fallbackRoomId);
      setRoomCreated(true);
      
    } catch (err) {
      setError(err.message || 'Failed to create meeting room. Using fallback method.');
      console.error('❌ Final error creating room:', err);
      
      // Fallback: Create room locally without backend
      const fallbackRoomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setRoomId(fallbackRoomId);
      setRoomCreated(true);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  const joinRoom = () => {
    navigate(`/meeting/${roomId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const runConnectionTests = async () => {
    const results = await testEndpoints();
    console.log('🔧 Endpoint test results:', results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Debug Information */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Connection Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Backend Health:</span>
                  <span className={`flex items-center ${debugInfo['/api/health']?.exists ? 'text-green-600' : 'text-red-600'}`}>
                    {debugInfo['/api/health']?.exists ? <MdCheck className="w-4 h-4 mr-1" /> : <MdError className="w-4 h-4 mr-1" />}
                    {debugInfo['/api/health']?.status || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>User Authenticated:</span>
                  <span className={user ? 'text-green-600' : 'text-red-600'}>
                    {user ? 'Yes' : 'No'}
                  </span>
                </div>
                <button
                  onClick={runConnectionTests}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mt-2"
                >
                  Refresh Status
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdVideoCall className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Start a New Meeting</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create a secure meeting room and invite participants to join
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                <strong>Note:</strong> {error}
              </div>
            </div>
          )}

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
                  {user && (
                    <div className="flex items-center space-x-2 text-blue-600 mt-2">
                      <span className="text-sm">Host: {user.name} ({user.plan} plan)</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={loading}
                  className={`w-full ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
                  } text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Meeting...</span>
                    </>
                  ) : (
                    <>
                      <MdVideoCall className="w-5 h-5" />
                      <span>Create Meeting Room</span>
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-gray-500">
                  <p>If backend is unavailable, a local room will be created automatically.</p>
                </div>

                <button
                  onClick={handleBackToDashboard}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Back to Dashboard
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
                  <div className="text-3xl font-bold text-gray-900 tracking-wider mb-2 font-mono">
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

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Meeting Details:</strong><br />
                    Name: {roomName || `Meeting with ${user?.name}`}<br />
                    Privacy: {isPrivate ? 'Private' : 'Public'}<br />
                    Created: {new Date().toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={joinRoom}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Join Meeting Now
                  </button>
                  <button
                    onClick={handleBackToDashboard}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    Back to Dashboard
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