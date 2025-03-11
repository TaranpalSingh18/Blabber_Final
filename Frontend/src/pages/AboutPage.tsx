import React from 'react';
import { MessageSquare, Users, Shield, Zap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">About <span className="text-emerald-400">Blabber</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We're revolutionizing the way people connect and communicate online, making distance irrelevant in human connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <MessageSquare className="w-8 h-8 text-emerald-400" />,
              title: "Real-time Chat",
              description: "Experience seamless, instant messaging with crystal-clear communication."
            },
            {
              icon: <Users className="w-8 h-8 text-emerald-400" />,
              title: "Global Community",
              description: "Connect with people from around the world, breaking down geographical barriers."
            },
            {
              icon: <Shield className="w-8 h-8 text-emerald-400" />,
              title: "Secure & Private",
              description: "Your conversations are protected with end-to-end encryption."
            },
            {
              icon: <Zap className="w-8 h-8 text-emerald-400" />,
              title: "Lightning Fast",
              description: "Built with cutting-edge technology for instant message delivery."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            To create a world where distance is no barrier to human connection, enabling meaningful conversations and relationships to flourish across borders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;