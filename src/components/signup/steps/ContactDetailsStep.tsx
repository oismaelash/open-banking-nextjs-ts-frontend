'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Mail, Phone, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const contactDetailsSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phoneNumber: z.string()
    .min(14, 'Phone number must be in format (XX) XXXXX-XXXX')
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Invalid phone number format'),
  emailVerificationCode: z.string()
    .length(6, 'Email verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Email verification code must contain only numbers'),
  phoneVerificationCode: z.string()
    .length(6, 'Phone verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Phone verification code must contain only numbers'),
});

type ContactDetailsFormData = z.infer<typeof contactDetailsSchema>;

interface ContactDetailsStepProps {
  formData: any;
  updateFormData: (data: Partial<ContactDetailsFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function ContactDetailsStep({ formData, updateFormData, onNext, onPrev, isLoading }: ContactDetailsStepProps) {
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isPhoneSending, setIsPhoneSending] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ContactDetailsFormData>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      emailVerificationCode: formData.emailVerificationCode || '',
      phoneVerificationCode: formData.phoneVerificationCode || '',
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Countdown timers
  useEffect(() => {
    if (emailCountdown > 0) {
      const timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailCountdown]);

  useEffect(() => {
    if (phoneCountdown > 0) {
      const timer = setTimeout(() => setPhoneCountdown(phoneCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phoneCountdown]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
  };

  const sendEmailCode = async () => {
    if (!watchedValues.email || emailCountdown > 0) return;
    
    setIsEmailSending(true);
    try {
      // Simulate API call to send email verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailCountdown(60); // 60 seconds countdown
    } catch (error) {
      console.error('Failed to send email verification code:', error);
    } finally {
      setIsEmailSending(false);
    }
  };

  const sendPhoneCode = async () => {
    if (!watchedValues.phoneNumber || phoneCountdown > 0) return;
    
    setIsPhoneSending(true);
    try {
      // Simulate API call to send phone verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPhoneCountdown(60); // 60 seconds countdown
    } catch (error) {
      console.error('Failed to send phone verification code:', error);
    } finally {
      setIsPhoneSending(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!watchedValues.emailVerificationCode || watchedValues.emailVerificationCode.length !== 6) return;
    
    try {
      // Simulate API call to verify email code
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmailVerified(true);
    } catch (error) {
      console.error('Failed to verify email code:', error);
    }
  };

  const verifyPhoneCode = async () => {
    if (!watchedValues.phoneVerificationCode || watchedValues.phoneVerificationCode.length !== 6) return;
    
    try {
      // Simulate API call to verify phone code
      await new Promise(resolve => setTimeout(resolve, 500));
      setPhoneVerified(true);
    } catch (error) {
      console.error('Failed to verify phone code:', error);
    }
  };

  const onSubmit = (data: ContactDetailsFormData) => {
    updateFormData(data);
    onNext();
  };

  const isFormValid = isValid && emailVerified && phoneVerified;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Details & Verification</h2>
        <p className="text-gray-600">Enter your contact information and verify both email and phone number</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Email Address</h3>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              <button
                type="button"
                onClick={sendEmailCode}
                disabled={!watchedValues.email || emailCountdown > 0 || isEmailSending}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  watchedValues.email && emailCountdown === 0 && !isEmailSending
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isEmailSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : emailCountdown > 0 ? (
                  `${emailCountdown}s`
                ) : (
                  'Send Code'
                )}
              </button>
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Email Verification Code */}
          <div>
            <label htmlFor="emailVerificationCode" className="block text-sm font-medium text-gray-700 mb-2">
              Email Verification Code *
            </label>
            <div className="flex space-x-2">
              <input
                {...register('emailVerificationCode')}
                type="text"
                id="emailVerificationCode"
                maxLength={6}
                className={`flex-1 px-4 py-3 border rounded-lg text-center text-xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.emailVerificationCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="000000"
                aria-describedby={errors.emailVerificationCode ? 'emailVerificationCode-error' : undefined}
              />
              <button
                type="button"
                onClick={verifyEmailCode}
                disabled={!watchedValues.emailVerificationCode || watchedValues.emailVerificationCode.length !== 6 || emailVerified}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  watchedValues.emailVerificationCode && watchedValues.emailVerificationCode.length === 6 && !emailVerified
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {emailVerified ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  'Verify'
                )}
              </button>
            </div>
            {errors.emailVerificationCode && (
              <p id="emailVerificationCode-error" className="mt-1 text-sm text-red-600">
                {errors.emailVerificationCode.message}
              </p>
            )}
            {emailVerified && (
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Email verified successfully
              </p>
            )}
          </div>
        </div>

        {/* Phone Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Phone Number</h3>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  id="phoneNumber"
                  maxLength={15}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                  onChange={handlePhoneChange}
                  aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                />
              </div>
              <button
                type="button"
                onClick={sendPhoneCode}
                disabled={!watchedValues.phoneNumber || phoneCountdown > 0 || isPhoneSending}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  watchedValues.phoneNumber && phoneCountdown === 0 && !isPhoneSending
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isPhoneSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : phoneCountdown > 0 ? (
                  `${phoneCountdown}s`
                ) : (
                  'Send Code'
                )}
              </button>
            </div>
            {errors.phoneNumber && (
              <p id="phoneNumber-error" className="mt-1 text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Phone Verification Code */}
          <div>
            <label htmlFor="phoneVerificationCode" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Verification Code *
            </label>
            <div className="flex space-x-2">
              <input
                {...register('phoneVerificationCode')}
                type="text"
                id="phoneVerificationCode"
                maxLength={6}
                className={`flex-1 px-4 py-3 border rounded-lg text-center text-xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.phoneVerificationCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="000000"
                aria-describedby={errors.phoneVerificationCode ? 'phoneVerificationCode-error' : undefined}
              />
              <button
                type="button"
                onClick={verifyPhoneCode}
                disabled={!watchedValues.phoneVerificationCode || watchedValues.phoneVerificationCode.length !== 6 || phoneVerified}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  watchedValues.phoneVerificationCode && watchedValues.phoneVerificationCode.length === 6 && !phoneVerified
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {phoneVerified ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  'Verify'
                )}
              </button>
            </div>
            {errors.phoneVerificationCode && (
              <p id="phoneVerificationCode-error" className="mt-1 text-sm text-red-600">
                {errors.phoneVerificationCode.message}
              </p>
            )}
            {phoneVerified && (
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Phone verified successfully
              </p>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-3">Verification Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Email Verification</span>
              {emailVerified ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <XCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Pending</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Phone Verification</span>
              {phoneVerified ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <XCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Pending</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">💡</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-900 mb-1">Verification Instructions</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Enter your email and phone number</li>
                <li>• Click "Send Code" for each contact method</li>
                <li>• Enter the 6-digit verification codes received</li>
                <li>• Click "Verify" to validate each code</li>
                <li>• Both email and phone must be verified to continue</li>
              </ul>
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
            disabled={!isFormValid || isLoading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isFormValid && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 