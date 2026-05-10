import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getFirstName } from '../../lib/user';

const UPCOMING = [
  { id: 1, name: 'Data Structures Midterm',   subject: 'Computer Science', date: '2026-05-14', time: '10:00 AM', duration: '60 mins', status: 'starts in 3 days' },
  { id: 2, name: 'Advanced React Quiz',       subject: 'Web Development',  date: '2026-05-16', time: '2:00 PM',  duration: '30 mins', status: 'starts in 5 days' },
  { id: 3, name: 'Database Systems Final',    subject: 'Computer Science', date: '2026-05-20', time: '11:00 AM', duration: '90 mins', status: 'starts in 9 days' },
];

const ACTIVITY = [
  { type: 'completed',  text: 'Submitted Introduction to Psychology',    time: '2 days ago' },
  { type: 'badge',      text: 'Earned "Perfect Score" badge in Math 101', time: '4 days ago' },
  { type: 'completed',  text: 'Submitted Data Structures Midterm',       time: '1 week ago' },
  { type: 'announced',  text: 'New exam announced: Database Systems Final', time: '1 week ago' },
];

const ACTIVITY_ICONS = {
  completed: { icon: '✓', cls: 'bg-green-100 text-green-700' },
  badge:     { icon: '🏆', cls: 'bg-amber-100 text-amber-700' },
  announced: { icon: '📢', cls: 'bg-blue-100 text-primary' },
};

const StudentDashboard = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout role="student">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 mb-8 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-wrap justify-between items-end gap-4">
          <div>
            <p className="text-blue-100 text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="text-3xl md:text-4xl font-bold mt-1">Welcome back, {getFirstName(user?.name)} 👋</h1>
            <p className="text-blue-100 mt-2 max-w-lg">
              You have <span className="font-semibold text-white">{UPCOMING.length} upcoming exams</span> this week.
              Stay sharp — your next exam starts in 3 days.
            </p>
          </div>
          <Link to="/student/exams">
            <button className="px-5 py-2.5 rounded-lg bg-white text-primary font-bold hover:bg-blue-50 transition">
              Browse Exams →
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending Exams',  value: '02', icon: '📝', accent: 'bg-blue-50 text-primary' },
          { label: 'Completed',      value: '14', icon: '✅', accent: 'bg-green-50 text-green-700' },
          { label: 'Avg. Score',     value: '92%', icon: '🏆', accent: 'bg-amber-50 text-amber-700' },
          { label: 'Rank',           value: '#4', icon: '⭐', accent: 'bg-purple-50 text-purple-600' },
        ].map((c) => (
          <div key={c.label} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{c.value}</h3>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${c.accent}`}>
                {c.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid: Upcoming + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Upcoming Examinations</h2>
            <Link to="/student/exams" className="text-sm font-semibold text-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {UPCOMING.map((exam) => (
              <div key={exam.id} className="px-6 py-4 hover:bg-slate-50/60 transition">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs text-slate-500 font-medium uppercase">
                        {new Date(exam.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-primary leading-none">
                        {new Date(exam.date).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{exam.name}</p>
                      <p className="text-sm text-slate-500">{exam.subject} • {exam.time} • {exam.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                      {exam.status}
                    </span>
                    <Link to={`/exam/${exam.id}`}>
                      <Button variant="outline" className="text-sm py-1.5 px-4">Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Recent Activity</h2>
            <p className="text-xs text-slate-500">Your last few interactions</p>
          </div>
          <ul className="flex-1 divide-y divide-slate-100">
            {ACTIVITY.map((a, i) => {
              const meta = ACTIVITY_ICONS[a.type];
              return (
                <li key={i} className="px-6 py-3.5 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${meta.cls}`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{a.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="px-6 py-3 border-t border-slate-100">
            <Link to="/student/results" className="text-sm font-semibold text-primary hover:underline">
              View all results →
            </Link>
          </div>
        </div>
      </div>

      {/* Tip strip */}
      <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">💡</div>
          <div>
            <h3 className="font-bold text-lg">Pro tip for your next exam</h3>
            <p className="text-sm text-slate-300 mt-1">
              Run the system check 15 minutes before start time — verify your camera, mic, and stable internet connection.
            </p>
          </div>
        </div>
        <Link to="/student/profile">
          <button className="px-4 py-2 rounded-lg font-medium border border-slate-600 text-white hover:bg-slate-700 transition">
            System Check
          </button>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
