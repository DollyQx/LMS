import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { BookOpen, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLocal, setErrorLocal] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorLocal('');

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setErrorLocal('Invalid Credentials. Please check your email and password.');
      setIsSubmitting(false);
    }
  };

  if (isLoading && !isSubmitting) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-darkLayer shadow-xl border border-gray-100 dark:border-gray-800">
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-brand/10 dark:bg-brand/20 rounded-full flex items-center justify-center border border-brand/20">
            <BookOpen className="w-8 h-8 text-brand" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Sign in to resume learning</p>

        {errorLocal && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorLocal}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-darker border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
              placeholder="you@university.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-darker border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-brand hover:bg-brandHover text-white font-semibold rounded-lg transition-colors flex justify-center items-center"
          >
            {isSubmitting ? <Loader className="w-5 h-5 text-white" /> : 'Log In Securely'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? <span className="text-brand hover:underline cursor-pointer">Register here</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
