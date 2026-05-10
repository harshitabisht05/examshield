import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [comingSoon, setComingSoon] = useState(null);
  const showComingSoon = (label) => (e) => {
    e.preventDefault();
    setComingSoon(label);
    setTimeout(() => setComingSoon(null), 2400);
  };
  const cols = [
    {
      title: 'Product',
      links: [
        { to: '/#features', label: 'Features' },
        { to: '/#how', label: 'How It Works' },
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Sign Up' },
      ],
    },
    {
      title: 'For Educators',
      links: [
        { to: '/admin/dashboard', label: 'Admin Console' },
        { to: '/admin/exams', label: 'Manage Exams' },
        { to: '/admin/students', label: 'Students' },
        { to: '/admin/logs', label: 'Proctor Logs' },
      ],
    },
    {
      title: 'For Students',
      links: [
        { to: '/student/dashboard', label: 'Dashboard' },
        { to: '/student/exams', label: 'Available Exams' },
        { to: '/student/results', label: 'My Results' },
        { to: '/student/profile', label: 'Profile' },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-lg">
                🛡️
              </div>
              <span className="text-xl font-bold text-white">ExamShield</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered online proctoring and examination platform for modern educational institutions.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { ic: '𝕏', label: 'Twitter / X' },
                { ic: 'in', label: 'LinkedIn' },
                { ic: 'gh', label: 'GitHub' },
              ].map(({ ic, label }) => (
                <a
                  key={ic}
                  href="#"
                  onClick={showComingSoon(`${label} — coming soon`)}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary flex items-center justify-center text-sm text-white transition"
                  aria-label={label}
                  title={label}
                >
                  {ic}
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link to={link.to} className="text-sm text-slate-400 hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-slate-500">
            © 2026 ExamShield. Built for Academic Integrity.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            {['Privacy Policy', 'Terms of Service', 'Documentation'].map((label) => (
              <a
                key={label}
                href="#"
                onClick={showComingSoon(`${label} — coming soon`)}
                className="hover:text-white transition"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {comingSoon && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 animate-slide-up">
          {comingSoon}
        </div>
      )}
    </footer>
  );
};

export default Footer;
