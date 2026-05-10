import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow pt-24">
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Conduct Exams <span className="text-primary">Securely</span> Anywhere.
          </h1>
          <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">
            ExamShield provides AI-powered proctoring, real-time monitoring, and 
            comprehensive analytics for educational institutions.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="px-8 py-4 text-lg">Create an Exam</Button>
            <Button variant="outline" className="px-8 py-4 text-lg">Join as Student</Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="text-primary text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Anti-Cheat Engine</h3>
              <p className="text-secondary">Browser lockdown and AI behavior detection to ensure integrity.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="text-primary text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Instant Analytics</h3>
              <p className="text-secondary">Detailed result breakdown and performance tracking for admins.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="text-primary text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Live Monitoring</h3>
              <p className="text-secondary">Real-time proctoring dashboard for high-stakes examinations.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;