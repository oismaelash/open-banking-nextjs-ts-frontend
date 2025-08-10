'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';

// Validation schemas
const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or CPF is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
  twoFactorCode: z.string().optional(),
});

const consentSchema = z.object({
  scopes: z.array(z.string()).min(1, 'At least one permission must be selected'),
  duration: z.string().min(1, 'Consent duration is required'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ConsentFormData = z.infer<typeof consentSchema>;

interface LoginFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

export function LoginForm({ currentStep, setCurrentStep }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Form hooks
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
      twoFactorCode: '',
    },
  });

  const consentForm = useForm<ConsentFormData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      scopes: [],
      duration: '30',
      acceptTerms: false,
    },
  });

  // Available scopes/permissions
  const availableScopes = [
    {
      id: 'accounts',
      title: 'Account Information',
      description: 'Access to view your account details and balances',
      icon: Shield,
    },
    {
      id: 'balances',
      title: 'Balance Inquiry',
      description: 'View current and available balances across all accounts',
      icon: Shield,
    },
    {
      id: 'transactions',
      title: 'Transaction History',
      description: 'Access to your transaction history and statements',
      icon: Shield,
    },
    {
      id: 'payments',
      title: 'Payment Initiation',
      description: 'Ability to initiate PIX payments and transfers',
      icon: Shield,
    },
  ];

  // Consent duration options
  const durationOptions = [
    { value: '1', label: '1 day' },
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
  ];

  // Handle login submission
  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful login
      if (data.identifier === 'demo@example.com' && data.password === 'password123') {
        // Store JWT token (in real app, this would come from API)
        localStorage.setItem('authToken', 'demo-jwt-token');
        setCurrentStep(2);
      } else {
        setLoginError('Invalid credentials. Please try again.');
      }
    } catch {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle consent submission
  const onConsentSubmit = async (data: ConsentFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store consent data
      localStorage.setItem('consentData', JSON.stringify(data));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Consent submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle scope toggle
  const toggleScope = (scopeId: string) => {
    const currentScopes = consentForm.getValues('scopes');
    const newScopes = currentScopes.includes(scopeId)
      ? currentScopes.filter(id => id !== scopeId)
      : [...currentScopes, scopeId];
    
    consentForm.setValue('scopes', newScopes);
  };

  if (currentStep === 1) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your Open Banking account
          </p>
        </div>

        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
          {/* Identifier Field */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
              Email or CPF
            </label>
            <input
              type="text"
              id="identifier"
              {...loginForm.register('identifier')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email or CPF"
            />
            {loginForm.formState.errors.identifier && (
              <p className="mt-1 text-sm text-red-600">
                {loginForm.formState.errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...loginForm.register('password')}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              {...loginForm.register('rememberMe')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Remember me for 30 days
            </label>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          {/* Demo Credentials Info */}
          <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Demo Credentials:</p>
              <p>Email: demo@example.com</p>
              <p>Password: password123</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Consent Management
          </h1>
          <p className="text-gray-600">
            Review and manage the permissions you&apos;re granting
          </p>
        </div>

        <form onSubmit={consentForm.handleSubmit(onConsentSubmit)} className="space-y-6">
          {/* Third-party App Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Requesting Application</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Open Banking Demo App</p>
                <p className="text-sm text-gray-600">Requesting access to your financial data</p>
              </div>
            </div>
          </div>

          {/* Scope Selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Permissions Requested</h3>
            <div className="space-y-3">
              {availableScopes.map((scope) => {
                const Icon = scope.icon;
                const isSelected = consentForm.watch('scopes').includes(scope.id);
                
                return (
                  <div
                    key={scope.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleScope(scope.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleScope(scope.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <h4 className="font-medium text-gray-900">{scope.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{scope.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {consentForm.formState.errors.scopes && (
              <p className="mt-2 text-sm text-red-600">
                {consentForm.formState.errors.scopes.message}
              </p>
            )}
          </div>

          {/* Consent Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Consent Duration
            </label>
            <select
              id="duration"
              {...consentForm.register('duration')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Warnings */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important Information</p>
                <p className="mt-1">
                  By granting these permissions, you&apos;re allowing the application to access your financial data. 
                  You can revoke these permissions at any time through your account settings.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Acceptance */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="acceptTerms"
              {...consentForm.register('acceptTerms')}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
              I understand and accept the terms of data sharing and consent to the requested permissions
            </label>
          </div>
          {consentForm.formState.errors.acceptTerms && (
            <p className="text-sm text-red-600">
              {consentForm.formState.errors.acceptTerms.message}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Grant Access'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
} 