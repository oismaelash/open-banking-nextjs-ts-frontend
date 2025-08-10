'use client';

import { CheckCircle, Mail, Shield, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

export function SignupSuccessStep() {
  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Account Created Successfully!</h2>
        <p className="text-gray-600">Welcome to Open Banking. Your account is now ready to use.</p>
      </div>

      {/* Success Details */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Account verification completed</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Security settings configured</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Document verification in progress</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">What's Next?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Verification */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Email Verification</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Check your email for a verification link to activate your account fully.
            </p>
            <div className="text-xs text-gray-500">
              Expected: Within 5 minutes
            </div>
          </div>

          {/* Document Review */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-900">Document Review</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Our team will review your uploaded documents for verification.
            </p>
            <div className="text-xs text-gray-500">
              Expected: 1-2 business days
            </div>
          </div>
        </div>
      </div>

      {/* Account Features */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Account Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 text-lg font-bold">🏦</span>
            </div>
            <h4 className="font-medium text-gray-900 text-sm">Account Management</h4>
            <p className="text-xs text-gray-600">View balances and transactions</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 text-lg font-bold">💳</span>
            </div>
            <h4 className="font-medium text-gray-900 text-sm">PIX Payments</h4>
            <p className="text-xs text-gray-600">Send and receive instant payments</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 text-lg font-bold">🔐</span>
            </div>
            <h4 className="font-medium text-gray-900 text-sm">Security</h4>
            <p className="text-xs text-gray-600">Advanced security features</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>

      {/* Support Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Our support team is available 24/7 to assist you with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href="mailto:support@openbanking.com"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              support@openbanking.com
            </a>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <a
              href="tel:+5511999999999"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              +55 (11) 99999-9999
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 