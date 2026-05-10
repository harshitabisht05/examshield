import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import { downloadCsv } from '../../lib/download';

const SEVERITY_STYLES = {
  high:   { dot: 'bg-red-500',    badge: 'bg-red-50 text-danger border-red-100' },
  medium: { dot: 'bg-amber-500',  badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  low:    { dot: 'bg-slate-400',  badge: 'bg-slate-50 text-slate-600 border-slate-100' },
};

const EVENT_ICONS = {
  'Tab switch':         '🪟',
  'Face not detected':  '👁️',
  'Multiple faces':     '👥',
  'Audio anomaly':      '🔊',
  'Copy attempt':       '📋',
  'Window blur':        '🌫️',
};

const initialLogs = [
  { id: 101, student: 'Rahul Mehta',  rollNo: 'CS21B014', exam: 'Modern Web Frameworks', type: 'Tab switch',        severity: 'high',   timestamp: '2026-05-11T10:48:00', resolved: false },
  { id: 102, student: 'Priya Singh',  rollNo: 'CS22B007', exam: 'Modern Web Frameworks', type: 'Face not detected', severity: 'medium', timestamp: '2026-05-11T10:45:12', resolved: false },
  { id: 103, student: 'Ankit Sharma', rollNo: 'CS22B019', exam: 'Modern Web Frameworks', type: 'Multiple faces',    severity: 'high',   timestamp: '2026-05-11T10:39:30', resolved: false },
  { id: 104, student: 'Sneha Kapoor', rollNo: 'CS23B003', exam: 'Modern Web Frameworks', type: 'Audio anomaly',     severity: 'low',    timestamp: '2026-05-11T10:32:05', resolved: true  },
  { id: 105, student: 'Rahul Mehta',  rollNo: 'CS21B014', exam: 'Modern Web Frameworks', type: 'Copy attempt',      severity: 'high',   timestamp: '2026-05-11T10:21:48', resolved: false },
  { id: 106, student: 'Sneha Singh',  rollNo: 'CS21B001', exam: 'Operating Systems',     type: 'Window blur',       severity: 'low',    timestamp: '2026-04-28T14:15:22', resolved: true  },
  { id: 107, student: 'Priya Singh',  rollNo: 'CS22B007', exam: 'Modern Web Frameworks', type: 'Tab switch',        severity: 'high',   timestamp: '2026-05-11T10:12:10', resolved: false },
  { id: 108, student: 'Ankit Sharma', rollNo: 'CS22B019', exam: 'Operating Systems',     type: 'Face not detected', severity: 'medium', timestamp: '2026-04-28T13:58:41', resolved: true  },
];

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const ProctorLogs = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [examFilter, setExamFilter] = useState('All');
  const [showResolved, setShowResolved] = useState(true);

  const exams = useMemo(
    () => Array.from(new Set(logs.map((l) => l.exam))).sort(),
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter((l) => {
      const matchesSearch =
        l.student.toLowerCase().includes(q) ||
        l.rollNo.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q);
      const matchesSeverity = severityFilter === 'All' || l.severity === severityFilter;
      const matchesExam     = examFilter     === 'All' || l.exam     === examFilter;
      const matchesResolved = showResolved   || !l.resolved;
      return matchesSearch && matchesSeverity && matchesExam && matchesResolved;
    });
  }, [logs, search, severityFilter, examFilter, showResolved]);

  const summary = useMemo(() => ({
    total:   logs.length,
    high:    logs.filter((l) => l.severity === 'high' && !l.resolved).length,
    medium:  logs.filter((l) => l.severity === 'medium' && !l.resolved).length,
    pending: logs.filter((l) => !l.resolved).length,
  }), [logs]);

  const toggleResolved = (id) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, resolved: !l.resolved } : l))
    );
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Proctor Logs</h1>
          <p className="text-slate-500 mt-1">Anomalies detected during live examinations.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live feed
          </span>
          <Button
            variant="outline"
            onClick={() => downloadCsv(
              filteredLogs,
              [
                { label: 'Student',   get: (l) => l.student },
                { label: 'Roll No',   get: (l) => l.rollNo },
                { label: 'Exam',      get: (l) => l.exam },
                { label: 'Event',     get: (l) => l.type },
                { label: 'Severity',  get: (l) => l.severity },
                { label: 'Timestamp', get: (l) => l.timestamp },
                { label: 'Resolved',  get: (l) => l.resolved ? 'Yes' : 'No' },
              ],
              'examshield-proctor-logs.csv'
            )}
            disabled={filteredLogs.length === 0}
          >
            ⬇ Export CSV ({filteredLogs.length})
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Events</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{summary.total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Severity</p>
          <p className="text-3xl font-bold text-danger mt-2">{summary.high}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Medium Severity</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{summary.medium}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unresolved</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{summary.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student, roll no, or event type..."
          className="flex-1 min-w-[260px] px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
        />
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="All">All Exams</option>
          {exams.map((ex) => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="All">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="rounded border-slate-300 text-primary focus:ring-primary/20"
          />
          Show resolved
        </label>
        <span className="text-sm text-slate-500 ml-auto">
          {filteredLogs.length} of {logs.length} events
        </span>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {filteredLogs.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-400">
            No events match your filters.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const s = SEVERITY_STYLES[log.severity];
              return (
                <li
                  key={log.id}
                  className={`px-6 py-4 flex items-start gap-4 hover:bg-slate-50/60 transition ${log.resolved ? 'opacity-60' : ''}`}
                >
                  <div className="relative pt-1.5">
                    <span className={`block w-3 h-3 rounded-full ${s.dot}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg">{EVENT_ICONS[log.type] || '⚠️'}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${s.badge}`}>
                        {log.type}
                      </span>
                      {log.resolved && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{log.student}</span>
                      <span className="text-slate-400 font-mono ml-2">{log.rollNo}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      {log.exam}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{formatTime(log.timestamp)}</p>
                  </div>

                  <button
                    onClick={() => toggleResolved(log.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition whitespace-nowrap ${
                      log.resolved
                        ? 'text-slate-600 border border-slate-200 hover:bg-slate-50'
                        : 'text-primary border border-blue-100 hover:bg-blue-50'
                    }`}
                  >
                    {log.resolved ? 'Reopen' : 'Mark Resolved'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProctorLogs;
