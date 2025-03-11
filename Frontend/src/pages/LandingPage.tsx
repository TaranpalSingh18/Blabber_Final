import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Lock, UserCheck } from 'lucide-react';
import '../index.css';

const LandingPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen bg-black text-white" 
      style={{ fontFamily: "'Neue Machina', sans-serif" }}
    >
      {/* Hero Section */}
      <div className="pt-56 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-thinner mb-8" style={{ fontFamily: "'Neue Machina', sans-serif" }}>
            We built <span style={{ color: '#22C58B' }}>Blabber</span><br />
            to bring{' '}
            <span 
              className="inline-block" 
              style={{ 
                animation: 'blink 1.5s infinite',
                display: 'inline-block' 
              }}
            >
              people
            </span>{' '}
            closer<br />
            no matter the{' '}
            <span 
              style={{ 
                fontFamily: "'Juana', serif", 
                fontStyle: 'italic', 
                fontWeight: '100' 
              }}
            >
              distance
            </span>
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto mb-8">
            Get ready to{' '}
            <span style={{ color: '#22C58B' }}>accelerate your career</span>{' '}
            with customized courses and leave your mark in the tech industry
          </p>
          <Link 
            to="/signup" 
            className="bg-[#22C58B] text-black px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all"
          >
            Get Started for Free
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg text-center">
              <MessageSquare className="w-12 h-12 text-[#22C58B] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Live Conversations</h3>
              <p className="text-gray-400">
                Experience real-time interactions with our cutting-edge live conversation feature.
              </p>
            </div>
            <div className="p-6 rounded-lg text-center">
              <Lock className="w-12 h-12 text-[#22C58B] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacy & Security</h3>
              <p className="text-gray-400">
                Your conversations are protected with end-to-end encryption.
              </p>
            </div>
            <div className="p-6 rounded-lg text-center">
              <UserCheck className="w-12 h-12 text-[#22C58B] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">User Authentication</h3>
              <p className="text-gray-400">
                Secure login and signup process with Google authentication.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/neue-machina');
          @import url('https://fonts.cdnfonts.com/css/juana');

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;