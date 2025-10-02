import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdCheck, MdGroup, MdVideoCall, MdSecurity, MdSupport, MdCloud } from 'react-icons/md';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for individuals and small teams getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Up to 40 minutes per meeting',
        '100 participants maximum',
        'HD video and audio',
        'Screen sharing',
        'Team chat',
        'Basic support'
      ],
      limitations: [
        'No recording',
        'No custom branding',
        'Limited meeting duration'
      ],
      color: 'bg-gray-500',
      buttonText: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      description: 'Best for small to medium businesses and teams',
      monthlyPrice: 14.99,
      yearlyPrice: 12.99,
      features: [
        '24-hour meeting duration',
        'Up to 300 participants',
        'Cloud recording (10GB)',
        'Advanced admin controls',
        'Custom meeting links',
        'Priority support',
        'SSO integration'
      ],
      limitations: [],
      color: 'bg-blue-500',
      buttonText: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with advanced security needs',
      monthlyPrice: 24.99,
      yearlyPrice: 21.99,
      features: [
        'Unlimited meeting duration',
        'Up to 1000 participants',
        'Unlimited cloud recording',
        'Advanced security & compliance',
        'Dedicated customer success manager',
        'Customizable meeting limits',
        '99.9% uptime SLA',
        'White-label solution'
      ],
      limitations: [],
      color: 'bg-purple-500',
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const featuresComparison = [
    {
      feature: 'Meeting duration limit',
      free: '40 minutes',
      pro: '24 hours',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Participants',
      free: '100',
      pro: '300',
      enterprise: '1000+'
    },
    {
      feature: 'Cloud recording',
      free: 'No',
      pro: '10GB',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Custom branding',
      free: 'No',
      pro: 'Basic',
      enterprise: 'Full white-label'
    },
    {
      feature: 'Support',
      free: 'Basic',
      pro: 'Priority',
      enterprise: '24/7 dedicated'
    },
    {
      feature: 'Security compliance',
      free: 'Basic',
      pro: 'Advanced',
      enterprise: 'Enterprise-grade'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        {/* Hero Section */}
        <div className="bg-white py-16 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your needs. All plans include our core features with no hidden fees.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-4 ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative rounded-full w-12 h-6 transition duration-200 ease-linear bg-blue-600"
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                    billingPeriod === 'yearly' ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
              <span className={`ml-4 ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly <span className="text-green-600 text-sm">(Save up to 20%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-600">
                      {plan.monthlyPrice > 0 ? `/user/${billingPeriod === 'monthly' ? 'month' : 'year'}` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => plan.name === 'Enterprise' ? navigate('/enterprise') : navigate('/signup')}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.buttonText}
                  </button>

                  {/* Features */}
                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <MdCheck className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-center text-gray-500">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                          <span className="text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Compare Plans</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Pro</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featuresComparison.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-900">{item.feature}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{item.free}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{item.pro}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{item.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">All paid plans include a 14-day free trial with full features.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards and PayPal.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
                <p className="text-gray-600">We offer a 30-day money-back guarantee on annual plans.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;