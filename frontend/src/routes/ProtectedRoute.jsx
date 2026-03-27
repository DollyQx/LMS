import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Loader from '../components/Loader';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Ping server gracefully silently attempting to pluck user contexts from HTTP-Only tokens globally 
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-dark text-black dark:text-white">
        <Loader />
      </div>
    );
  }

  // Gracefully bounce unauthenticated traffic back physically!
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
