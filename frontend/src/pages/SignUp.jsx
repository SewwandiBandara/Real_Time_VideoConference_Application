import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdSecurity, MdCheckCircle, MdVideoCall, MdScreenShare, MdDraw, MdGroup, MdCloud, MdSupport } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    plan: 'free'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signUp(formData);
      navigate('/signin');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <MdVideoCall className="w-6 h-6" />, text: "50 participants per meeting" },
    { icon: <MdScreenShare className="w-6 h-6" />, text: "Screen sharing" },
    { icon: <MdDraw className="w-6 h-6" />, text: "Interactive whiteboard" },
    { icon: <MdSecurity className="w-6 h-6" />, text: "Basic security features" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Start Your Free Trial</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of teams using VideoFlow for seamless collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Signup Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your work email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Choose Your Plan
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.plan === 'free' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onClick={() => setFormData({...formData, plan: 'free'})}
                    >
                      <div className="font-semibold text-gray-900">Free</div>
                      <div className="text-2xl font-bold text-gray-900 mt-2">$0</div>
                      <div className="text-sm text-gray-600">forever</div>
                    </div>
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.plan === 'pro' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onClick={() => setFormData({...formData, plan: 'pro'})}
                    >
                      <div className="font-semibold text-gray-900">Pro</div>
                      <div className="text-2xl font-bold text-gray-900 mt-2">$14.99</div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Start Free Trial'}
                </button>

                <p className="text-center text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>


            {/* Features List */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Free Trial Includes:</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <MdCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">14-Day Free Trial</h4>
                <p className="text-blue-800 text-sm">
                  Get full access to all Pro features for 14 days. No credit card required.
                </p>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Trusted by teams at:</h4>
                <div className="grid grid-cols-2 gap-4 text-gray-600">
                  <div>• TechCorp Inc.</div>
                  <div>• StartupXYZ</div>
                  <div>• Global Solutions</div>
                  <div>• Innovate Labs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;