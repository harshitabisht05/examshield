import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';

const STATUS_STYLES = {
  Draft:     'bg-slate-100 text-slate-600',
  Scheduled: 'bg-blue-50 text-primary',
  Live:      'bg-green-100 text-green-700',
  Completed: 'bg-slate-200 text-slate-700',
};

const initialExams = [
  { id: 1, title: 'Data Structures & Algorithms', date: '2026-05-20', totalMarks: 100, status: 'Scheduled' },
  { id: 2, title: 'Database Management Systems',  date: '2026-05-22', totalMarks: 80,  status: 'Draft' },
  { id: 3, title: 'Modern Web Frameworks',        date: '2026-05-12', totalMarks: 60,  status: 'Live' },
  { id: 4, title: 'Operating Systems',            date: '2026-04-28', totalMarks: 100, status: 'Completed' },
];

const emptyForm = { title: '', date: '', totalMarks: '', status: 'Draft' };

const ManageExams = () => {
  const [exams, setExams] = useState(initialExams);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [exams, search, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (exam) => {
    setEditingId(exam.id);
    setForm({
      title: exam.title,
      date: exam.date,
      totalMarks: exam.totalMarks,
      status: exam.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const marks = Number(form.totalMarks);
    if (!form.title || !form.date || !marks) return;

    if (editingId) {
      setExams((prev) =>
        prev.map((ex) =>
          ex.id === editingId ? { ...ex, ...form, totalMarks: marks } : ex
        )
      );
    } else {
      const nextId = exams.length ? Math.max(...exams.map((e) => e.id)) + 1 : 1;
      setExams((prev) => [...prev, { id: nextId, ...form, totalMarks: marks }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Exams</h1>
          <p className="text-slate-500 mt-1">Create, schedule, and monitor examinations.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          + Create New Exam
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by exam title..."
          className="flex-1 min-w-[240px] px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Live">Live</option>
          <option value="Completed">Completed</option>
        </select>
        <span className="text-sm text-slate-500 ml-auto">
          {filteredExams.length} of {exams.length} exams
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Title</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Date</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Total Marks</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    No exams match your filters.
                  </td>
                </tr>
              ) : (
                filteredExams.map((exam) => (
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
                    <td className="px-6 py-4 text-slate-600 font-medium">{exam.totalMarks}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[exam.status]}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(exam)}
                          className="px-3 py-1.5 text-sm font-medium text-primary border border-blue-100 rounded-lg hover:bg-blue-50 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(exam.id)}
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
                {editingId ? 'Edit Exam' : 'Create New Exam'}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Computer Networks"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.totalMarks}
                    onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="100"
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
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Live">Live</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingId ? 'Save Changes' : 'Create Exam'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-900">Delete this exam?</h3>
            <p className="text-sm text-slate-500 mt-2">
              This action cannot be undone. All associated questions and results will be removed.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(confirmDeleteId)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageExams;
