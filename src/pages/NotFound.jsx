import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
    <div className="max-w-md animate-slide-up">
      <div className="text-8xl md:text-9xl font-extrabold gradient-text leading-none">404</div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-4">Page not found</h1>
      <p className="text-slate-500 mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <Link to="/">
          <Button className="w-full sm:w-auto">← Back to Home</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" className="w-full sm:w-auto">Sign In</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
