import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';

const ExamList = () => {
  // Mock data representing what will eventually come from your Backend API
  const [exams] = useState([
    { id: 1, title: "Data Structures & Algorithms", code: "CS301", category: "Core CS", questions: 30, duration: "60 mins", status: "Available" },
    { id: 2, title: "Database Management Systems", code: "CS302", category: "Core CS", questions: 25, duration: "45 mins", status: "Available" },
    { id: 3, title: "Modern Web Frameworks", code: "WD101", category: "Elective", questions: 40, duration: "90 mins", status: "Locked" },
  ]);

  return (
    <DashboardLayout role="student">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Available Exams</h1>
          <p className="text-slate-500 mt-1">Browse and join examinations assigned to your batch.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search by exam name..." 
            className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                  {exam.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{exam.title}</h3>
                <p className="text-sm text-slate-500 font-mono">{exam.code}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                exam.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {exam.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-slate-50">
              <div>
                <p className="text-xs text-slate-400 uppercase">Questions</p>
                <p className="font-semibold text-slate-700">{exam.questions} MCQs</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Time Limit</p>
                <p className="font-semibold text-slate-700">{exam.duration}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant={exam.status === 'Available' ? 'primary' : 'outline'} 
                className="flex-1"
                disabled={exam.status !== 'Available'}
              >
                {exam.status === 'Available' ? 'Register for Exam' : 'Registration Closed'}
              </Button>
              <Button variant="outline" className="px-4">Details</Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ExamList;