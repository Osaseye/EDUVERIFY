import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-surface-light/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <img 
              alt="EduVerify Logo" 
              className="h-10 w-10 rounded-lg" 
              src="/icon.png" 
            />
            <span className="font-display font-bold text-xl tracking-tight text-primary">EduVerify</span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a className="text-text-muted-light hover:text-primary transition-colors font-medium" href="#features">Features</a>
            <a className="text-text-muted-light hover:text-primary transition-colors font-medium" href="#universities">Universities</a>
            <a className="text-text-muted-light hover:text-primary transition-colors font-medium" href="#pricing">Pricing</a>
            <a className="text-text-muted-light hover:text-primary transition-colors font-medium" href="#resources">Resources</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-primary font-semibold hover:underline">Log in</Link>
            <a className="bg-primary hover:bg-opacity-90 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-primary/30" href="#demo">Book a Demo</a>
          </div>
        </div>
      </div>
    </nav>
  );
};
