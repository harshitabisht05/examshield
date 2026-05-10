import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/StudentDashboard';

// ADD THIS LINE RIGHT HERE:
import ExamList from './pages/student/ExamList'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        
        {/* And ensure this route is using that imported name correctly */}
        <Route path="/student/exams" element={<ExamList />} />
      </Routes>
    </Router>
  );
}

export default App;