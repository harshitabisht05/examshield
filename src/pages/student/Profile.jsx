import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

const INITIAL_CHECKS = [
  { label: 'Camera Access',     status: 'ok',    detail: 'HD Webcam (Built-in)' },
  { label: 'Microphone Access', status: 'ok',    detail: 'Default Audio Input' },
  { label: 'Browser Version',   status: 'ok',    detail: 'Chrome 134 (Latest)' },
  { label: 'Internet Speed',    status: 'warn',  detail: '12 Mbps (recommended: 25 Mbps+)' },
  { label: 'Screen Resolution', status: 'ok',    detail: '1920 × 1080' },
];

const DEMO_PROFILE = {
  phone: '+91 98765 43210',
  rollNo: 'CS21B001',
  batch: '2025',
  program: 'B.Tech Computer Science',
  bio: 'Final-year CSE student passionate about distributed systems and machine learning.',
};

const buildProfile = (user) => ({
  name: user?.name || 'Sneha Singh',
  email: user?.email || 'sneha.singh@university.edu',
  ...DEMO_PROFILE,
});

const ACHIEVEMENTS = [
  { icon: '🏆', label: 'Top Performer',  description: 'Scored 95+ in 3 exams' },
  { icon: '⚡', label: 'Quick Finisher', description: 'Submitted in record time' },
  { icon: '🎯', label: 'Perfect Score',  description: '100% in Math 101' },
  { icon: '🛡️', label: 'Clean Record',   description: 'Zero proctor flags' },
];

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() => buildProfile(user));
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState(profile);

  const [photoUrl, setPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [checks, setChecks] = useState(INITIAL_CHECKS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfile((p) => ({ ...p, name: user.name, email: user.email }));
    setDraft((d) => ({ ...d, name: user.name, email: user.email }));
  }, [user]);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  const runCheck = () => {
    setRunning(true);
    setTimeout(() => {
      setChecks((prev) => prev.map((c) => ({ ...c, status: 'ok', detail: c.detail })));
      setRunning(false);
    }, 1100);
  };

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const initials = profile.name.split(' ').map((p) => p[0]).slice(0, 2).join('');

  return (
    <DashboardLayout role="student">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account information and exam preferences.</p>
        </div>
        {saved && (
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-100">
            ✓ Profile updated
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Avatar + achievements */}
        <div className="space-y-6">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-24 gradient-primary" />
            <div className="px-6 pb-6 -mt-12">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
                {photoUrl ? (
                  <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-4">{profile.name}</h2>
              <p className="text-sm text-slate-500">{profile.program}</p>
              <p className="text-xs text-slate-400 font-mono mt-1">{profile.rollNo}</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                📷 {photoUrl ? 'Change Photo' : 'Upload Photo'}
              </button>
              {photoUrl && (
                <button
                  onClick={() => { URL.revokeObjectURL(photoUrl); setPhotoUrl(null); }}
                  className="mt-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-danger transition"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Achievements</h3>
              <p className="text-xs text-slate-500">{ACHIEVEMENTS.length} badges earned</p>
            </div>
            <ul className="px-6 py-3 divide-y divide-slate-50">
              {ACHIEVEMENTS.map((a) => (
                <li key={a.label} className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl">
                    {a.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{a.label}</p>
                    <p className="text-xs text-slate-500">{a.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Form + System check */}
        <div className="xl:col-span-2 space-y-6">
          {/* Personal info form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Update your contact and program details.</p>
              </div>
              {!editing ? (
                <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              )}
            </div>
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'name',    label: 'Full Name', type: 'text' },
                { key: 'email',   label: 'Email',     type: 'email' },
                { key: 'phone',   label: 'Phone',     type: 'tel' },
                { key: 'rollNo',  label: 'Roll No',   type: 'text', readOnly: true },
                { key: 'batch',   label: 'Batch',     type: 'text', readOnly: true },
                { key: 'program', label: 'Program',   type: 'text' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={editing ? draft[f.key] : profile[f.key]}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    readOnly={!editing || f.readOnly}
                    className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none transition ${
                      editing && !f.readOnly
                        ? 'focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white'
                        : 'bg-slate-50 text-slate-700 cursor-not-allowed'
                    }`}
                  />
                  {f.readOnly && (
                    <p className="text-xs text-slate-400 mt-1">Read-only — contact admin to change</p>
                  )}
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                <textarea
                  rows="3"
                  value={editing ? draft.bio : profile.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  readOnly={!editing}
                  className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none transition resize-none ${
                    editing
                      ? 'focus:ring-2 focus:ring-primary/20 focus:border-primary'
                      : 'bg-slate-50 text-slate-700 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* System check */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">System Check</h3>
              <p className="text-xs text-slate-500">Verify your device is ready for proctored exams.</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              {checks.map((c) => (
                <div key={c.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      c.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {c.status === 'ok' ? '✓' : '!'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.label}</p>
                      <p className="text-xs text-slate-500">{c.detail}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold uppercase ${
                    c.status === 'ok' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {c.status === 'ok' ? 'Ready' : 'Check'}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <p className="text-sm text-slate-600">
                {running ? 'Running checks…' : checks.every((c) => c.status === 'ok') ? 'All set — you\'re ready to take exams.' : 'Some checks need your attention.'}
              </p>
              <Button onClick={runCheck} disabled={running}>
                {running ? 'Running…' : 'Run Check Again'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
