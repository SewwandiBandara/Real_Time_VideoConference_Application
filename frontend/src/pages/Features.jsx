import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdVideoCall, MdSecurity, MdGroup, MdHighQuality, MdScreenShare, MdRecordVoiceOver, MdChat, MdSettings } from 'react-icons/md';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MdHighQuality className="w-12 h-12" />,
      title: 'HD Video & Audio',
      description: 'Crystal clear 1080p video quality with premium audio for professional meetings',
      color: 'bg-blue-500'
    },
    {
      icon: <MdScreenShare className="w-12 h-12" />,
      title: 'Screen Sharing',
      description: 'Share your entire screen, specific windows, or just a browser tab with participants',
      color: 'bg-green-500'
    },
    {
      icon: <MdGroup className="w-12 h-12" />,
      title: 'Large Meetings',
      description: 'Host up to 100 participants in a single meeting with enterprise plans',
      color: 'bg-purple-500'
    },
    {
      icon: <MdRecordVoiceOver className="w-12 h-12" />,
      title: 'Recording',
      description: 'Record your meetings locally or to the cloud with automatic transcription',
      color: 'bg-orange-500'
    },
    {
      icon: <MdChat className="w-12 h-12" />,
      title: 'Team Chat',
      description: 'Real-time messaging, file sharing, and integrated team collaboration',
      color: 'bg-pink-500'
    },
    {
      icon: <MdSecurity className="w-12 h-12" />,
      title: 'Enterprise Security',
      description: 'End-to-end encryption, SSO, and compliance with security standards',
      color: 'bg-red-500'
    }
  ];

  const enterpriseFeatures = [
    'Custom branding',
    'SSO integration',
    'Admin controls',
    '99.9% uptime SLA',
    'Dedicated support',
    'Customizable meeting limits'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for Modern Teams
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Everything you need for seamless video collaboration, from small team meetings to large enterprise webinars
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              VideoFlow combines powerful features with an intuitive interface for the best video meeting experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`${feature.color} text-white p-3 rounded-lg w-fit mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Enterprise Section */}
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Enterprise-Grade Solutions
                </h2>
                <p className="text-blue-200 text-lg mb-6">
                  Scale your organization's collaboration with advanced security, admin controls, and dedicated support.
                </p>
                <ul className="space-y-3 mb-6">
                  {enterpriseFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/enterprise')}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Learn About Enterprise
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 text-gray-900">
                <h3 className="text-xl font-semibold mb-4">Perfect for</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <MdGroup className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">Large Teams</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <MdSecurity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">Security First</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MdSettings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold">IT Teams</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <MdVideoCall className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-semibold">Webinars</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;