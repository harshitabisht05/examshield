import React, { useState, useMemo, useRef } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';
import { parseCsv } from '../../lib/download';

const STATUS_STYLES = {
  Active:    'bg-green-100 text-green-700',
  Suspended: 'bg-red-50 text-danger',
  Pending:   'bg-amber-50 text-amber-700',
};

const initialStudents = [
  { id: 1, name: 'Sneha Singh',  email: 'sneha.singh@university.edu',  rollNo: 'CS21B001', batch: '2025', examsTaken: 4, status: 'Active' },
  { id: 2, name: 'Rahul Mehta',  email: 'rahul.mehta@university.edu',  rollNo: 'CS21B014', batch: '2025', examsTaken: 3, status: 'Active' },
  { id: 3, name: 'Priya Singh',  email: 'priya.singh@university.edu',  rollNo: 'CS22B007', batch: '2026', examsTaken: 2, status: 'Active' },
  { id: 4, name: 'Ankit Sharma', email: 'ankit.sharma@university.edu', rollNo: 'CS22B019', batch: '2026', examsTaken: 1, status: 'Suspended' },
  { id: 5, name: 'Sneha Kapoor', email: 'sneha.kapoor@university.edu', rollNo: 'CS23B003', batch: '2027', examsTaken: 0, status: 'Pending' },
];

const emptyForm = { name: '', email: '', rollNo: '', batch: '2026', status: 'Active' };

const initials = (name) =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

const ManageStudents = () => {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const csvInputRef = useRef(null);
  const [importToast, setImportToast] = useState(null);

  const batches = useMemo(
    () => Array.from(new Set(students.map((s) => s.batch))).sort(),
    [students]
  );

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesBatch  = batchFilter  === 'All' || s.batch  === batchFilter;
      return matchesSearch && matchesStatus && matchesBatch;
    });
  }, [students, search, statusFilter, batchFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      batch: student.batch,
      status: student.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.rollNo) return;

    if (editingId) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s))
      );
    } else {
      const nextId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
      setStudents((prev) => [...prev, { id: nextId, examsTaken: 0, ...form }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
  };

  const handleCsvImport = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const { rows } = parseCsv(String(ev.target.result || ''));
        if (rows.length === 0) {
          setImportToast({ kind: 'error', text: 'CSV is empty or missing headers.' });
          return;
        }
        const existingEmails = new Set(students.map((s) => s.email.toLowerCase()));
        let nextId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
        const added = [];
        const skipped = [];
        for (const r of rows) {
          const name   = r.name   || r.Name   || '';
          const email  = r.email  || r.Email  || '';
          const rollNo = r.rollNo || r.RollNo || r['Roll No'] || '';
          const batch  = r.batch  || r.Batch  || '2026';
          const status = r.status || r.Status || 'Active';
          if (!name || !email || !rollNo) {
            skipped.push(email || '(unnamed)');
            continue;
          }
          if (existingEmails.has(email.toLowerCase())) {
            skipped.push(email);
            continue;
          }
          existingEmails.add(email.toLowerCase());
          added.push({ id: nextId++, name, email, rollNo, batch, examsTaken: 0, status });
        }
        if (added.length) setStudents((prev) => [...prev, ...added]);
        const parts = [`${added.length} added`];
        if (skipped.length) parts.push(`${skipped.length} skipped`);
        setImportToast({
          kind: added.length ? 'success' : 'error',
          text: `Bulk import: ${parts.join(', ')}.`,
        });
      } catch {
        setImportToast({ kind: 'error', text: 'Could not parse CSV. Expected headers: name,email,rollNo,batch,status' });
      } finally {
        setTimeout(() => setImportToast(null), 3500);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Students</h1>
          <p className="text-slate-500 mt-1">View, onboard, and manage student accounts.</p>
        </div>
        <div className="flex gap-3">
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleCsvImport}
          />
          <Button variant="outline" onClick={() => csvInputRef.current?.click()}>
            Bulk Import (CSV)
          </Button>
          <Button variant="primary" onClick={openCreate}>+ Add Student</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or roll no..."
          className="flex-1 min-w-[260px] px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
        />
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="All">All Batches</option>
          {batches.map((b) => (
            <option key={b} value={b}>Batch {b}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Pending">Pending</option>
        </select>
        <span className="text-sm text-slate-500 ml-auto">
          {filteredStudents.length} of {students.length} students
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Student</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Roll No</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Batch</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Exams Taken</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No students match your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          {initials(student.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{student.name}</p>
                          <p className="text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{student.rollNo}</td>
                    <td className="px-6 py-4 text-slate-600">{student.batch}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{student.examsTaken}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[student.status]}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(student)}
                          className="px-3 py-1.5 text-sm font-medium text-primary border border-blue-100 rounded-lg hover:bg-blue-50 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(student.id)}
                          className="px-3 py-1.5 text-sm font-medium text-danger border border-red-100 rounded-lg hover:bg-red-50 transition"
                        >
                          Delete
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Aisha Khan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="student@university.edu"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={form.rollNo}
                    onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="CS23B042"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    required
                    value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingId ? 'Save Changes' : 'Add Student'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import toast */}
      {importToast && (
        <div className={`fixed bottom-6 right-6 z-50 max-w-md px-4 py-3 rounded-lg shadow-lg border animate-slide-up ${
          importToast.kind === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-danger'
        }`}>
          {importToast.text}
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-900">Remove this student?</h3>
            <p className="text-sm text-slate-500 mt-2">
              The account will lose access immediately. Historical exam results will be retained.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(confirmDeleteId)}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageStudents;
