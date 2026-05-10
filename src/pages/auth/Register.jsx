import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

const passwordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8)             score++;
  if (/[A-Z]/.test(pw))           score++;
  if (/[0-9]/.test(pw))           score++;
  if (/[^A-Za-z0-9]/.test(pw))    score++;
  return score; // 0..4
};

const STRENGTH_META = [
  { label: 'Too weak', color: 'bg-red-500',    text: 'text-red-600' },
  { label: 'Weak',     color: 'bg-orange-500', text: 'text-orange-600' },
  { label: 'Fair',     color: 'bg-amber-500',  text: 'text-amber-600' },
  { label: 'Good',     color: 'bg-blue-500',   text: 'text-blue-600' },
  { label: 'Strong',   color: 'bg-green-500',  text: 'text-green-600' },
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = passwordStrength(formData.password);
  const meta = STRENGTH_META[strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in every field.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!formData.agree) {
      setError('Please accept the terms to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
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
              Join the future of
              <br />
              secure examinations.
            </h1>
            <p className="text-blue-100 text-lg max-w-md leading-relaxed mb-8">
              Create your account in seconds and start taking — or hosting — proctored exams today.
            </p>

            <ul className="space-y-3 max-w-md">
              {[
                'AI-powered face & gaze monitoring',
                'Instant auto-grading and analytics',
                'Tamper-proof exam delivery',
                'Free for individual students',
              ].map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-sm">
                    ✓
                  </span>
                  <span className="text-blue-50">{b}</span>
                </li>
              ))}
            </ul>
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
              <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
              <p className="text-slate-500 mt-2">Start your secure-testing journey</p>
            </div>

            {/* Role tabs */}
            <div className="bg-slate-100 rounded-xl p-1 flex gap-1 mb-5">
              {[
                { id: 'student', label: '🎓 Student' },
                { id: 'admin',   label: '🛡️ Educator' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                    formData.role === r.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  placeholder="e.g. Aisha Khan"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  placeholder="you@university.edu"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="At least 8 characters"
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

                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1 rounded-full transition ${
                            i < strength ? meta.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium mt-1 ${meta.text}`}>
                      Password strength: {meta.label}
                    </p>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span>
                  I agree to the <a href="#" className="text-primary font-semibold hover:underline">Terms of Service</a>{' '}
                  and <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>.
                </span>
              </label>

              {error && (
                <div className="bg-red-50 border border-red-100 text-danger text-sm px-4 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full py-3" isLoading={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account →'}
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
