import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import { downloadCsv } from '../../lib/download';

const GRADE_STYLES = {
  'A+': 'bg-emerald-100 text-emerald-700',
  'A':  'bg-green-100 text-green-700',
  'B':  'bg-blue-50 text-primary',
  'C':  'bg-amber-50 text-amber-700',
  'D':  'bg-orange-50 text-orange-700',
  'F':  'bg-red-50 text-danger',
};

const gradeFor = (pct) => {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
};

const initialResults = [
  { id: 1, student: 'Sneha Singh',  rollNo: 'CS21B001', exam: 'Operating Systems',           score: 92, total: 100, submittedAt: '2026-04-28T15:22:00', flags: 0 },
  { id: 2, student: 'Rahul Mehta',  rollNo: 'CS21B014', exam: 'Operating Systems',           score: 71, total: 100, submittedAt: '2026-04-28T15:18:00', flags: 1 },
  { id: 3, student: 'Priya Singh',  rollNo: 'CS22B007', exam: 'Operating Systems',           score: 85, total: 100, submittedAt: '2026-04-28T15:20:00', flags: 0 },
  { id: 4, student: 'Ankit Sharma', rollNo: 'CS22B019', exam: 'Operating Systems',           score: 48, total: 100, submittedAt: '2026-04-28T15:25:00', flags: 2 },
  { id: 5, student: 'Sneha Kapoor', rollNo: 'CS23B003', exam: 'Operating Systems',           score: 64, total: 100, submittedAt: '2026-04-28T15:30:00', flags: 0 },
  { id: 6, student: 'Sneha Singh',  rollNo: 'CS21B001', exam: 'Modern Web Frameworks',       score: 54, total: 60,  submittedAt: '2026-05-11T11:02:00', flags: 0 },
  { id: 7, student: 'Rahul Mehta',  rollNo: 'CS21B014', exam: 'Modern Web Frameworks',       score: 38, total: 60,  submittedAt: '2026-05-11T11:05:00', flags: 3 },
  { id: 8, student: 'Priya Singh',  rollNo: 'CS22B007', exam: 'Modern Web Frameworks',       score: 51, total: 60,  submittedAt: '2026-05-11T11:00:00', flags: 1 },
];

const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const AdminResults = () => {
  const [results] = useState(initialResults);
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [viewing, setViewing] = useState(null);

  const exams = useMemo(
    () => Array.from(new Set(results.map((r) => r.exam))).sort(),
    [results]
  );

  const enriched = useMemo(
    () =>
      results.map((r) => {
        const pct = (r.score / r.total) * 100;
        return { ...r, percentage: pct, grade: gradeFor(pct) };
      }),
    [results]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter((r) => {
      const matchesSearch =
        r.student.toLowerCase().includes(q) ||
        r.rollNo.toLowerCase().includes(q);
      const matchesExam  = examFilter  === 'All' || r.exam  === examFilter;
      const matchesGrade = gradeFilter === 'All' || r.grade === gradeFilter;
      return matchesSearch && matchesExam && matchesGrade;
    });
  }, [enriched, search, examFilter, gradeFilter]);

  const stats = useMemo(() => {
    if (filtered.length === 0) {
      return { avg: 0, highest: 0, lowest: 0, passRate: 0 };
    }
    const pcts = filtered.map((r) => r.percentage);
    const passing = pcts.filter((p) => p >= 50).length;
    return {
      avg: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
      highest: Math.round(Math.max(...pcts)),
      lowest:  Math.round(Math.min(...pcts)),
      passRate: Math.round((passing / pcts.length) * 100),
    };
  }, [filtered]);

  const gradeDistribution = useMemo(() => {
    const buckets = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    filtered.forEach((r) => { buckets[r.grade]++; });
    const max = Math.max(1, ...Object.values(buckets));
    return Object.entries(buckets).map(([grade, count]) => ({
      grade,
      count,
      pctOfMax: (count / max) * 100,
    }));
  }, [filtered]);

  const exportCsv = () => {
    downloadCsv(
      filtered,
      [
        { label: 'Student',   get: (r) => r.student },
        { label: 'Roll No',   get: (r) => r.rollNo },
        { label: 'Exam',      get: (r) => r.exam },
        { label: 'Score',     get: (r) => r.score },
        { label: 'Total',     get: (r) => r.total },
        { label: 'Percent',   get: (r) => Math.round(r.percentage) },
        { label: 'Grade',     get: (r) => r.grade },
        { label: 'Flags',     get: (r) => r.flags },
        { label: 'Submitted', get: (r) => r.submittedAt },
      ],
      'examshield-results.csv'
    );
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Results</h1>
          <p className="text-slate-500 mt-1">Exam performance, grade distribution, and integrity flags.</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
          ⬇ Export CSV ({filtered.length})
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.avg}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highest</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{stats.highest}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lowest</p>
          <p className="text-3xl font-bold text-danger mt-2">{stats.lowest}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pass Rate</p>
          <p className="text-3xl font-bold text-primary mt-2">{stats.passRate}%</p>
        </div>
      </div>

      {/* Grade distribution + Filters side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Grade Distribution</h3>
          <p className="text-xs text-slate-500 mb-5">Based on currently filtered results</p>
          <div className="space-y-3">
            {gradeDistribution.map(({ grade, count, pctOfMax }) => (
              <div key={grade} className="flex items-center gap-4">
                <span className={`w-10 text-center px-2 py-1 rounded-md text-xs font-bold ${GRADE_STYLES[grade]}`}>
                  {grade}
                </span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pctOfMax}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-medium text-slate-600">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Filters</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or roll no..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
            />
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="All">All Exams</option>
              {exams.map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="All">All Grades</option>
              {['A+', 'A', 'B', 'C', 'D', 'F'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Individual Results</h3>
          <span className="text-sm text-slate-500">{filtered.length} of {results.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Student</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Exam</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Score</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Grade</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Flags</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Submitted</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No results match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{r.student}</p>
                      <p className="text-xs text-slate-400 font-mono">{r.rollNo}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{r.exam}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{r.score} / {r.total}</p>
                      <p className="text-xs text-slate-500">{Math.round(r.percentage)}%</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${GRADE_STYLES[r.grade]}`}>
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {r.flags > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-danger border border-red-100">
                          ⚠ {r.flags}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Clean</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatTime(r.submittedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setViewing(r)}
                          className="px-3 py-1.5 text-sm font-medium text-primary border border-blue-100 rounded-lg hover:bg-blue-50 transition"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Result detail</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{viewing.student}</h3>
                <p className="text-sm text-slate-500 font-mono">{viewing.rollNo}</p>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Exam</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{viewing.exam}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Submitted</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{formatTime(viewing.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Score</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{viewing.score} / {viewing.total} ({Math.round(viewing.percentage)}%)</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Grade</p>
                  <span className={`inline-block px-2 py-1 mt-0.5 rounded-md text-xs font-bold ${GRADE_STYLES[viewing.grade]}`}>
                    {viewing.grade}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Integrity Flags</p>
                  {viewing.flags > 0 ? (
                    <span className="inline-block mt-0.5 px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-danger border border-red-100">
                      ⚠ {viewing.flags} flag{viewing.flags > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <p className="text-sm text-green-700 font-medium mt-0.5">Clean — no flags</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Percentile</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{Math.max(1, Math.round(viewing.percentage))}th</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5">Performance</p>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      viewing.percentage >= 80 ? 'bg-green-500' :
                      viewing.percentage >= 50 ? 'bg-primary' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${viewing.percentage}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminResults;
