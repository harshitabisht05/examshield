import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';

const STAT_CARDS = [
  { label: 'Total Exams',     value: 24,  delta: '+3 this month', icon: '📝', accent: 'bg-blue-50 text-primary' },
  { label: 'Active Students', value: 1284, delta: '+128 this week', icon: '👥', accent: 'bg-indigo-50 text-indigo-600' },
  { label: 'Live / Scheduled', value: 6,  delta: '2 starting today', icon: '🟢', accent: 'bg-green-50 text-green-700' },
  { label: 'Avg. Score',      value: '78%', delta: '+4% vs last term', icon: '🏆', accent: 'bg-amber-50 text-amber-700' },
];

const RECENT_EXAMS = [
  { id: 1, title: 'Data Structures & Algorithms', date: '2026-05-20', candidates: 142, status: 'Scheduled' },
  { id: 3, title: 'Modern Web Frameworks',        date: '2026-05-12', candidates: 87,  status: 'Live' },
  { id: 4, title: 'Operating Systems',            date: '2026-04-28', candidates: 198, status: 'Completed' },
  { id: 2, title: 'Database Management Systems',  date: '2026-05-22', candidates: 0,   status: 'Draft' },
];

const PROCTOR_ALERTS = [
  { id: 1, student: 'Rahul Mehta',     exam: 'Modern Web Frameworks', type: 'Tab switch',       severity: 'high',   time: '2m ago' },
  { id: 2, student: 'Priya Singh',     exam: 'Modern Web Frameworks', type: 'Face not detected', severity: 'medium', time: '5m ago' },
  { id: 3, student: 'Ankit Sharma',    exam: 'Modern Web Frameworks', type: 'Multiple faces',   severity: 'high',   time: '11m ago' },
  { id: 4, student: 'Sneha Kapoor',    exam: 'Modern Web Frameworks', type: 'Audio anomaly',    severity: 'low',    time: '18m ago' },
];

const STATUS_STYLES = {
  Draft:     'bg-slate-100 text-slate-600',
  Scheduled: 'bg-blue-50 text-primary',
  Live:      'bg-green-100 text-green-700',
  Completed: 'bg-slate-200 text-slate-700',
};

const SEVERITY_STYLES = {
  high:   'bg-red-50 text-danger border-red-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  low:    'bg-slate-50 text-slate-600 border-slate-100',
};

const AdminDashboard = () => {
  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Admin</h1>
          <p className="text-slate-500 mt-1">Here's what's happening across ExamShield today.</p>
        </div>
        <Link to="/admin/exams">
          <Button variant="primary">+ Create New Exam</Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${card.accent}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">{card.delta}</p>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Exams */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Exams</h3>
            <Link to="/admin/exams" className="text-sm font-semibold text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Exam</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Candidates</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_EXAMS.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{exam.title}</p>
                      <p className="text-xs text-slate-400 font-mono">EX-{String(exam.id).padStart(4, '0')}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(exam.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{exam.candidates}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[exam.status]}`}>
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Proctor Alerts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">Proctor Alerts</h3>
              <p className="text-xs text-slate-500">Live anomaly feed</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <ul className="flex-1 divide-y divide-slate-100">
            {PROCTOR_ALERTS.map((alert) => (
              <li key={alert.id} className="px-6 py-4 hover:bg-slate-50/60 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{alert.student}</p>
                    <p className="text-xs text-slate-500 truncate">{alert.exam}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{alert.time}</span>
                </div>
                <span className={`mt-2 inline-block px-2 py-1 rounded-md text-xs font-medium border ${SEVERITY_STYLES[alert.severity]}`}>
                  {alert.type}
                </span>
              </li>
            ))}
          </ul>
          <div className="px-6 py-3 border-t border-slate-100">
            <Link to="/admin/logs" className="text-sm font-semibold text-primary hover:underline">
              View all logs →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Need to onboard a new batch?</h3>
          <p className="text-sm text-slate-300 mt-1">Bulk-import students via CSV and assign them to upcoming exams.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/students">
            <button className="px-4 py-2 rounded-lg font-medium bg-white text-slate-900 hover:bg-slate-100 transition">
              Manage Students
            </button>
          </Link>
          <Link to="/admin/exams">
            <button className="px-4 py-2 rounded-lg font-medium border border-slate-600 text-white hover:bg-slate-700 transition">
              Schedule Exam
            </button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
