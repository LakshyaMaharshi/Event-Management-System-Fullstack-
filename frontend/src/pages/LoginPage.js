import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      // Navigation will be handled by the ProtectedRoute logic in App.js
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 py-8">
      <div className="container-custom">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-10 shadow-hard w-full max-w-lg mx-auto">
          <h2 className="text-neutral-100 mb-2 text-center text-3xl font-semibold">
            Login to Your Account
          </h2>
          <p className="text-neutral-300 text-center mb-6 leading-relaxed">
            Welcome back! Please enter your credentials to access your dashboard.
          </p>

          {error && (
            <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-center border border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div></div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-emerald-400 hover:text-emerald-300 no-underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-neutral-800">
            <p className="text-neutral-300 m-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-400 no-underline font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-neutral-800/50 rounded-md border-l-4 border-emerald-500">
            <h4 className="mt-0 mb-2 text-neutral-100 text-sm font-semibold">Demo Credentials:</h4>
            <p className="my-1 text-neutral-300 text-xs"><strong>Admin:</strong> admin@eventmanagement.com / admin123</p>
            <p className="my-1 text-neutral-300 text-xs"><strong>User:</strong> Create a new account or use existing credentials</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
