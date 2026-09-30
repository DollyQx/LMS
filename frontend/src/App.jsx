import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

// Example Pages (To be created)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import Quiz from './pages/Quiz';
import Certificate from './pages/Certificate';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Authenticated Application Logic */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course/:id" element={<CoursePlayer />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/certificate/:id" element={<Certificate />} />
          </Route>
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
