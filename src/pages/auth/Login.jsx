import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

const DEMO_CREDS = {
  student: { email: 'sneha.singh@university.edu', password: 'demo1234' },
  admin:   { email: 'admin@university.edu',       password: 'admin1234' },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setFormData(DEMO_CREDS[role]);
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">
              🛡️
            </div>
            <span className="text-2xl font-bold">ExamShield</span>
          </Link>

          <div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
              Welcome back.
              <br />
              Let's get you back to learning.
            </h1>
            <p className="text-blue-100 text-lg max-w-md leading-relaxed">
              Secure, AI-proctored exams trusted by hundreds of institutions worldwide.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10 max-w-md">
              {[
                { v: '10K+',  l: 'Exams' },
                { v: '99.7%', l: 'Accuracy' },
                { v: '24/7',  l: 'Support' },
              ].map((s) => (
                <div key={s.l} className="border-l-2 border-white/30 pl-3">
                  <p className="text-2xl font-bold">{s.v}</p>
                  <p className="text-xs text-blue-100 uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-blue-100">
            © 2026 ExamShield. Built for Academic Integrity.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-lg">
              🛡️
            </div>
            <span className="text-xl font-bold text-slate-900">ExamShield</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 animate-slide-up">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-slate-500 mt-2">Sign in to access your portal</p>
            </div>

            {/* Role tabs */}
            <div className="bg-slate-100 rounded-xl p-1 flex gap-1 mb-6">
              {[
                { id: 'student', label: '🎓 Student' },
                { id: 'admin',   label: '🛡️ Admin' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                    role === r.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Demo credentials helper */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary">Demo Credentials</p>
                <p className="text-xs text-slate-600 font-mono truncate">
                  {DEMO_CREDS[role].email}
                </p>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="text-xs font-semibold text-primary hover:underline whitespace-nowrap"
              >
                Use Demo →
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  placeholder="you@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-sm"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                Remember me for 30 days
              </label>

              {error && (
                <div className="bg-red-50 border border-red-100 text-danger text-sm px-4 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full py-3" isLoading={isLoading}>
                {isLoading ? 'Signing in...' : `Sign In as ${role === 'admin' ? 'Admin' : 'Student'}`}
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400 uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                <span>🔵</span> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                <span>🎓</span> SSO
              </button>
            </div>

            <p className="text-center mt-6 text-sm text-slate-600">
              New to ExamShield?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
