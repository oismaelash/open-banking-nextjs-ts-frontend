import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Building2 className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Open Banking
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Experience the future of banking with secure account management, 
            instant PIX payments, and advanced security features.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/signup"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
