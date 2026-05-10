import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
          <p className="text-secondary mt-2">Get started with secure testing</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary" placeholder="name@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary bg-white">
              <option value="student">Student</option>
              <option value="admin">Teacher / Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" title="At least 8 characters" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" />
          </div>

          <Button className="w-full py-3 mt-4">Register Now</Button>
        </form>

        <p className="text-center mt-6 text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;