'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Calendar, CreditCard, ArrowRight } from 'lucide-react';

const personalInfoSchema = z.object({
  fullName: z.string()
    .min(3, 'Full name must be at least 3 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Full name can only contain letters and spaces'),
  cpf: z.string()
    .length(14, 'CPF must be in format XXX.XXX.XXX-XX')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Invalid CPF format'),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in format DD/MM/YYYY')
    .refine((date) => {
      const [day, month, year] = date.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      // Adjust age if birthday hasn't occurred this year
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      
      return adjustedAge >= 18 && adjustedAge <= 120;
    }, 'You must be at least 18 years old'),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  formData: any;
  updateFormData: (data: Partial<PersonalInfoFormData>) => void;
  onNext: () => void;
  isLoading: boolean;
}

export function PersonalInfoStep({ formData, updateFormData, onNext, isLoading }: PersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: formData.fullName,
      cpf: formData.cpf,
      dateOfBirth: formData.dateOfBirth,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted, { shouldValidate: true });
    trigger('cpf');
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value);
    setValue('dateOfBirth', formatted, { shouldValidate: true });
    trigger('dateOfBirth');
  };

  const onSubmit = (data: PersonalInfoFormData) => {
    updateFormData(data);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Please provide your basic personal details to get started</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <input
              {...register('fullName')}
              type="text"
              id="fullName"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
          </div>
          {errors.fullName && (
            <p id="fullName-error" className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
            CPF (Brazilian Tax ID) *
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('cpf')}
              type="text"
              id="cpf"
              maxLength={14}
              value={watchedValues.cpf || ''}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.cpf ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="000.000.000-00"
              onChange={handleCPFChange}
              aria-describedby={errors.cpf ? 'cpf-error' : undefined}
            />
          </div>
          {errors.cpf && (
            <p id="cpf-error" className="mt-1 text-sm text-red-600">
              {errors.cpf.message}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('dateOfBirth')}
              type="text"
              id="dateOfBirth"
              value={watchedValues.dateOfBirth || ''}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="DD/MM/YYYY"
              onChange={handleDateChange}
              aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
            />
          </div>
          {errors.dateOfBirth && (
            <p id="dateOfBirth-error" className="mt-1 text-sm text-red-600">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">!</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Security Notice</h4>
              <p className="text-sm text-blue-700">
                Your personal information is protected with bank-level encryption. 
                We use this data only for account verification and regulatory compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end pt-6">
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