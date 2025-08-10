'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Fingerprint, Camera, ArrowRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const biometricSetupSchema = z.object({
  enableBiometric: z.boolean(),
  biometricType: z.enum(['fingerprint', 'face', 'none']),
});

type BiometricSetupFormData = z.infer<typeof biometricSetupSchema>;

interface BiometricSetupStepProps {
  formData: any;
  updateFormData: (data: Partial<BiometricSetupFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function BiometricSetupStep({ formData, updateFormData, onNext, onPrev, isLoading }: BiometricSetupStepProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<BiometricSetupFormData>({
    resolver: zodResolver(biometricSetupSchema),
    defaultValues: {
      enableBiometric: formData.enableBiometric,
      biometricType: formData.biometricType,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  const simulateEnrollment = async (type: 'fingerprint' | 'face') => {
    setIsEnrolling(true);
    setEnrollmentProgress(0);
    
    // Simulate enrollment process
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEnrollmentProgress(i);
    }
    
    setEnrollmentComplete(true);
    setIsEnrolling(false);
    setValue('biometricType', type);
  };

  const skipBiometric = () => {
    setValue('enableBiometric', false);
    setValue('biometricType', 'none');
  };

  const onSubmit = (data: BiometricSetupFormData) => {
    updateFormData(data);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <Fingerprint className="w-8 h-8 text-teal-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Biometric Setup</h2>
        <p className="text-gray-600">Set up fingerprint or face recognition for quick and secure access</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Biometric Options */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Choose your biometric method</h3>
          </div>

          {/* Fingerprint Option */}
          <div className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
            watchedValues.biometricType === 'fingerprint' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                watchedValues.biometricType === 'fingerprint' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Fingerprint className={`w-6 h-6 ${
                  watchedValues.biometricType === 'fingerprint' ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Fingerprint Recognition</h4>
                <p className="text-sm text-gray-600">Use your fingerprint for quick and secure login</p>
              </div>
              {watchedValues.biometricType === 'fingerprint' && (
                <CheckCircle className="w-6 h-6 text-blue-600" />
              )}
            </div>
            
            {watchedValues.biometricType === 'fingerprint' && (
              <div className="mt-4">
                {!enrollmentComplete ? (
                  <button
                    type="button"
                    onClick={() => simulateEnrollment('fingerprint')}
                    disabled={isEnrolling}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEnrolling ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enrolling... {enrollmentProgress}%</span>
                      </div>
                    ) : (
                      'Enroll Fingerprint'
                    )}
                  </button>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Fingerprint enrolled successfully</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Face Recognition Option */}
          <div className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
            watchedValues.biometricType === 'face' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                watchedValues.biometricType === 'face' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Camera className={`w-6 h-6 ${
                  watchedValues.biometricType === 'face' ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Face Recognition</h4>
                <p className="text-sm text-gray-600">Use your face for quick and secure login</p>
              </div>
              {watchedValues.biometricType === 'face' && (
                <CheckCircle className="w-6 h-6 text-blue-600" />
              )}
            </div>
            
            {watchedValues.biometricType === 'face' && (
              <div className="mt-4">
                {!enrollmentComplete ? (
                  <button
                    type="button"
                    onClick={() => simulateEnrollment('face')}
                    disabled={isEnrolling}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEnrolling ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enrolling... {enrollmentProgress}%</span>
                      </div>
                    ) : (
                      'Enroll Face Recognition'
                    )}
                  </button>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Face recognition enrolled successfully</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <button
              type="button"
              onClick={skipBiometric}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Skip biometric setup for now
            </button>
            <p className="text-xs text-gray-400 mt-1">
              You can always set this up later in your account settings
            </p>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 text-sm font-bold">🔒</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-teal-900 mb-1">Enhanced Security</h4>
              <p className="text-sm text-teal-700">
                Biometric authentication provides an additional layer of security. Your biometric data is 
                encrypted and stored securely on your device, never transmitted to our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">ℹ</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Privacy & Security</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your biometric data never leaves your device</li>
                <li>• Biometric authentication is optional and can be disabled anytime</li>
                <li>• You can still use your password as a backup authentication method</li>
                <li>• Multiple biometric profiles can be enrolled for family members</li>
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
            disabled={isLoading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              !isLoading
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
                <span>Complete Setup</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 