'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, Shield } from 'lucide-react';

const securityQuestionsSchema = z.object({
  securityQuestion1: z.string().min(1, 'Please select a security question'),
  securityAnswer1: z.string().min(2, 'Answer must be at least 2 characters'),
  securityQuestion2: z.string().min(1, 'Please select a security question'),
  securityAnswer2: z.string().min(2, 'Answer must be at least 2 characters'),
}).refine((data) => data.securityQuestion1 !== data.securityQuestion2, {
  message: 'Please select different security questions',
  path: ['securityQuestion2'],
});

type SecurityQuestionsFormData = z.infer<typeof securityQuestionsSchema>;

interface SecurityQuestionsStepProps {
  formData: any;
  updateFormData: (data: Partial<SecurityQuestionsFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const securityQuestions = [
  'What was the name of your first pet?',
  'In which city were you born?',
  'What was your mother\'s maiden name?',
  'What was the name of your first school?',
  'What was your favorite food as a child?',
  'What was the make and model of your first car?',
  'What is the name of the street you grew up on?',
  'What was your childhood nickname?',
  'What is your favorite book?',
  'What is the name of the company where you had your first job?',
  'What is your favorite movie?',
  'What is the name of your favorite teacher?',
  'What is your favorite color?',
  'What is your favorite sport?',
  'What is the name of your best friend from childhood?',
];

export function SecurityQuestionsStep({ formData, updateFormData, onNext, onPrev, isLoading }: SecurityQuestionsStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SecurityQuestionsFormData>({
    resolver: zodResolver(securityQuestionsSchema),
    defaultValues: {
      securityQuestion1: formData.securityQuestion1,
      securityAnswer1: formData.securityAnswer1,
      securityQuestion2: formData.securityQuestion2,
      securityAnswer2: formData.securityAnswer2,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  const onSubmit = (data: SecurityQuestionsFormData) => {
    updateFormData(data);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Questions</h2>
        <p className="text-gray-600">Set up security questions for account recovery</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Security Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">First Security Question</h3>
          
          <div>
            <label htmlFor="securityQuestion1" className="block text-sm font-medium text-gray-700 mb-2">
              Select a security question *
            </label>
            <select
              {...register('securityQuestion1')}
              id="securityQuestion1"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.securityQuestion1 ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-describedby={errors.securityQuestion1 ? 'securityQuestion1-error' : undefined}
            >
              <option value="">Choose a security question</option>
              {securityQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
            {errors.securityQuestion1 && (
              <p id="securityQuestion1-error" className="mt-1 text-sm text-red-600">
                {errors.securityQuestion1.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="securityAnswer1" className="block text-sm font-medium text-gray-700 mb-2">
              Your answer *
            </label>
            <input
              {...register('securityAnswer1')}
              type="text"
              id="securityAnswer1"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.securityAnswer1 ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your answer"
              aria-describedby={errors.securityAnswer1 ? 'securityAnswer1-error' : undefined}
            />
            {errors.securityAnswer1 && (
              <p id="securityAnswer1-error" className="mt-1 text-sm text-red-600">
                {errors.securityAnswer1.message}
              </p>
            )}
          </div>
        </div>

        {/* Second Security Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Second Security Question</h3>
          
          <div>
            <label htmlFor="securityQuestion2" className="block text-sm font-medium text-gray-700 mb-2">
              Select a different security question *
            </label>
            <select
              {...register('securityQuestion2')}
              id="securityQuestion2"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.securityQuestion2 ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-describedby={errors.securityQuestion2 ? 'securityQuestion2-error' : undefined}
            >
              <option value="">Choose a different security question</option>
              {securityQuestions
                .filter(question => question !== watchedValues.securityQuestion1)
                .map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
            </select>
            {errors.securityQuestion2 && (
              <p id="securityQuestion2-error" className="mt-1 text-sm text-red-600">
                {errors.securityQuestion2.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="securityAnswer2" className="block text-sm font-medium text-gray-700 mb-2">
              Your answer *
            </label>
            <input
              {...register('securityAnswer2')}
              type="text"
              id="securityAnswer2"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.securityAnswer2 ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your answer"
              aria-describedby={errors.securityAnswer2 ? 'securityAnswer2-error' : undefined}
            />
            {errors.securityAnswer2 && (
              <p id="securityAnswer2-error" className="mt-1 text-sm text-red-600">
                {errors.securityAnswer2.message}
              </p>
            )}
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">💡</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-yellow-900 mb-1">Security Tips</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Choose questions that only you would know the answer to</li>
                <li>• Use answers that are easy for you to remember but hard for others to guess</li>
                <li>• Avoid using information that can be found on social media</li>
                <li>• Consider using slightly modified answers for extra security</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Account Recovery Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">ℹ</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Account Recovery</h4>
              <p className="text-sm text-blue-700">
                These security questions will be used to verify your identity if you need to recover your account 
                or reset your password. Make sure to choose questions and answers that you'll remember.
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