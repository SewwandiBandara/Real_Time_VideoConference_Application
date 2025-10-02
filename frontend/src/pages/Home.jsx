import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLocalPhone, MdEmail, MdVideoCall, MdSecurity, MdScreenShare, MdShare, MdDraw } from 'react-icons/md';
import { FaUsers, FaDesktop, FaMobileAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Home = () => {
  const features = [
    {
      icon: <MdVideoCall className="w-12 h-12" />,
      title: "Multi-User Video Calling",
      description: "HD video conferencing with up to 50 participants simultaneously in crystal clear 1080p quality"
    },
    {
      icon: <MdScreenShare className="w-12 h-12" />,
      title: "Screen Sharing",
      description: "Share your entire screen, specific applications, or browser tabs with participants in real-time"
    },
    {
      icon: <MdShare className="w-12 h-12" />,
      title: "File Sharing",
      description: "Securely share documents, images, and files instantly during meetings with drag-and-drop functionality"
    },
    {
      icon: <MdDraw className="w-12 h-12" />,
      title: "Interactive Whiteboard",
      description: "Collaborate with digital whiteboard featuring drawing tools, shapes, text, and real-time annotations"
    },
    {
      icon: <FaUsers className="w-12 h-12" />,
      title: "Large Meetings",
      description: "Host up to 1000 participants with enterprise-level webinar capabilities and breakout rooms"
    },
    {
      icon: <MdSecurity className="w-12 h-12" />,
      title: "Enterprise Security",
      description: "End-to-end encryption, password protection, and waiting room features for maximum security"
    }
  ];

  const cardColors = [
    'bg-blue-50 hover:bg-blue-100 border-blue-200',
    'bg-green-50 hover:bg-green-100 border-green-200',
    'bg-purple-50 hover:bg-purple-100 border-purple-200',
    'bg-orange-50 hover:bg-orange-100 border-orange-200',
    'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
    'bg-teal-50 hover:bg-teal-100 border-teal-200'
  ];

  const navigate = useNavigate();

  return (
    <div>
      <Navbar active={"/"} />
      
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-6 py-10 relative bg-gradient-to-br from-blue-600 to-purple-700 pt-20">
        <div className="absolute inset-0"></div>
        
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 hover:shadow-2xl transition-shadow duration-300 relative z-10">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Professional Video Meetings Made Simple
            </h1>
            <p className="text-lg md:text-xl text-blue-600 font-semibold italic">
              Collaborate, Share, and Create Together! 🚀
            </p>
            
            <ul className="list-none space-y-3 text-gray-700 text-lg text-left max-w-3xl mx-auto">
              <li className="flex items-start">
                📹 <strong className="ml-2">Multi-User Video Calls:</strong> Connect with up to 50 participants in HD quality
              </li>
              <li className="flex items-start">
                🖥️ <strong className="ml-2">Screen & File Sharing:</strong> Share your screen and files instantly with team members
              </li>
              <li className="flex items-start">
                🎨 <strong className="ml-2">Interactive Whiteboard:</strong> Brainstorm and collaborate with digital drawing tools
              </li>
              <li className="flex items-start">
                🔒 <strong className="ml-2">Secure & Reliable:</strong> Enterprise-grade security with end-to-end encryption
              </li>
            </ul>
            
            <div className='py-5 flex gap-4 justify-center flex-wrap'>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg 
                          text-lg font-semibold transition-all duration-300 transform 
                          hover:scale-105 shadow-md hover:shadow-lg">
                Start Free Trial
              </button>
              <button 
                onClick={() => navigate('/createroom')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg 
                          text-lg font-semibold transition-all duration-300 transform 
                          hover:scale-105 shadow-md hover:shadow-lg">
                Start Meeting
              </button>
              <button 
                onClick={() => navigate('/demo')}
                className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg 
                          text-lg font-semibold transition-all duration-300 transform 
                          hover:scale-105 shadow-md hover:shadow-lg">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your existing Home component remains the same */}
      {/* Features Section */}
      <div id="features" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
            Core Features
          </h2>
          <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need for productive virtual collaboration and team meetings
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`${cardColors[index % cardColors.length]} rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 border`}>
                <div className="text-center">
                  <div className="flex justify-center mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-4">1</div>
                <h4 className="text-xl font-semibold mb-2">Create or Join</h4>
                <p className="text-gray-600">Start a new meeting or join existing one with a simple code</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-4">2</div>
                <h4 className="text-xl font-semibold mb-2">Collaborate</h4>
                <p className="text-gray-600">Use video, screen sharing, whiteboard and file sharing features</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-4">3</div>
                <h4 className="text-xl font-semibold mb-2">Share & Save</h4>
                <p className="text-gray-600">Save whiteboard sessions and shared files for future reference</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience seamless video collaboration with all core features included
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg 
                        text-lg font-semibold transition-all duration-300 transform 
                        hover:scale-105 shadow-md hover:shadow-lg">
              Sign Up Free
            </button>
            <button 
              onClick={() => navigate('/createroom')}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 
                        text-white px-8 py-3 rounded-lg text-lg font-semibold 
                        transition-all duration-300 transform hover:scale-105">
              Start Instant Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Get In Touch</h2>
          <p className="text-lg text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Have questions about our platform? Our team is here to help you get started.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 hover:-translate-y-1 transition-colors duration-300">
              <div className="flex justify-center mb-4">
                <MdLocalPhone className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sales</h3>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>

            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 hover:-translate-y-1 transition-colors duration-300">
              <div className="flex justify-center mb-4">
                <MdEmail className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <a href="mailto:sales@videflow.com" className="text-blue-400 hover:text-blue-300">
                sales@videflow.com
              </a>
            </div>

            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 hover:-translate-y-1 transition-colors duration-300">
              <div className="flex justify-center mb-4">
                <FaUsers className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Support</h3>
              <a href="mailto:support@videflow.com" className="text-blue-400 hover:text-blue-300">
                support@videflow.com
              </a>
            </div>

            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 hover:-translate-y-1 transition-colors duration-300">
              <div className="flex justify-center mb-4">
                <MdVideoCall className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <a href="mailto:enterprise@videflow.com" className="text-blue-400 hover:text-blue-300">
                enterprise@videflow.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;