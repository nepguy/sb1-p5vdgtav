import React, { useState } from 'react';
import { Lock, User, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const SignInPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  
  // Track field-specific validation errors
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user types
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateFields = (): boolean => {
    let isValid = true;
    const newFieldErrors = { email: '', password: '' };
    
    // Email validation
    if (!formData.email.trim()) {
      newFieldErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newFieldErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newFieldErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newFieldErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate fields before submitting
    if (!validateFields()) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (isSignIn) {
        // Attempt to sign in
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          console.log('Sign in error:', error.message);
          
          if (error.message.includes('Invalid login credentials')) {
            // More user-friendly message for credential errors
            setFieldErrors({
              email: 'Email or password is incorrect',
              password: 'Email or password is incorrect'
            });
            throw new Error('The email or password you entered is incorrect. Please check your credentials and try again.');
          } else if (error.message.includes('too many requests')) {
            throw new Error('Too many login attempts. Please try again later.');
          } else {
            throw error;
          }
        }
        // Successfully signed in, redirection handled by AuthContext
      } else {
        if (!formData.name.trim()) {
          throw new Error('Please enter your name');
        }
        
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          if (error.message.includes('User already registered')) {
            setFieldErrors({
              email: 'Email already in use',
              password: ''
            });
            throw new Error('An account with this email already exists. Please sign in instead.');
          } else {
            throw error;
          }
        } else {
          // Show success message for sign up
          setError("Account created successfully! You can now sign in with your credentials.");
          setIsSignIn(true); // Switch to sign in form
          setFormData(prev => ({
            ...prev,
            password: ''
          }));
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setIsSignIn(!isSignIn);
    setError(null);
    setFieldErrors({ email: '', password: '' });
    setFormData({
      ...formData,
      name: '',
      password: ''
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-16 min-h-screen flex items-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isSignIn ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {isSignIn 
                  ? 'Welcome back to TravelSafe' 
                  : 'Join TravelSafe and stay safe during your travels'}
              </p>
            </div>

            {error && (
              <div className={`mb-6 p-4 rounded-lg flex items-start ${
                error.includes("created") || error.includes("success")
                  ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-100" 
                  : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-100"
              }`}>
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isSignIn && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isSignIn}
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 dark:bg-gray-700 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 block w-full border ${
                      fieldErrors.email 
                        ? "border-red-500 dark:border-red-400" 
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 dark:bg-gray-700 dark:text-white`}
                    placeholder="your@email.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 block w-full border ${
                      fieldErrors.password 
                        ? "border-red-500 dark:border-red-400" 
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 dark:bg-gray-700 dark:text-white`}
                    placeholder={isSignIn ? '••••••••' : 'Create a password'}
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                )}
                {!isSignIn && !fieldErrors.password && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              {isSignIn && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  variant="signin"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (isSignIn ? 'Signing In...' : 'Creating Account...') 
                    : (isSignIn ? 'Sign In' : 'Create Account')}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleView}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {isSignIn ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>Or continue with</p>
                <div className="mt-4 flex justify-center space-x-4">
                  {['Google', 'Facebook', 'Apple'].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By continuing, you agree to TravelSafe's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;