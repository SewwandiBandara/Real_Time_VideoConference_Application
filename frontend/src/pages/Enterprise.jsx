import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdSecurity, MdSupport, MdCloud, MdBusiness, MdAdminPanelSettings, MdScale } from 'react-icons/md';

const Enterprise = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MdSecurity className="w-12 h-12" />,
      title: 'Advanced Security',
      description: 'Enterprise-grade security with SSO, end-to-end encryption, and compliance certifications',
      details: ['SOC 2 Type II', 'GDPR Compliant', 'End-to-end encryption', 'SSO/SAML']
    },
    {
      icon: <MdScale className="w-12 h-12" />,
      title: 'Scale Limitless',
      description: 'Host thousands of participants with our scalable infrastructure and global CDN',
      details: ['1000+ participants', 'Global infrastructure', '99.9% uptime SLA', 'Custom limits']
    },
    {
      icon: <MdBusiness className="w-12 h-12" />,
      title: 'Custom Branding',
      description: 'White-label solution with your branding, domain, and custom meeting environments',
      details: ['White-label solution', 'Custom domains', 'Branded emails', 'Custom meeting URLs']
    },
    {
      icon: <MdAdminPanelSettings className="w-12 h-12" />,
      title: 'Admin Controls',
      description: 'Comprehensive admin dashboard with user management and usage analytics',
      details: ['User management', 'Usage analytics', 'Policy controls', 'Bulk operations']
    },
    {
      icon: <MdSupport className="w-12 h-12" />,
      title: 'Dedicated Support',
      description: '24/7 premium support with dedicated customer success manager and training',
      details: ['24/7 phone support', 'Dedicated CSM', 'Onboarding training', 'Priority handling']
    },
    {
      icon: <MdCloud className="w-12 h-12" />,
      title: 'Cloud Recording',
      description: 'Unlimited cloud recording with advanced features and custom retention policies',
      details: ['Unlimited storage', 'Custom retention', 'Advanced analytics', 'Auto-transcription']
    }
  ];

  const industries = [
    {
      name: 'Healthcare',
      description: 'Secure telehealth solutions compliant with HIPAA requirements'
    },
    {
      name: 'Education',
      description: 'Virtual classrooms and remote learning for institutions of all sizes'
    },
    {
      name: 'Finance',
      description: 'Compliant video solutions for financial services and banking'
    },
    {
      name: 'Government',
      description: 'Secure video collaboration for government agencies and contractors'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Enterprise-Grade Video Collaboration
                </h1>
                <p className="text-xl text-blue-200 mb-8">
                  Secure, scalable, and customizable video solutions for large organizations. 
                  Trusted by Fortune 500 companies worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                    className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 text-gray-900">
                <h3 className="text-2xl font-bold mb-4">Enterprise Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <MdSecurity className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Advanced security & compliance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <MdScale className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Scale to 1000+ participants</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <MdBusiness className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>Custom branding & white-label</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <MdSupport className="w-4 h-4 text-orange-600" />
                    </div>
                    <span>24/7 dedicated support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Enterprise Needs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed to meet the security, scale, and customization requirements of large organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Industries Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Trusted Across Industries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{industry.name}</h3>
                  <p className="text-sm text-gray-600">{industry.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Organization?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of enterprises that trust VideoFlow for their video collaboration needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Enterprise Trial
              </button>
              <button
                onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Schedule Demo
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="bg-white rounded-2xl shadow-lg p-8 mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Contact Our Sales Team
            </h2>
            <div className="max-w-2xl mx-auto">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your work email"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Contact Sales
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enterprise;