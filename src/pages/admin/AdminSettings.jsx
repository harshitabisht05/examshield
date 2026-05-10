import React, { useState, useRef } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/common/Button';

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
      checked ? 'bg-primary' : 'bg-slate-300'
    }`}
    aria-pressed={checked}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const SettingRow = ({ title, description, children }) => (
  <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
    <div className="min-w-0">
      <p className="font-medium text-slate-900">{title}</p>
      {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const Section = ({ title, description, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
    <div className="px-6 py-5 border-b border-slate-100">
      <h3 className="font-bold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
    <div className="px-6">{children}</div>
  </div>
);

const TABS = [
  { id: 'general',    label: 'General' },
  { id: 'proctoring', label: 'Proctoring' },
  { id: 'security',   label: 'Security' },
  { id: 'integrations', label: 'Integrations' },
];

const DEFAULTS = {
  general: {
    orgName: 'University of Examples',
    contactEmail: 'admin@university.edu',
    timezone: 'Asia/Kolkata',
    academicYear: '2025-2026',
  },
  proctoring: {
    faceDetection: true,
    multipleFaceAlert: true,
    audioMonitoring: false,
    tabSwitchLimit: 2,
    copyPasteDetection: true,
    autoSubmitOnViolations: false,
  },
  security: {
    require2FA: true,
    sessionTimeoutMin: 30,
    passwordPolicy: 'strong',
    ipWhitelisting: false,
  },
  integrations: {
    slackWebhook: '',
    emailAlerts: true,
    googleSSO: false,
  },
};

const AdminSettings = () => {
  const [tab, setTab] = useState('general');

  const [general, setGeneral] = useState(DEFAULTS.general);
  const [proctoring, setProctoring] = useState(DEFAULTS.proctoring);
  const [security, setSecurity] = useState(DEFAULTS.security);
  const [integrations, setIntegrations] = useState(DEFAULTS.integrations);

  const lastSaved = useRef({
    general: { ...DEFAULTS.general },
    proctoring: { ...DEFAULTS.proctoring },
    security: { ...DEFAULTS.security },
    integrations: { ...DEFAULTS.integrations },
  });

  const [saved, setSaved] = useState(false);
  const [discarded, setDiscarded] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    lastSaved.current = {
      general: { ...general },
      proctoring: { ...proctoring },
      security: { ...security },
      integrations: { ...integrations },
    };
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleDiscard = () => {
    setGeneral({ ...lastSaved.current.general });
    setProctoring({ ...lastSaved.current.proctoring });
    setSecurity({ ...lastSaved.current.security });
    setIntegrations({ ...lastSaved.current.integrations });
    setDiscarded(true);
    setTimeout(() => setDiscarded(false), 1800);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Configure organization, proctoring, and security preferences.</p>
        </div>
        {saved && (
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-100">
            ✓ Settings saved
          </span>
        )}
        {discarded && (
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
            ↶ Changes discarded
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1 mb-6 inline-flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {tab === 'general' && (
          <Section title="Organization" description="Public information shown to students.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={general.orgName}
                  onChange={(e) => setGeneral({ ...general, orgName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={general.contactEmail}
                  onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                <select
                  value={general.timezone}
                  onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={general.academicYear}
                  onChange={(e) => setGeneral({ ...general, academicYear: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </Section>
        )}

        {tab === 'proctoring' && (
          <Section title="AI Proctoring" description="Configure how violations are detected and handled.">
            <SettingRow
              title="Face Detection"
              description="Require the candidate's face to be visible during the exam."
            >
              <Toggle
                checked={proctoring.faceDetection}
                onChange={(v) => setProctoring({ ...proctoring, faceDetection: v })}
              />
            </SettingRow>
            <SettingRow
              title="Multiple Face Alert"
              description="Flag the session if more than one person is detected."
            >
              <Toggle
                checked={proctoring.multipleFaceAlert}
                onChange={(v) => setProctoring({ ...proctoring, multipleFaceAlert: v })}
              />
            </SettingRow>
            <SettingRow
              title="Audio Monitoring"
              description="Listen for background voices and unusual ambient sound."
            >
              <Toggle
                checked={proctoring.audioMonitoring}
                onChange={(v) => setProctoring({ ...proctoring, audioMonitoring: v })}
              />
            </SettingRow>
            <SettingRow
              title="Copy/Paste Detection"
              description="Detect clipboard usage during the exam window."
            >
              <Toggle
                checked={proctoring.copyPasteDetection}
                onChange={(v) => setProctoring({ ...proctoring, copyPasteDetection: v })}
              />
            </SettingRow>
            <SettingRow
              title="Tab Switch Limit"
              description="Maximum tab switches before the candidate is auto-flagged."
            >
              <input
                type="number"
                min="0"
                value={proctoring.tabSwitchLimit}
                onChange={(e) => setProctoring({ ...proctoring, tabSwitchLimit: Number(e.target.value) })}
                className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-right"
              />
            </SettingRow>
            <SettingRow
              title="Auto-Submit on Violations"
              description="Automatically submit the exam after the violation threshold is hit."
            >
              <Toggle
                checked={proctoring.autoSubmitOnViolations}
                onChange={(v) => setProctoring({ ...proctoring, autoSubmitOnViolations: v })}
              />
            </SettingRow>
          </Section>
        )}

        {tab === 'security' && (
          <Section title="Security & Access" description="Authentication and session controls.">
            <SettingRow
              title="Require 2FA for Admins"
              description="Admins must verify a second factor on every login."
            >
              <Toggle
                checked={security.require2FA}
                onChange={(v) => setSecurity({ ...security, require2FA: v })}
              />
            </SettingRow>
            <SettingRow
              title="Session Timeout"
              description="Inactive admin sessions are signed out after this many minutes."
            >
              <input
                type="number"
                min="5"
                value={security.sessionTimeoutMin}
                onChange={(e) => setSecurity({ ...security, sessionTimeoutMin: Number(e.target.value) })}
                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-right"
              />
            </SettingRow>
            <SettingRow
              title="Password Policy"
              description="Strength requirements for new passwords."
            >
              <select
                value={security.passwordPolicy}
                onChange={(e) => setSecurity({ ...security, passwordPolicy: e.target.value })}
                className="px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              >
                <option value="basic">Basic (8+ chars)</option>
                <option value="strong">Strong (12+, mixed case, symbol)</option>
                <option value="paranoid">Paranoid (16+, rotated 90d)</option>
              </select>
            </SettingRow>
            <SettingRow
              title="IP Whitelisting"
              description="Restrict admin login to approved IP ranges."
            >
              <Toggle
                checked={security.ipWhitelisting}
                onChange={(v) => setSecurity({ ...security, ipWhitelisting: v })}
              />
            </SettingRow>
          </Section>
        )}

        {tab === 'integrations' && (
          <Section title="Integrations" description="Connect ExamShield to your existing tools.">
            <SettingRow
              title="Email Alerts"
              description="Send proctor alerts and exam summaries by email."
            >
              <Toggle
                checked={integrations.emailAlerts}
                onChange={(v) => setIntegrations({ ...integrations, emailAlerts: v })}
              />
            </SettingRow>
            <SettingRow
              title="Google SSO"
              description="Allow students to sign in with their university Google account."
            >
              <Toggle
                checked={integrations.googleSSO}
                onChange={(v) => setIntegrations({ ...integrations, googleSSO: v })}
              />
            </SettingRow>
            <div className="py-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Slack Webhook URL</label>
              <input
                type="url"
                value={integrations.slackWebhook}
                onChange={(e) => setIntegrations({ ...integrations, slackWebhook: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://hooks.slack.com/services/..."
              />
              <p className="text-xs text-slate-500 mt-1">Post high-severity proctor alerts to a Slack channel.</p>
            </div>
          </Section>
        )}

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={handleDiscard}>Discard</Button>
          <Button variant="primary" type="submit">Save Changes</Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;
