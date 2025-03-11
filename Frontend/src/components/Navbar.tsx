import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-black/50 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold">blabber</span>
          </Link>
          
          <div className="flex items-center space-x-20">
            <Link to="/" className="hover:text-emerald-400">Home</Link>
            <Link to="/about" className="hover:text-emerald-400">About</Link>
            <Link to="/contact" className="hover:text-emerald-400">Contact Us</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-emerald-400">Login</Link>
            <Link 
              to="/signup" 
              className="bg-emerald-400 text-black px-4 py-2 rounded-full hover:bg-emerald-500 transition-colors"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;