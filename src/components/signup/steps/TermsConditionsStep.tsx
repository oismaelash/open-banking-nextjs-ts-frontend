'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { FileText, ArrowRight, ArrowLeft, ExternalLink, Check } from 'lucide-react';

const termsConditionsSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms of Service',
  }),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Privacy Policy',
  }),
  acceptMarketing: z.boolean().optional(),
});

type TermsConditionsFormData = z.infer<typeof termsConditionsSchema>;

interface TermsConditionsStepProps {
  formData: any;
  updateFormData: (data: Partial<TermsConditionsFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function TermsConditionsStep({ formData, updateFormData, onNext, onPrev, isLoading }: TermsConditionsStepProps) {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<TermsConditionsFormData>({
    resolver: zodResolver(termsConditionsSchema),
    defaultValues: {
      acceptTerms: formData.acceptTerms,
      acceptPrivacy: formData.acceptPrivacy,
      acceptMarketing: formData.acceptMarketing,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  const onSubmit = (data: TermsConditionsFormData) => {
    updateFormData(data);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms & Conditions</h2>
        <p className="text-gray-600">Please review and accept our terms of service and privacy policy</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Terms of Service */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-5 mt-0.5">
              <input
                {...register('acceptTerms')}
                type="checkbox"
                id="acceptTerms"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                aria-describedby={errors.acceptTerms ? 'acceptTerms-error' : undefined}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="acceptTerms" className="text-sm font-medium text-gray-700 cursor-pointer">
                I accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(!showTerms)}
                  className="text-blue-600 hover:text-blue-700 underline inline-flex items-center space-x-1"
                >
                  <span>Terms of Service</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </label>
              {errors.acceptTerms && (
                <p id="acceptTerms-error" className="mt-1 text-sm text-red-600">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms of Service Modal */}
          {showTerms && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Terms of Service</h3>
                    <button
                      type="button"
                      onClick={() => setShowTerms(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <h4>1. Acceptance of Terms</h4>
                    <p>By accessing and using this Open Banking platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    
                    <h4>2. Use License</h4>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Open Banking's website for personal, non-commercial transitory viewing only.</p>
                    
                    <h4>3. Disclaimer</h4>
                    <p>The materials on Open Banking's website are provided on an 'as is' basis. Open Banking makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    
                    <h4>4. Limitations</h4>
                    <p>In no event shall Open Banking or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Open Banking's website.</p>
                    
                    <h4>5. Revisions and Errata</h4>
                    <p>The materials appearing on Open Banking's website could include technical, typographical, or photographic errors. Open Banking does not warrant that any of the materials on its website are accurate, complete or current.</p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowTerms(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Policy */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-5 mt-0.5">
              <input
                {...register('acceptPrivacy')}
                type="checkbox"
                id="acceptPrivacy"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                aria-describedby={errors.acceptPrivacy ? 'acceptPrivacy-error' : undefined}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="acceptPrivacy" className="text-sm font-medium text-gray-700 cursor-pointer">
                I accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(!showPrivacy)}
                  className="text-blue-600 hover:text-blue-700 underline inline-flex items-center space-x-1"
                >
                  <span>Privacy Policy</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </label>
              {errors.acceptPrivacy && (
                <p id="acceptPrivacy-error" className="mt-1 text-sm text-red-600">
                  {errors.acceptPrivacy.message}
                </p>
              )}
            </div>
          </div>

          {/* Privacy Policy Modal */}
          {showPrivacy && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Privacy Policy</h3>
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <h4>1. Information We Collect</h4>
                    <p>We collect information you provide directly to us, such as when you create an account, complete forms, or contact us for support.</p>
                    
                    <h4>2. How We Use Your Information</h4>
                    <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                    
                    <h4>3. Information Sharing</h4>
                    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                    
                    <h4>4. Data Security</h4>
                    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    
                    <h4>5. Your Rights</h4>
                    <p>You have the right to access, correct, or delete your personal information. You may also withdraw your consent at any time.</p>
                    
                    <h4>6. Data Retention</h4>
                    <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations.</p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Marketing Communications */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-5 mt-0.5">
              <input
                {...register('acceptMarketing')}
                type="checkbox"
                id="acceptMarketing"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="acceptMarketing" className="text-sm font-medium text-gray-700 cursor-pointer">
                I agree to receive marketing communications about new features and services
              </label>
              <p className="text-sm text-gray-500 mt-1">
                You can unsubscribe at any time. This is optional and does not affect your account creation.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 text-sm font-bold">ℹ</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-indigo-900 mb-1">Important Information</h4>
              <p className="text-sm text-indigo-700">
                By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by our Terms of Service and Privacy Policy. 
                These documents outline your rights and responsibilities as a user of our platform.
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