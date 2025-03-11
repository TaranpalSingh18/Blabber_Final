import React from "react";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import logo from "../assets/logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white px-6 py-12 pt-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="space-y-4">
            <img
              src={logo}
              alt="Sheriyans Coding School"
              className="w-50 h-50 -mb-15"
            />
            <p className="text-sm">Let's connect with our socials</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-400">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-gray-400">
                <FaLinkedin />
              </a>
              <a href="#" className="hover:text-gray-400">
                <FaTwitter />
              </a>
            </div>
          </div>

 
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">COMPANY</h3>
            <div className="flex flex-col space-y-2">
              <a href="#" className="hover:text-gray-400">
                About Us
              </a>
              <a href="#" className="hover:text-gray-400">
                Support
              </a>
              <a href="#" className="hover:text-gray-400">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-400">
                Terms and Condition
              </a>
              <a href="#" className="hover:text-gray-400">
                Pricing and Refund
              </a>
              <a href="#" className="hover:text-gray-400">
                Hire From Us
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">COMMUNITY</h3>
            <div className="flex flex-col space-y-2">
              <a href="#" className="hover:text-gray-400">
                Inertia
              </a>
              <a href="#" className="hover:text-gray-400">
                Discord
              </a>
            </div>
          </div>

       
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get In Touch</h3>
            <div className="flex flex-col space-y-2">
              <p>Taran Pal Singh</p>
              <p>Sparsh Khatwani</p>
              <p>hello@blabber.com</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm">Copyright © 2025 Blabber Pvt. Ltd.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;