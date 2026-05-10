import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';

const EXAM_DETAILS = {
  1: { instructor: 'Dr. Anand Kumar', startsAt: '2026-05-14 10:00 AM', passMark: 50, format: '30 MCQs', allowedAttempts: 1, prerequisites: 'CS201 Programming Fundamentals' },
  2: { instructor: 'Prof. Lakshmi Iyer', startsAt: '2026-05-22 11:00 AM', passMark: 40, format: '25 MCQs', allowedAttempts: 1, prerequisites: 'None' },
  3: { instructor: 'Dr. Rohan Das', startsAt: 'Registration closed', passMark: 50, format: '40 MCQs', allowedAttempts: 1, prerequisites: 'CS301 (recommended)' },
};

const ExamList = () => {
  // Mock data representing what will eventually come from your Backend API
  const [exams] = useState([
    { id: 1, title: "Data Structures & Algorithms", code: "CS301", category: "Core CS", questions: 30, duration: "60 mins", status: "Available" },
    { id: 2, title: "Database Management Systems", code: "CS302", category: "Core CS", questions: 25, duration: "45 mins", status: "Available" },
    { id: 3, title: "Modern Web Frameworks", code: "WD101", category: "Elective", questions: 40, duration: "90 mins", status: "Locked" },
  ]);
  const [detailsId, setDetailsId] = useState(null);
  const detailsExam = exams.find((e) => e.id === detailsId);

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
              {exam.status === 'Available' ? (
                <Link to={`/exam/${exam.id}`} className="flex-1">
                  <Button variant="primary" className="w-full">
                    Start Exam →
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="flex-1" disabled>
                  Registration Closed
                </Button>
              )}
              <Button variant="outline" className="px-4" onClick={() => setDetailsId(exam.id)}>Details</Button>
            </div>
          </div>
        ))}
      </div>

      {detailsExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                  {detailsExam.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{detailsExam.title}</h3>
                <p className="text-sm text-slate-500 font-mono">{detailsExam.code}</p>
              </div>
              <button
                onClick={() => setDetailsId(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-4 text-sm">
              {[
                ['Instructor', EXAM_DETAILS[detailsExam.id]?.instructor || '—'],
                ['Starts at', EXAM_DETAILS[detailsExam.id]?.startsAt || '—'],
                ['Format', EXAM_DETAILS[detailsExam.id]?.format || `${detailsExam.questions} questions`],
                ['Time limit', detailsExam.duration],
                ['Pass mark', `${EXAM_DETAILS[detailsExam.id]?.passMark || 50}%`],
                ['Allowed attempts', EXAM_DETAILS[detailsExam.id]?.allowedAttempts || 1],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{value}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Prerequisites</p>
                <p className="font-medium text-slate-700 mt-0.5">{EXAM_DETAILS[detailsExam.id]?.prerequisites || 'None'}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDetailsId(null)}>Close</Button>
              {detailsExam.status === 'Available' && (
                <Link to={`/exam/${detailsExam.id}`}>
                  <Button variant="primary">Start Exam →</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ExamList;