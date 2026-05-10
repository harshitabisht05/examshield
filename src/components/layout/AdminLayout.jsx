import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../lib/user';

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-semibold text-slate-700 uppercase tracking-wider text-sm">
            Admin Portal
          </h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-600">{user?.name || 'Admin'}</span>
            <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
