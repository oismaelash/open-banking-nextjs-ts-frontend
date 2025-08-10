'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

const addressInfoSchema = z.object({
  street: z.string().min(3, 'Street address must be at least 3 characters'),
  number: z.string().min(1, 'Number is required'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Neighborhood must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string()
    .length(9, 'ZIP code must be in format XXXXX-XXX')
    .regex(/^\d{5}-\d{3}$/, 'Invalid ZIP code format'),
});

type AddressInfoFormData = z.infer<typeof addressInfoSchema>;

interface AddressInfoStepProps {
  formData: any;
  updateFormData: (data: Partial<AddressInfoFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function AddressInfoStep({ formData, updateFormData, onNext, onPrev, isLoading }: AddressInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<AddressInfoFormData>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: {
      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    },
    mode: 'onChange',
  });

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatZipCode(e.target.value);
    e.target.value = formatted;
  };

  const onSubmit = (data: AddressInfoFormData) => {
    updateFormData(data);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Address Information</h2>
        <p className="text-gray-600">Please provide your complete residential address for KYC compliance</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Street */}
          <div className="md:col-span-2">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              {...register('street')}
              type="text"
              id="street"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.street ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Rua das Flores"
              aria-describedby={errors.street ? 'street-error' : undefined}
            />
            {errors.street && (
              <p id="street-error" className="mt-1 text-sm text-red-600">
                {errors.street.message}
              </p>
            )}
          </div>

          {/* Number */}
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
              Number *
            </label>
            <input
              {...register('number')}
              type="text"
              id="number"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.number ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="123"
              aria-describedby={errors.number ? 'number-error' : undefined}
            />
            {errors.number && (
              <p id="number-error" className="mt-1 text-sm text-red-600">
                {errors.number.message}
              </p>
            )}
          </div>

          {/* Complement */}
          <div>
            <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-2">
              Complement
            </label>
            <input
              {...register('complement')}
              type="text"
              id="complement"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Apto 45, Bloco B"
            />
          </div>

          {/* Neighborhood */}
          <div className="md:col-span-2">
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
              Neighborhood *
            </label>
            <input
              {...register('neighborhood')}
              type="text"
              id="neighborhood"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.neighborhood ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Centro"
              aria-describedby={errors.neighborhood ? 'neighborhood-error' : undefined}
            />
            {errors.neighborhood && (
              <p id="neighborhood-error" className="mt-1 text-sm text-red-600">
                {errors.neighborhood.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              {...register('city')}
              type="text"
              id="city"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.city ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="São Paulo"
              aria-describedby={errors.city ? 'city-error' : undefined}
            />
            {errors.city && (
              <p id="city-error" className="mt-1 text-sm text-red-600">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              {...register('state')}
              id="state"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.state ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-describedby={errors.state ? 'state-error' : undefined}
            >
              <option value="">Select a state</option>
              {brazilianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && (
              <p id="state-error" className="mt-1 text-sm text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* ZIP Code */}
          <div className="md:col-span-2">
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              {...register('zipCode')}
              type="text"
              id="zipCode"
              maxLength={9}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.zipCode ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="01234-567"
              onChange={handleZipCodeChange}
              aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
            />
            {errors.zipCode && (
              <p id="zipCode-error" className="mt-1 text-sm text-red-600">
                {errors.zipCode.message}
              </p>
            )}
          </div>
        </div>

        {/* KYC Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">ℹ</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-900 mb-1">KYC Compliance</h4>
              <p className="text-sm text-purple-700">
                This address information is required for Know Your Customer (KYC) compliance. 
                We use this data to verify your identity and comply with banking regulations.
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