import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ links }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden lg:flex flex-col">
      <div className="p-6">
        <span className="text-xl font-bold text-primary italic">ExamShield</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center px-4 py-3 rounded-xl transition ${
              location.pathname === link.path 
                ? 'bg-blue-50 text-primary font-semibold' 
                : 'text-secondary hover:bg-slate-50'
            }`}
          >
            <span className="mr-3">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center text-danger hover:bg-red-50 w-full px-4 py-3 rounded-xl transition"
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

export default Sidebar;