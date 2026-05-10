import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import { downloadFile, downloadCsv } from '../../lib/download';
import { useAuth } from '../../contexts/AuthContext';

const buildReport = (row, studentName) => `EXAMSHIELD — INDIVIDUAL EXAM REPORT
============================================

Student   : ${studentName}
Exam      : ${row.exam}
Subject   : ${row.subject}
Date      : ${new Date(row.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Score     : ${row.score} / ${row.total}
Percentage: ${Math.round(row.percentage)}%
Status    : ${row.status}

Generated : ${new Date().toLocaleString()}
`;

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const STATUS_STYLES = {
  Passed: 'bg-green-100 text-green-700',
  Failed: 'bg-red-50 text-danger',
};

const initialResults = [
  { id: 1, exam: 'Introduction to Psychology',  subject: 'Liberal Arts',     date: '2026-05-05', score: 88, total: 100 },
  { id: 2, exam: 'Data Structures Midterm',     subject: 'Computer Science', date: '2026-05-02', score: 92, total: 100 },
  { id: 3, exam: 'Discrete Mathematics',        subject: 'Mathematics',      date: '2026-04-28', score: 74, total: 100 },
  { id: 4, exam: 'Operating Systems',           subject: 'Computer Science', date: '2026-04-20', score: 81, total: 100 },
  { id: 5, exam: 'English Communication',       subject: 'Liberal Arts',     date: '2026-04-12', score: 95, total: 100 },
  { id: 6, exam: 'Calculus II',                 subject: 'Mathematics',      date: '2026-04-05', score: 48, total: 100 },
];

const Results = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const subjects = Array.from(new Set(initialResults.map((r) => r.subject))).sort();

  const enriched = initialResults.map((r) => {
    const pct = (r.score / r.total) * 100;
    return { ...r, percentage: pct, status: pct >= 50 ? 'Passed' : 'Failed' };
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter((r) => {
      const matchesSearch  = r.exam.toLowerCase().includes(q);
      const matchesSubject = subjectFilter === 'All' || r.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [search, subjectFilter, enriched]);

  const stats = useMemo(() => {
    const pcts = filtered.map((r) => r.percentage);
    if (pcts.length === 0) return { avg: 0, best: 0, passed: 0 };
    return {
      avg: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
      best: Math.round(Math.max(...pcts)),
      passed: filtered.filter((r) => r.status === 'Passed').length,
    };
  }, [filtered]);

  const downloadOne = (row) => {
    const studentName = user?.name || 'Student';
    downloadFile(
      buildReport(row, studentName),
      `examshield-report-${slugify(row.exam)}.txt`
    );
  };

  const downloadAll = () => {
    downloadCsv(
      filtered,
      [
        { label: 'Exam', get: (r) => r.exam },
        { label: 'Subject', get: (r) => r.subject },
        { label: 'Date', get: (r) => r.date },
        { label: 'Score', get: (r) => r.score },
        { label: 'Total', get: (r) => r.total },
        { label: 'Percentage', get: (r) => Math.round(r.percentage) },
        { label: 'Status', get: (r) => r.status },
      ],
      'examshield-results.csv'
    );
  };

  return (
    <DashboardLayout role="student">
      <div className="mb-8 flex justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Results</h1>
          <p className="text-slate-500 mt-1">Your past exam performance and detailed reports.</p>
        </div>
        <Button variant="outline" onClick={downloadAll} disabled={filtered.length === 0}>
          ⬇ Download All (CSV)
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
          <p className="text-3xl font-bold gradient-text mt-2">{stats.avg}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Score</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{stats.best}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Exams Passed</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.passed} / {filtered.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by exam name..."
          className="flex-1 min-w-[240px] px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
        />
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="All">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Results table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Exam</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Date</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Score</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Performance</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No results match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{r.exam}</p>
                      <p className="text-xs text-slate-500">{r.subject}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(r.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{r.score} <span className="text-sm font-normal text-slate-400">/ {r.total}</span></p>
                      <p className="text-xs text-slate-500">{Math.round(r.percentage)}%</p>
                    </td>
                    <td className="px-6 py-4 min-w-[160px]">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            r.percentage >= 80 ? 'bg-green-500' :
                            r.percentage >= 50 ? 'bg-primary' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${r.percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => downloadOne(r)}
                        className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        📄 Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Results;
