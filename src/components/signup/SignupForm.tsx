'use client';

import { useState } from 'react';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ContactDetailsStep } from './steps/ContactDetailsStep';
import { AddressInfoStep } from './steps/AddressInfoStep';
import { DocumentVerificationStep } from './steps/DocumentVerificationStep';
import { PasswordSecurityStep } from './steps/PasswordSecurityStep';
import { TermsConditionsStep } from './steps/TermsConditionsStep';
import { EmailVerificationStep } from './steps/EmailVerificationStep';
import { SecurityQuestionsStep } from './steps/SecurityQuestionsStep';
import { BiometricSetupStep } from './steps/BiometricSetupStep';
import { SignupSuccessStep } from './steps/SignupSuccessStep';

interface SignupFormData {
  // Personal Information
  fullName: string;
  cpf: string;
  dateOfBirth: string;
  
  // Contact Details
  email: string;
  phoneNumber: string;
  emailVerificationCode: string;
  phoneVerificationCode: string;
  
  // Address Information
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Document Verification
  documentType: 'rg' | 'cnh' | 'passport';
  documentFile: File | null;
  
  // Password Security
  password: string;
  confirmPassword: string;
  
  // Terms & Conditions
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
  
  // Security Questions
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
  
  // Biometric Setup
  enableBiometric: boolean;
  biometricType: 'fingerprint' | 'face' | 'none';
}

interface SignupFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

export function SignupForm({ currentStep, setCurrentStep, totalSteps }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    cpf: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    emailVerificationCode: '',
    phoneVerificationCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    documentType: 'rg',
    documentFile: null,
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMarketing: false,
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
    enableBiometric: false,
    biometricType: 'none',
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (updates: Partial<SignupFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      nextStep();
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <ContactDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <AddressInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <DocumentVerificationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 5:
        return (
          <PasswordSecurityStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 6:
        return (
          <TermsConditionsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 7:
        return (
          <EmailVerificationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 8:
        return (
          <SecurityQuestionsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleSubmit}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 9:
        return (
          <BiometricSetupStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 10:
        return <SignupSuccessStep />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {renderStep()}
    </div>
  );
} 