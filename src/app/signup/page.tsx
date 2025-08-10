'use client';

import { useState } from 'react';
import { SignupForm } from '@/components/signup/SignupForm';
import { SignupHeader } from '@/components/signup/SignupHeader';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10; // Updated to include all steps including success

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <SignupHeader currentStep={currentStep} totalSteps={totalSteps} />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <SignupForm 
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep}
            totalSteps={totalSteps}
          />
        </div>
      </main>
    </div>
  );
} 