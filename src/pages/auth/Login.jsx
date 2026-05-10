import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); // New: Tracks "logging in" state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Senior Logic: Simulating a network request delay (1.5 seconds)
    console.log("Authenticating user...", formData);

    setTimeout(() => {
      if (formData.email && formData.password) {
        setIsLoading(false);
        navigate('/student/dashboard');
      } else {
        setIsLoading(false);
        alert("Please enter both email and password");
      }
    }, 1500); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 font-sans">Welcome Back</h2>
          <p className="text-secondary mt-2">Login to access your exams</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              placeholder="student@university.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={isLoading} // Prevent typing while loading
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={isLoading}
            />
          </div>

          {/* Our Button component already handles the 'isLoading' prop we wrote earlier! */}
          <Button 
            type="submit" 
            className="w-full py-3" 
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <p className="text-center mt-8 text-secondary">
          New to ExamShield?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;