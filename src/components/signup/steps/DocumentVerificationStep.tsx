'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, ArrowRight, ArrowLeft, Eye } from 'lucide-react';

const documentVerificationSchema = z.object({
  documentType: z.enum(['rg', 'cnh', 'passport']),
  documentFile: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB max
    'File size must be less than 10MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type),
    'File must be JPEG, PNG, or PDF'
  ),
});

type DocumentVerificationFormData = z.infer<typeof documentVerificationSchema>;

interface DocumentVerificationStepProps {
  formData: any;
  updateFormData: (data: Partial<DocumentVerificationFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function DocumentVerificationStep({ formData, updateFormData, onNext, onPrev, isLoading }: DocumentVerificationStepProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(formData.documentFile);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<DocumentVerificationFormData>({
    resolver: zodResolver(documentVerificationSchema),
    defaultValues: {
      documentType: formData.documentType,
      documentFile: formData.documentFile,
    },
    mode: 'onChange',
  });

  // Watch form values to track changes
  const watchedValues = watch();
  
  // Check if both document type and file are selected
  const isFormComplete = watchedValues.documentType && uploadedFile;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setValue('documentFile', file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setValue('documentFile', null as any);
  };

  const onSubmit = (data: DocumentVerificationFormData) => {
    updateFormData(data);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Verification</h2>
        <p className="text-gray-600">Upload a valid identity document for verification</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Document Type */}
        <div>
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
            Document Type *
          </label>
          <select
            {...register('documentType')}
            id="documentType"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.documentType ? 'border-red-300' : 'border-gray-300'
            }`}
            aria-describedby={errors.documentType ? 'documentType-error' : undefined}
          >
            <option value="">Select document type</option>
            <option value="rg">RG (Identity Card)</option>
            <option value="cnh">CNH (Driver's License)</option>
            <option value="passport">Passport</option>
          </select>
          {errors.documentType && (
            <p id="documentType-error" className="mt-1 text-sm text-red-600">
              {errors.documentType.message}
            </p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Document *
          </label>
          
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop your document here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Accepted formats: JPEG, PNG, PDF (max 10MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => window.open(previewUrl, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Preview document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {errors.documentFile && (
            <p className="mt-1 text-sm text-red-600">
              {errors.documentFile.message}
            </p>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm font-bold">🔒</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-orange-900 mb-1">Secure Upload</h4>
              <p className="text-sm text-orange-700">
                Your document is encrypted and stored securely. We use this only for identity verification 
                and comply with all data protection regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Document Requirements:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Document must be clearly legible and not expired</li>
            <li>• All information must be visible and unaltered</li>
            <li>• File size must be under 10MB</li>
            <li>• Accepted formats: JPEG, PNG, PDF</li>
          </ul>
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
            disabled={!isFormComplete || isLoading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isFormComplete && !isLoading
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