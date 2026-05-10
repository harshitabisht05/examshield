import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, role = 'student' }) => {
  const studentLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/student/exams', label: 'Available Exams', icon: '📝' },
    { path: '/student/results', label: 'My Results', icon: '🏆' },
    { path: '/student/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Fixed on the left */}
      <Sidebar links={studentLinks} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-semibold text-slate-700 uppercase tracking-wider text-sm">
            {role} Portal
          </h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-600">Sneha Singh</span>
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
              SS
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;