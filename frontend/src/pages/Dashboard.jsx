// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import { MdVideoCall, MdContentCopy, MdHistory, MdPerson, MdGroup, MdCalendarToday, MdBarChart } from 'react-icons/md';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('overview');

//   // Mock data for the dashboard
//   const userStats = {
//     meetingsHosted: 12,
//     totalParticipants: 84,
//     averageDuration: '32min',
//     upcomingMeetings: 2
//   };

//   const recentMeetings = [
//     { id: 1, name: 'Team Standup', date: '2024-01-15', duration: '25min', participants: 8 },
//     { id: 2, name: 'Client Presentation', date: '2024-01-14', duration: '45min', participants: 12 },
//     { id: 3, name: 'Project Planning', date: '2024-01-12', duration: '60min', participants: 6 }
//   ];

//   const upcomingMeetings = [
//     { id: 1, name: 'Weekly Sync', date: 'Today, 10:00 AM', participants: 5 },
//     { id: 2, name: 'Design Review', date: 'Tomorrow, 2:00 PM', participants: 8 }
//   ];

//   const quickActions = [
//     {
//       icon: <MdVideoCall className="w-8 h-8" />,
//       title: 'New Meeting',
//       description: 'Start an instant meeting',
//       action: () => navigate('/createroom'),
//       color: 'bg-blue-500 hover:bg-blue-600'
//     },
//     {
//       icon: <MdCalendarToday className="w-8 h-8" />,
//       title: 'Schedule',
//       description: 'Schedule for later',
//       action: () => navigate('/schedule'),
//       color: 'bg-green-500 hover:bg-green-600'
//     },
//     {
//       icon: <MdGroup className="w-8 h-8" />,
//       title: 'Join Meeting',
//       description: 'Join with a code',
//       action: () => navigate('/join'),
//       color: 'bg-purple-500 hover:bg-purple-600'
//     },
//     {
//       icon: <MdBarChart className="w-8 h-8" />,
//       title: 'Analytics',
//       description: 'View usage stats',
//       action: () => setActiveTab('analytics'),
//       color: 'bg-orange-500 hover:bg-orange-600'
//     }
//   ];

//   const copyMeetingLink = (meetingId) => {
//     const meetingLink = `${window.location.origin}/meeting/${meetingId}`;
//     navigator.clipboard.writeText(meetingLink);
//     alert('Meeting link copied to clipboard!');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="pt-20 pb-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//             <p className="text-gray-600 mt-2">Welcome back! Here's your meeting overview.</p>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-lg shadow p-6">
//               <div className="flex items-center">
//                 <div className="bg-blue-100 p-3 rounded-lg">
//                   <MdVideoCall className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Meetings Hosted</p>
//                   <p className="text-2xl font-bold text-gray-900">{userStats.meetingsHosted}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow p-6">
//               <div className="flex items-center">
//                 <div className="bg-green-100 p-3 rounded-lg">
//                   <MdGroup className="w-6 h-6 text-green-600" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Total Participants</p>
//                   <p className="text-2xl font-bold text-gray-900">{userStats.totalParticipants}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow p-6">
//               <div className="flex items-center">
//                 <div className="bg-purple-100 p-3 rounded-lg">
//                   <MdHistory className="w-6 h-6 text-purple-600" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
//                   <p className="text-2xl font-bold text-gray-900">{userStats.averageDuration}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow p-6">
//               <div className="flex items-center">
//                 <div className="bg-orange-100 p-3 rounded-lg">
//                   <MdCalendarToday className="w-6 h-6 text-orange-600" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Upcoming</p>
//                   <p className="text-2xl font-bold text-gray-900">{userStats.upcomingMeetings}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="mb-8">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {quickActions.map((action, index) => (
//                 <button
//                   key={index}
//                   onClick={action.action}
//                   className={`${action.color} text-white rounded-lg p-6 text-left transition-all duration-300 transform hover:scale-105`}
//                 >
//                   <div className="mb-3">{action.icon}</div>
//                   <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
//                   <p className="text-white text-opacity-90 text-sm">{action.description}</p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Recent Meetings */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900">Recent Meetings</h2>
//               </div>
//               <div className="p-6">
//                 {recentMeetings.map((meeting) => (
//                   <div key={meeting.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
//                     <div>
//                       <h3 className="font-medium text-gray-900">{meeting.name}</h3>
//                       <p className="text-sm text-gray-600">
//                         {meeting.date} • {meeting.duration} • {meeting.participants} participants
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => copyMeetingLink(meeting.id)}
//                       className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
//                     >
//                       <MdContentCopy className="w-4 h-4" />
//                       <span className="text-sm">Copy</span>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Upcoming Meetings */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900">Upcoming Meetings</h2>
//               </div>
//               <div className="p-6">
//                 {upcomingMeetings.map((meeting) => (
//                   <div key={meeting.id} className="py-3 border-b border-gray-100 last:border-b-0">
//                     <h3 className="font-medium text-gray-900">{meeting.name}</h3>
//                     <p className="text-sm text-gray-600">
//                       {meeting.date} • {meeting.participants} participants
//                     </p>
//                     <div className="mt-2 flex space-x-2">
//                       <button
//                         onClick={() => navigate('/createroom')}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
//                       >
//                         Join
//                       </button>
//                       <button
//                         onClick={() => copyMeetingLink(meeting.id)}
//                         className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
//                       >
//                         Copy Link
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//                 {upcomingMeetings.length === 0 && (
//                   <p className="text-gray-500 text-center py-4">No upcoming meetings scheduled</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Getting Started Section */}
//           <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-2xl font-bold mb-2">Getting Started with VideoFlow</h2>
//                 <p className="text-blue-100 mb-4">
//                   Explore all features and make the most of your free trial
//                 </p>
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={() => navigate('/demo')}
//                     className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition-colors"
//                   >
//                     Watch Tutorial
//                   </button>
//                   <button
//                     onClick={() => navigate('/createroom')}
//                     className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-lg font-semibold transition-colors"
//                   >
//                     Start First Meeting
//                   </button>
//                 </div>
//               </div>
//               <div className="hidden lg:block">
//                 <div className="text-6xl">🎯</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdVideoCall, MdContentCopy, MdHistory, MdPerson, MdGroup, MdCalendarToday, MdBarChart } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    meetingsHosted: 0,
    totalParticipants: 0,
    averageDuration: '0min',
    upcomingMeetings: 0
  });
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [statsResponse, recentResponse, upcomingResponse] = await Promise.all([
        fetch('http://localhost:5000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:5000/api/meetings/recent', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:5000/api/meetings/upcoming', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUserStats(statsData);
      }

      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        setRecentMeetings(recentData.meetings || []);
      }

      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        setUpcomingMeetings(upcomingData.meetings || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: <MdVideoCall className="w-8 h-8" />,
      title: 'New Meeting',
      description: 'Start an instant meeting',
      action: () => navigate('/createroom'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: <MdCalendarToday className="w-8 h-8" />,
      title: 'Schedule',
      description: 'Schedule for later',
      action: () => navigate('/schedule'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: <MdGroup className="w-8 h-8" />,
      title: 'Join Meeting',
      description: 'Join with a code',
      action: () => navigate('/join'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: <MdBarChart className="w-8 h-8" />,
      title: 'Analytics',
      description: 'View usage stats',
      action: () => setActiveTab('analytics'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const copyMeetingLink = (meetingId) => {
    const meetingLink = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(meetingLink);
    alert('Meeting link copied to clipboard!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Here's your meeting overview and statistics.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MdVideoCall className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Meetings Hosted</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.meetingsHosted}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MdGroup className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalParticipants}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MdHistory className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.averageDuration}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <MdCalendarToday className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.upcomingMeetings}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white rounded-lg p-6 text-left transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="mb-3">{action.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-white text-opacity-90 text-sm">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Meetings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Meetings</h2>
              </div>
              <div className="p-6">
                {recentMeetings.length > 0 ? (
                  recentMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(meeting.created_at)} • {meeting.duration}min • 
                          {meeting.participant_count || 0} participants
                        </p>
                        {meeting.description && (
                          <p className="text-sm text-gray-500 mt-1">{meeting.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => copyMeetingLink(meeting.meeting_id)}
                        className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 ml-4"
                      >
                        <MdContentCopy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MdHistory className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent meetings</p>
                    <button
                      onClick={() => navigate('/createroom')}
                      className="text-blue-600 hover:text-blue-700 mt-2"
                    >
                      Start your first meeting
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Meetings</h2>
              </div>
              <div className="p-6">
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="py-3 border-b border-gray-100 last:border-b-0">
                      <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(meeting.scheduled_time)} • {meeting.duration}min
                      </p>
                      {meeting.description && (
                        <p className="text-sm text-gray-500 mt-1">{meeting.description}</p>
                      )}
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => navigate(`/meeting/${meeting.meeting_id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Join
                        </button>
                        <button
                          onClick={() => copyMeetingLink(meeting.meeting_id)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MdCalendarToday className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No upcoming meetings</p>
                    <button
                      onClick={() => navigate('/schedule')}
                      className="text-blue-600 hover:text-blue-700 mt-2"
                    >
                      Schedule a meeting
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Getting Started with VideoFlow</h2>
                <p className="text-blue-100 mb-4">
                  Explore all features and make the most of your {user?.plan === 'pro' ? 'Pro' : 'Free'} plan
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/createroom')}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Start First Meeting
                  </button>
                  <button
                    onClick={() => navigate('/schedule')}
                    className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="text-6xl">🎯</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;