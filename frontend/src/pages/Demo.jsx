import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MdPlayArrow, MdPause, MdReplay, MdCheckCircle } from 'react-icons/md';

const Demo = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      title: "Multi-User Video Calling",
      description: "Experience crystal clear HD video with up to 50 participants",
      video: "/demos/video-call-demo.mp4", // Replace with actual demo video
      points: [
        "HD 1080p video quality",
        "Up to 50 participants",
        "Noise cancellation",
        "Background blur"
      ]
    },
    {
      title: "Screen Sharing",
      description: "Share your entire screen or specific applications seamlessly",
      video: "/demos/screen-share-demo.mp4",
      points: [
        "Full screen or application sharing",
        "Multiple share options",
        "Smooth performance",
        "Annotation tools"
      ]
    },
    {
      title: "Interactive Whiteboard",
      description: "Collaborate in real-time with powerful drawing and annotation tools",
      video: "/demos/whiteboard-demo.mp4",
      points: [
        "Real-time collaboration",
        "Multiple drawing tools",
        "Shapes and text",
        "Save and export"
      ]
    },
    {
      title: "File Sharing",
      description: "Share documents and files instantly during meetings",
      video: "/demos/file-share-demo.mp4",
      points: [
        "Drag and drop interface",
        "Multiple file types",
        "Secure transfer",
        "Instant access"
      ]
    }
  ];

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">See VideoFlow in Action</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Watch how teams use VideoFlow to collaborate effectively
            </p>
          </div>

          {/* Demo Player */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-12">
            <div className="aspect-w-16 aspect-h-9 bg-black">
              {/* Video placeholder - replace with actual video */}
              <div className="w-full h-96 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎬</div>
                  <div className="text-2xl font-semibold">{features[currentFeature].title}</div>
                  <div className="text-gray-200 mt-2">Demo Video Player</div>
                  
                  <div className="mt-6 flex justify-center space-x-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold flex items-center space-x-2"
                    >
                      {isPlaying ? <MdPause className="w-5 h-5" /> : <MdPlayArrow className="w-5 h-5" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                    <button
                      onClick={() => setCurrentFeature(0)}
                      className="bg-gray-700 text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2"
                    >
                      <MdReplay className="w-5 h-5" />
                      <span>Restart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {features[currentFeature].title}
              </h3>
              <p className="text-gray-300 mb-4">
                {features[currentFeature].description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features[currentFeature].points.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300">
                    <MdCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all ${
                  currentFeature === index ? 'ring-2 ring-blue-500' : 'hover:bg-gray-700'
                }`}
                onClick={() => setCurrentFeature(index)}
              >
                <div className="text-blue-400 text-sm font-semibold mb-2">
                  Feature {index + 1}
                </div>
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevFeature}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Previous Feature
            </button>
            
            <div className="flex space-x-2">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    currentFeature === index ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextFeature}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Next Feature
            </button>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Try It Yourself?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your free trial and experience seamless collaboration
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => navigate('/create-room')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Start Meeting Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;