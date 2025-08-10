'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';

const emailVerificationSchema = z.object({
  emailVerificationCode: z.string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
});

type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

interface EmailVerificationStepProps {
  formData: any;
  updateFormData: (data: Partial<EmailVerificationFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function EmailVerificationStep({ formData, updateFormData, onNext, onPrev, isLoading }: EmailVerificationStepProps) {
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      emailVerificationCode: formData.emailVerificationCode,
    },
    mode: 'onChange',
  });

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-send verification code when component mounts
  useEffect(() => {
    if (!verificationSent) {
      sendVerificationCode();
    }
  }, []);

  const sendVerificationCode = async () => {
    setIsResending(true);
    try {
      // Simulate API call to send verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVerificationSent(true);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      console.error('Failed to send verification code:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown === 0) {
      await sendVerificationCode();
    }
  };

  const onSubmit = (data: EmailVerificationFormData) => {
    updateFormData(data);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification</h2>
        <p className="text-gray-600">We've sent a verification code to your email address</p>
      </div>

      {/* Email Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Verification code sent to:</p>
              <p className="text-sm text-gray-600">{formData.email}</p>
            </div>
          </div>
          {verificationSent && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Sent</span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Verification Code */}
        <div>
          <label htmlFor="emailVerificationCode" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code *
          </label>
          <input
            {...register('emailVerificationCode')}
            type="text"
            id="emailVerificationCode"
            maxLength={6}
            className={`w-full px-4 py-3 border rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.emailVerificationCode ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="000000"
            aria-describedby={errors.emailVerificationCode ? 'emailVerificationCode-error' : undefined}
          />
          {errors.emailVerificationCode && (
            <p id="emailVerificationCode-error" className="mt-1 text-sm text-red-600">
              {errors.emailVerificationCode.message}
            </p>
          )}
        </div>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={countdown > 0 || isResending}
            className={`inline-flex items-center space-x-2 text-sm font-medium transition-colors ${
              countdown > 0 || isResending
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : countdown > 0 ? (
              <>
                <span>Resend code in {countdown}s</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Resend verification code</span>
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">💡</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Verification Instructions</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check your email inbox for a 6-digit verification code</li>
                <li>• The code expires in 10 minutes for security</li>
                <li>• If you don't see the email, check your spam folder</li>
                <li>• You can request a new code if needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">🔒</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-900 mb-1">Security Verification</h4>
              <p className="text-sm text-green-700">
                This step ensures that you have access to the email address you provided. 
                This helps protect your account from unauthorized access.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isValid && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 