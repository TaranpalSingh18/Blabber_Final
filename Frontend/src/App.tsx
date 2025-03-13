import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Footer from './pages/Footer';
import Profile from './pages/Profile';

const Layout = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/dashboard";
  
  const showFooter = ["/", "/about", "/contact"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-grow">
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<ContactPage />}
           />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;