import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';

const StudentDashboard = () => {
  const exams = [
    { id: 1, name: "Data Structures Midterm", subject: "Computer Science", date: "Oct 24, 2026", duration: "60 mins" },
    { id: 2, name: "Advanced React Quiz", subject: "Web Development", date: "Oct 26, 2026", duration: "30 mins" },
  ];

  return (
    <DashboardLayout role="student">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, Sneha! 👋</h1>
        <p className="text-slate-500">You have {exams.length} exams scheduled for this week.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Pending Exams</p>
          <h3 className="text-3xl font-bold text-primary mt-1">02</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Completed</p>
          <h3 className="text-3xl font-bold text-success mt-1">14</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Avg. Score</p>
          <h3 className="text-3xl font-bold text-accent mt-1">92%</h3>
        </div>
      </div>

      {/* Upcoming Exams Section */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Examinations</h2>
      <div className="grid gap-4">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900">{exam.name}</h4>
              <p className="text-sm text-slate-500">{exam.subject} • {exam.duration}</p>
            </div>
            <div className="text-right flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600">{exam.date}</span>
              <Button variant="outline" className="text-sm py-1 px-4">View Details</Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;