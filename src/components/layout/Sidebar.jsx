import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ links }) => {
  const location = useLocation();

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
        <button className="flex items-center text-danger hover:bg-red-50 w-full px-4 py-3 rounded-xl transition">
          <span className="mr-3">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;