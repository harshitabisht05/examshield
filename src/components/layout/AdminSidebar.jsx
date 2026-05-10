import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const links = [
    { path: '/admin/dashboard', label: 'Overview', icon: '📊' },
    { path: '/admin/exams', label: 'Manage Exams', icon: '📝' },
    { path: '/admin/students', label: 'Students', icon: '👥' },
    { path: '/admin/results', label: 'Results', icon: '🏆' },
    { path: '/admin/logs', label: 'Proctor Logs', icon: '🛡️' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 hidden lg:flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white italic">ExamShield</span>
        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Admin Console</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-4 py-3 rounded-xl transition ${
                active
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
        >
          <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H9m4-9H5a2 2 0 00-2 2v14a2 2 0 002 2h8" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
