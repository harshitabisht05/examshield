import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Exam<span className="text-accent">Shield</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-secondary hover:text-primary transition">Home</Link>
            <Link to="/login">
              <Button variant="outline" className="mr-2">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;