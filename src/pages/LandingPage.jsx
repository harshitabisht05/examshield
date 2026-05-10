import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';

const FEATURES = [
  {
    icon: '🛡️',
    title: 'AI Anti-Cheat Engine',
    description: 'Real-time face detection, gaze tracking, and tab-switch monitoring keep exams airtight.',
    color: 'bg-blue-50 text-primary',
  },
  {
    icon: '📊',
    title: 'Live Analytics',
    description: 'Instant grade distribution, performance trends, and per-question insight for educators.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: '🎥',
    title: 'Video Proctoring',
    description: 'Continuous webcam monitoring with automated flagging of suspicious behavior.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    description: 'Automated grading delivers scores and feedback the moment a student submits.',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    icon: '🔒',
    title: 'Bank-Grade Security',
    description: 'End-to-end encryption, 2FA for admins, and role-based access at every layer.',
    color: 'bg-green-50 text-green-700',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Responsive design runs smoothly on laptops, tablets, and modern mobile browsers.',
    color: 'bg-pink-50 text-pink-600',
  },
];

const STEPS = [
  { num: '01', title: 'Create the Exam', desc: 'Educators design the exam, set duration, marks, and proctoring rules.' },
  { num: '02', title: 'Students Join',   desc: 'Students log in, verify identity, and the AI proctor activates instantly.' },
  { num: '03', title: 'AI Monitors',     desc: 'Continuous analysis of camera, audio, and browser activity in real time.' },
  { num: '04', title: 'Auto-Grade',      desc: 'Scores, grade distribution, and integrity reports are generated automatically.' },
];

const STATS = [
  { value: '99.7%', label: 'Detection Accuracy' },
  { value: '10K+',  label: 'Exams Conducted' },
  { value: '<1s',   label: 'Anomaly Response' },
  { value: '24/7',  label: 'Live Monitoring' },
];

const TESTIMONIALS = [
  {
    quote: 'ExamShield reduced our manual proctoring effort by 80%. The AI flagging is remarkably accurate.',
    name: 'Dr. Priya Menon',
    role: 'Head of Examinations, NIT Calicut',
    initials: 'PM',
  },
  {
    quote: 'Our pass-rate analytics now drive curriculum decisions. The dashboards are exactly what we needed.',
    name: 'Prof. Arjun Iyer',
    role: 'Dean, BITS Pilani',
    initials: 'AI',
  },
  {
    quote: 'Students adopted it within a day. Clean UI, fast results, and the integrity reports speak for themselves.',
    name: 'Ms. Kavya Reddy',
    role: 'CSE Faculty, VIT Vellore',
    initials: 'KR',
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-br from-blue-100/40 via-indigo-100/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-semibold mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Trusted by 50+ Institutions Worldwide
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.05] tracking-tight animate-slide-up">
            Conduct Exams
            <br />
            <span className="gradient-text">Securely.</span>{' '}
            <span className="gradient-text">Intelligently.</span>{' '}
            <span className="gradient-text">Anywhere.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            ExamShield combines AI-powered proctoring, real-time monitoring, and instant analytics
            so educators can deliver high-stakes exams with complete confidence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12 animate-slide-up">
            <Link to="/register">
              <Button className="px-8 py-4 text-base w-full sm:w-auto">Get Started Free →</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-8 py-4 text-base w-full sm:w-auto">Try Live Demo →</Button>
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-100">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs md:text-sm text-slate-500 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview mockup */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-slate-900 p-3 shadow-2xl border border-slate-200">
            <div className="flex gap-1.5 px-3 py-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="rounded-xl bg-slate-50 overflow-hidden border border-slate-200">
              <div className="grid grid-cols-12 min-h-[360px]">
                <div className="col-span-3 bg-slate-900 p-4 text-white text-xs space-y-2">
                  <p className="font-bold text-sm italic mb-3">ExamShield</p>
                  {['Overview', 'Manage Exams', 'Students', 'Results', 'Proctor Logs'].map((l, i) => (
                    <div
                      key={l}
                      className={`px-3 py-2 rounded-lg ${i === 0 ? 'bg-primary text-white' : 'text-slate-300'}`}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <div className="col-span-9 p-6">
                  <p className="text-xs text-slate-500 mb-1">ADMIN DASHBOARD</p>
                  <p className="text-lg font-bold text-slate-900 mb-4">Welcome back, Admin</p>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Exams',    val: '24',  color: 'bg-blue-50' },
                      { label: 'Students', val: '1284', color: 'bg-indigo-50' },
                      { label: 'Live',     val: '6',   color: 'bg-green-50' },
                      { label: 'Avg',      val: '78%', color: 'bg-amber-50' },
                    ].map((c) => (
                      <div key={c.label} className={`${c.color} rounded-lg p-3 border border-white`}>
                        <p className="text-[10px] text-slate-500 uppercase">{c.label}</p>
                        <p className="text-xl font-bold text-slate-900">{c.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                    {[80, 65, 92, 47].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${w}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 w-8 text-right">{w}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything you need to run secure exams
            </h2>
            <p className="text-lg text-slate-600">
              Purpose-built for academic integrity. From identity verification to instant analytics —
              all in one intuitive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group p-7 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center text-3xl mb-5`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Up and running in four steps
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 h-full">
                  <div className="text-5xl font-extrabold gradient-text mb-3">{s.num}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-2xl text-slate-300">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Loved by faculty across India
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-7 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col"
              >
                <div className="text-primary text-4xl mb-3 leading-none">"</div>
                <p className="text-slate-700 leading-relaxed flex-1 italic">{t.quote}</p>
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                  <div className="w-11 h-11 rounded-full gradient-primary text-white flex items-center justify-center font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-16 text-center text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to modernize your exams?
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join hundreds of institutions delivering secure, scalable exams with ExamShield.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link to="/register">
                  <button className="px-8 py-4 rounded-lg bg-white text-primary font-bold hover:bg-blue-50 transition w-full sm:w-auto">
                    Create Free Account
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-8 py-4 rounded-lg border-2 border-white/40 text-white font-bold hover:bg-white/10 transition w-full sm:w-auto">
                    Sign In as Admin
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
