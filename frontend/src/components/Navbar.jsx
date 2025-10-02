import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MdVideoCall, MdPerson, MdLogout, MdSettings, MdDashboard } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsProfileOpen(false);
    navigate('/');
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className='fixed w-full bg-white shadow-lg py-4 z-50 border-b border-gray-200'>
      <div className='container mx-auto flex items-center justify-between px-6'>
        {/* Logo */}
        <div className='flex items-center'>
          <div className='flex items-center space-x-3 cursor-pointer' onClick={() => navigate('/')}>
            <div className='bg-blue-600 p-2 rounded-lg'>
              <MdVideoCall className='w-6 h-6 text-white' />
            </div>
            <span className='text-2xl font-bold text-gray-800'>VideoFlow</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className='hidden md:flex items-center gap-8 font-medium text-gray-700'>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `hover:text-blue-600 cursor-pointer transition-colors duration-200 ${
                isActive ? 'text-blue-600 font-semibold' : ''
              }`
            }
          >
            Home
          </NavLink>
          
          <NavLink 
            to="/features" 
            className={({ isActive }) => 
              `hover:text-blue-600 cursor-pointer transition-colors duration-200 ${
                isActive ? 'text-blue-600 font-semibold' : ''
              }`
            }
          >
            Features
          </NavLink>

          <NavLink 
            to="/pricing" 
            className={({ isActive }) => 
              `hover:text-blue-600 cursor-pointer transition-colors duration-200 ${
                isActive ? 'text-blue-600 font-semibold' : ''
              }`
            }
          >
            Pricing
          </NavLink>

          <NavLink 
            to="/enterprise" 
            className={({ isActive }) => 
              `hover:text-blue-600 cursor-pointer transition-colors duration-200 ${
                isActive ? 'text-blue-600 font-semibold' : ''
              }`
            }
          >
            Enterprise
          </NavLink>

          <a 
            href="#contact" 
            className='hover:text-blue-600 cursor-pointer transition-colors duration-200'
          >
            Contact
          </a>
        </div>

        {/* User Section */}
        <div className='flex items-center gap-6'>
          {user ? (
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/join')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Join Meeting
              </button>
              
              {/* User Profile with Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <svg 
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <MdDashboard className="w-4 h-4 mr-3 text-gray-400" />
                        Dashboard
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <MdSettings className="w-4 h-4 mr-3 text-gray-400" />
                        Settings
                      </button>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <MdLogout className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate('/createroom')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Start Meeting
              </button>
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              <button 
                onClick={() => navigate('/signin')}
                className='text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200'
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold shadow-md hover:shadow-lg'
              >
                Start Free
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <button className='text-gray-700 hover:text-blue-600'>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className='md:hidden bg-white shadow-lg border-t border-gray-200'>
        <div className='container mx-auto px-6 py-4 flex flex-col gap-4'>
          <Link to="/" className='text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200'>Home</Link>
          <Link to="/features" className='text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200'>Features</Link>
          <Link to="/pricing" className='text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200'>Pricing</Link>
          <Link to="/enterprise" className='text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200'>Enterprise</Link>
          <a href="#contact" className='text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200'>Contact</a>
          <div className='border-t border-gray-200 pt-4 flex flex-col gap-3'>
            {user ? (
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className='text-blue-600 text-left py-2 font-semibold transition-colors duration-200'
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate('/join')}
                  className='text-blue-600 text-left py-2 font-semibold transition-colors duration-200'
                >
                  Join Meeting
                </button>
                <div className="border-t border-gray-200 pt-2">
                  <button 
                    onClick={handleSignOut}
                    className='text-red-600 text-left py-2 font-semibold transition-colors duration-200 flex items-center'
                  >
                    <MdLogout className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
                <button 
                  onClick={() => navigate('/createroom')}
                  className='bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200'
                >
                  Start Meeting
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/signin')}
                  className='text-blue-600 text-left py-2 font-semibold transition-colors duration-200'
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className='bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200'
                >
                  Start Free
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;