import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const QUESTIONS = [
  {
    id: 1,
    text: 'Which data structure uses LIFO (Last-In-First-Out) ordering?',
    options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
    correct: 1,
  },
  {
    id: 2,
    text: 'What is the time complexity of binary search on a sorted array of n elements?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correct: 2,
  },
  {
    id: 3,
    text: 'In a min-heap, where is the smallest element always located?',
    options: ['Leftmost leaf', 'Rightmost leaf', 'Root node', 'Any internal node'],
    correct: 2,
  },
  {
    id: 4,
    text: 'Which traversal of a binary search tree yields elements in sorted order?',
    options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
    correct: 1,
  },
  {
    id: 5,
    text: 'A hash table with chaining handles collisions by:',
    options: [
      'Probing the next empty slot',
      'Doubling the table size',
      'Storing colliding entries in a linked list',
      'Discarding the new entry',
    ],
    correct: 2,
  },
  {
    id: 6,
    text: 'What is the average-case time complexity of quicksort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correct: 1,
  },
  {
    id: 7,
    text: 'Which graph algorithm finds the shortest path from a single source to all vertices in a weighted graph with non-negative edges?',
    options: ['Bellman-Ford', "Dijkstra's", 'Kruskal\'s', 'DFS'],
    correct: 1,
  },
  {
    id: 8,
    text: 'A doubly linked list, compared to a singly linked list, primarily offers:',
    options: [
      'Lower memory usage',
      'Bidirectional traversal',
      'Constant-time random access',
      'Automatic sorting',
    ],
    correct: 1,
  },
  {
    id: 9,
    text: 'The recurrence T(n) = 2T(n/2) + O(n) solves to:',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
    correct: 2,
  },
  {
    id: 10,
    text: 'Which of the following is NOT a stable sorting algorithm?',
    options: ['Merge sort', 'Insertion sort', 'Quicksort', 'Bubble sort'],
    correct: 2,
  },
];

const TOTAL_TIME = 30 * 60; // 30 minutes

const formatTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const ExamInterface = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});      // { qid: optionIdx }
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [faceDetected, setFaceDetected] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showWarning, setShowWarning] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Webcam
  useEffect(() => {
    let cancelled = false;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        // camera denied or unavailable — placeholder will show
      }
    };
    startCamera();
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Countdown
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  // Tab switch detection
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && !submitted) {
        setTabSwitches((n) => n + 1);
        setShowWarning('Tab switch detected — please stay on the exam window.');
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [submitted]);

  // Simulated face detection oscillation (every 18s briefly drops)
  useEffect(() => {
    const t = setInterval(() => {
      setFaceDetected((prev) => {
        const next = Math.random() > 0.08;
        if (!next && prev) {
          setShowWarning('Face not detected — please face the camera.');
        }
        return next;
      });
    }, 6000);
    return () => clearInterval(t);
  }, []);

  // Auto-dismiss warning
  useEffect(() => {
    if (!showWarning) return;
    const t = setTimeout(() => setShowWarning(null), 3500);
    return () => clearTimeout(t);
  }, [showWarning]);

  const current = QUESTIONS[currentIdx];

  const stats = useMemo(() => {
    const answered = Object.keys(answers).length;
    return {
      answered,
      unanswered: QUESTIONS.length - answered,
      flagged: flagged.size,
    };
  }, [answers, flagged]);

  const selectOption = (idx) => {
    setAnswers((prev) => ({ ...prev, [current.id]: idx }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(current.id)) next.delete(current.id);
      else next.add(current.id);
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    const correctCount = QUESTIONS.reduce(
      (acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0),
      0
    );
    const pct = Math.round((correctCount / QUESTIONS.length) * 100);
    setTimeout(() => {
      navigate('/student/results', { state: { lastScore: { correct: correctCount, total: QUESTIONS.length, pct } } });
    }, 2200);
  };

  const timerWarning = timeLeft < 300; // last 5 min

  // Submission overlay
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center animate-slide-up">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center text-4xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Exam Submitted!</h2>
          <p className="text-slate-500 mb-6">
            Your responses have been recorded. Calculating your score...
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.15s' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white text-lg">
            🛡️
          </div>
          <div>
            <h1 className="font-bold text-slate-900">Data Structures Midterm</h1>
            <p className="text-xs text-slate-500">Exam ID: EX-{String(id || 1).padStart(4, '0')} • Live Proctoring Active</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab switches */}
          <div className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
            tabSwitches > 0 ? 'bg-red-50 border border-red-100' : 'bg-slate-50 border border-slate-200'
          }`}>
            <span className="text-sm">🪟</span>
            <span className={`text-xs font-semibold ${tabSwitches > 0 ? 'text-danger' : 'text-slate-600'}`}>
              Tab Switches: {tabSwitches}
            </span>
          </div>

          {/* Face detection */}
          <div className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
            faceDetected ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'
          }`}>
            <span className={`w-2 h-2 rounded-full ${faceDetected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className={`text-xs font-semibold ${faceDetected ? 'text-green-700' : 'text-amber-700'}`}>
              {faceDetected ? 'Face Detected' : 'Face Lost'}
            </span>
          </div>

          {/* Timer */}
          <div className={`px-4 py-2 rounded-lg font-mono font-bold text-lg ${
            timerWarning
              ? 'bg-red-50 text-danger border border-red-200 animate-pulse-slow'
              : 'bg-slate-900 text-white'
          }`}>
            ⏱ {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => setShowSubmit(true)}
            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-blue-800 transition"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main: question */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          <div className="max-w-3xl mx-auto">
            {/* Question header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Question {currentIdx + 1} of {QUESTIONS.length}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">1 mark • Multiple choice</p>
              </div>
              <button
                onClick={toggleFlag}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                  flagged.has(current.id)
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {flagged.has(current.id) ? '🚩 Flagged' : '🏳️ Flag for Review'}
              </button>
            </div>

            {/* Question text */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 mb-5">
              <h2 className="text-xl font-semibold text-slate-900 leading-relaxed">
                {current.text}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {current.options.map((opt, i) => {
                const selected = answers[current.id] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-4 ${
                      selected
                        ? 'border-primary bg-blue-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      selected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className={`flex-1 ${selected ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                      {opt}
                    </span>
                    {selected && <span className="text-primary">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Nav buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              {currentIdx < QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((i) => Math.min(QUESTIONS.length - 1, i + 1))}
                  className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-blue-800 transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmit(true)}
                  className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                >
                  Review & Submit
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right rail */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
          {/* Webcam preview */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proctor View</p>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                REC
              </span>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Overlay corners */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-green-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-green-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-green-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-green-400" />
              {/* Status */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-green-400">
                AI MONITORING
              </div>
            </div>
          </div>

          {/* Question palette */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Question Palette</p>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {QUESTIONS.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged.has(q.id);
                const isCurrent = i === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(i)}
                    className={`relative aspect-square rounded-lg font-bold text-sm transition ${
                      isCurrent
                        ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary" />
                <span className="text-slate-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                <span className="text-slate-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300" />
                <span className="text-slate-600">Not visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300 relative">
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                </div>
                <span className="text-slate-600">Flagged</span>
              </div>
            </div>
          </div>

          {/* Summary footer */}
          <div className="border-t border-slate-100 p-4 bg-slate-50">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-slate-500">Answered</p>
                <p className="text-lg font-bold text-green-700">{stats.answered}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Skipped</p>
                <p className="text-lg font-bold text-slate-700">{stats.unanswered}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Flagged</p>
                <p className="text-lg font-bold text-amber-600">{stats.flagged}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Warning toast */}
      {showWarning && (
        <div className="fixed top-20 right-6 z-40 bg-red-50 border-2 border-red-200 rounded-xl shadow-lg px-5 py-3 flex items-center gap-3 animate-slide-up max-w-md">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-danger text-sm">Violation Detected</p>
            <p className="text-xs text-slate-600">{showWarning}</p>
          </div>
        </div>
      )}

      {/* Submit confirmation */}
      {showSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7 animate-slide-up">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center">Submit your exam?</h3>
            <p className="text-sm text-slate-500 text-center mt-2">
              You won't be able to make changes after submission.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Answered</p>
                <p className="text-2xl font-bold text-green-700">{stats.answered}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Skipped</p>
                <p className="text-2xl font-bold text-slate-700">{stats.unanswered}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Flagged</p>
                <p className="text-2xl font-bold text-amber-600">{stats.flagged}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSubmit(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Keep Reviewing
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-800 transition"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;
