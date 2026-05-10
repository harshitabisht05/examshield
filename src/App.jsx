import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/StudentDashboard';
import ExamList from './pages/student/ExamList';
import ExamInterface from './pages/student/ExamInterface';
import Results from './pages/student/Results';
import Profile from './pages/student/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageExams from './pages/admin/ManageExams';
import ManageStudents from './pages/admin/ManageStudents';
import AdminResults from './pages/admin/AdminResults';
import ProctorLogs from './pages/admin/ProctorLogs';
import AdminSettings from './pages/admin/AdminSettings';

import ProtectedRoute from './components/ProtectedRoute';

const Student = ({ children }) => <ProtectedRoute role="student">{children}</ProtectedRoute>;
const Admin = ({ children }) => <ProtectedRoute role="admin">{children}</ProtectedRoute>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<Student><StudentDashboard /></Student>} />
        <Route path="/student/exams" element={<Student><ExamList /></Student>} />
        <Route path="/student/results" element={<Student><Results /></Student>} />
        <Route path="/student/profile" element={<Student><Profile /></Student>} />

        {/* Exam interface (full-screen, no sidebar) */}
        <Route path="/exam/:id" element={<Student><ExamInterface /></Student>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<Admin><AdminDashboard /></Admin>} />
        <Route path="/admin/exams" element={<Admin><ManageExams /></Admin>} />
        <Route path="/admin/students" element={<Admin><ManageStudents /></Admin>} />
        <Route path="/admin/results" element={<Admin><AdminResults /></Admin>} />
        <Route path="/admin/logs" element={<Admin><ProctorLogs /></Admin>} />
        <Route path="/admin/settings" element={<Admin><AdminSettings /></Admin>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
