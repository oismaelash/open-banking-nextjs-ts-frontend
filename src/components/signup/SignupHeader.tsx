import { Building2, Shield, CheckCircle } from 'lucide-react';

interface SignupHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function SignupHeader({ currentStep, totalSteps }: SignupHeaderProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Open Banking</h1>
              <p className="text-sm text-gray-500">Secure Account Creation</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Secure</span>
          </div>
        </div>
      </div>
    </header>
  );
} 