'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/login/LoginForm';
import { LoginHeader } from '@/components/login/LoginHeader';

export default function LoginPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2; // Login (1) and Consent (2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <LoginHeader currentStep={currentStep} totalSteps={totalSteps} />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <LoginForm 
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep}
            totalSteps={totalSteps}
          />
        </div>
      </main>
    </div>
  );
} 