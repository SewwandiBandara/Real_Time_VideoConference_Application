import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { 
  MdPerson, 
  MdEmail, 
  MdLock, 
  MdNotifications, 
  MdVideoCall, 
  MdLanguage, 
  MdStorage,
  MdSecurity,
  MdHelp,
  MdSave,
  MdEdit,
  MdCancel
} from 'react-icons/md';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // User profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    jobTitle: 'Software Engineer',
    company: 'TechCorp Inc.',
    timezone: 'UTC-05:00 (Eastern Time)',
    language: 'English'
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    meetingReminders: true,
    participantJoins: true,
    recordingReady: false,
    weeklyReports: true
  });

  // Video settings
  const [videoSettings, setVideoSettings] = useState({
    videoQuality: '720p',
    enableHD: true,
    enableBackgroundBlur: false,
    enableNoiseCancellation: true,
    startWithVideoOn: true,
    startWithAudioOn: false
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    requirePasswordChange: false,
    sessionTimeout: '24 hours',
    loginAlerts: true
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleVideoSettingChange = (setting, value) => {
    setVideoSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSecuritySettingChange = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveProfile = () => {
    // Save profile logic here
    console.log('Saving profile:', profileData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    // Reset to original data
    setProfileData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john@example.com',
      jobTitle: 'Software Engineer',
      company: 'TechCorp Inc.',
      timezone: 'UTC-05:00 (Eastern Time)',
      language: 'English'
    });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <MdPerson className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <MdNotifications className="w-5 h-5" /> },
    { id: 'video', name: 'Video & Audio', icon: <MdVideoCall className="w-5 h-5" /> },
    { id: 'security', name: 'Security', icon: <MdSecurity className="w-5 h-5" /> },
    { id: 'storage', name: 'Storage', icon: <MdStorage className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <nav className="space-y-1 p-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Help Section */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800 mb-2">
                  <MdHelp className="w-5 h-5" />
                  <span className="font-semibold">Need Help?</span>
                </div>
                <p className="text-blue-700 text-sm mb-3">
                  Contact our support team for assistance with your settings.
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Contact Support
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                        <p className="text-gray-600 mt-1">Update your personal and professional details</p>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <MdEdit className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                          >
                            <MdCancel className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                          >
                            <MdSave className="w-4 h-4" />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={profileData.jobTitle}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={profileData.company}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          name="timezone"
                          value={profileData.timezone}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option>UTC-05:00 (Eastern Time)</option>
                          <option>UTC-08:00 (Pacific Time)</option>
                          <option>UTC+00:00 (GMT)</option>
                          <option>UTC+01:00 (Central European)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          name="language"
                          value={profileData.language}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                    <p className="text-gray-600 mt-1">Manage how you receive notifications</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'pushNotifications' && 'Receive push notifications in browser'}
                            {key === 'meetingReminders' && 'Get reminded before meetings start'}
                            {key === 'participantJoins' && 'Notify when participants join your meetings'}
                            {key === 'recordingReady' && 'Get notified when recordings are available'}
                            {key === 'weeklyReports' && 'Receive weekly usage reports'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            value ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              value ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video & Audio Settings */}
              {activeTab === 'video' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Video & Audio Settings</h2>
                    <p className="text-gray-600 mt-1">Configure your meeting experience</p>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Quality
                      </label>
                      <select
                        value={videoSettings.videoQuality}
                        onChange={(e) => handleVideoSettingChange('videoQuality', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="480p">480p (Standard)</option>
                        <option value="720p">720p (HD)</option>
                        <option value="1080p">1080p (Full HD)</option>
                      </select>
                    </div>

                    {[
                      { key: 'enableHD', label: 'Enable HD Video', description: 'Stream in high definition when available' },
                      { key: 'enableBackgroundBlur', label: 'Background Blur', description: 'Automatically blur your background' },
                      { key: 'enableNoiseCancellation', label: 'Noise Cancellation', description: 'Reduce background noise' },
                      { key: 'startWithVideoOn', label: 'Start with Video On', description: 'Join meetings with video enabled' },
                      { key: 'startWithAudioOn', label: 'Start with Audio On', description: 'Join meetings with audio enabled' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{setting.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                        </div>
                        <button
                          onClick={() => handleVideoSettingChange(setting.key, !videoSettings[setting.key])}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            videoSettings[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              videoSettings[setting.key] ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                    <p className="text-gray-600 mt-1">Manage your account security and privacy</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {[
                      { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account' },
                      { key: 'requirePasswordChange', label: 'Require Password Change', description: 'Force password change every 90 days' },
                      { key: 'loginAlerts', label: 'Login Alerts', description: 'Get notified of new sign-ins' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{setting.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                        </div>
                        <button
                          onClick={() => handleSecuritySettingChange(setting.key)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            securitySettings[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              securitySettings[setting.key] ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout
                      </label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1 hour">1 hour</option>
                        <option value="4 hours">4 hours</option>
                        <option value="24 hours">24 hours</option>
                        <option value="1 week">1 week</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Storage Settings */}
              {activeTab === 'storage' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Storage Management</h2>
                    <p className="text-gray-600 mt-1">Manage your cloud storage and recordings</p>
                  </div>

                  <div className="p-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Storage Usage</h3>
                        <span className="text-sm text-gray-600">2.5 GB of 5 GB used</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        You're using 50% of your available storage
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                        Upgrade Storage
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                        Clear Old Recordings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;