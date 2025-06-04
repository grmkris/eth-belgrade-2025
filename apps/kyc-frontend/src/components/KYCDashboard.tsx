import React, { useState } from 'react';
import { WalletConnect } from './WalletConnect';
import { FileUpload } from './FileUpload';
import { ResultDisplay } from './ResultDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowRight } from 'lucide-react';
import { teeService } from '../services/teeService';
import { resultService } from '../services/resultService';
import { KYCResult } from '../types';

export const KYCDashboard = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [kycResult, setKycResult] = useState<KYCResult | null>(null);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'wallet' | 'upload' | 'processing' | 'results'>('wallet');

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    if (address) {
      setCurrentStep('upload');
    } else {
      setCurrentStep('wallet');
      // Reset everything when wallet disconnects
      setUploadedFiles([]);
      setKycResult(null);
      setError('');
    }
  };

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async () => {
    if (!walletAddress || uploadedFiles.length === 0) {
      setError('Please connect wallet and upload files');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setCurrentStep('processing');
      
      // Submit to TEE service
      console.log('Submitting files to TEE...');
      const submissionResult = await teeService.submitPassportForProcessing(uploadedFiles);
      
      console.log('TEE submission successful, starting polling...');
      setIsPolling(true);
      setIsSubmitting(false);
      
      // Poll for results
      const pollingResult = await resultService.pollForResults(submissionResult.taskId);
      
      setIsPolling(false);
      
      if (pollingResult.error) {
        setError(pollingResult.error);
        setCurrentStep('upload');
      } else if (pollingResult.result) {
        setKycResult(pollingResult.result);
        setCurrentStep('results');
      } else {
        setError('No results received from verification process');
        setCurrentStep('upload');
      }
      
    } catch (err) {
      console.error('Error in KYC verification flow:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsSubmitting(false);
      setIsPolling(false);
      setCurrentStep('upload');
    }
  };

  const handleStartOver = () => {
    setUploadedFiles([]);
    setKycResult(null);
    setError('');
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Passport Verification</h1>
          <p className="text-gray-600">Secure identity verification using Trusted Execution Environment (TEE)</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className={`flex items-center ${currentStep === 'wallet' ? 'text-blue-600 font-medium' : walletAddress ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                currentStep === 'wallet' ? 'bg-blue-100 text-blue-600' : 
                walletAddress ? 'bg-green-100 text-green-600' : 'bg-gray-100'
              }`}>
                1
              </span>
              Connect Wallet
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600 font-medium' : 
              ['processing', 'results'].includes(currentStep) ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                currentStep === 'upload' ? 'bg-blue-100 text-blue-600' : 
                ['processing', 'results'].includes(currentStep) ? 'bg-green-100 text-green-600' : 'bg-gray-100'
              }`}>
                2
              </span>
              Upload Documents
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center ${currentStep === 'processing' ? 'text-blue-600 font-medium' : 
              currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                currentStep === 'processing' ? 'bg-blue-100 text-blue-600' : 
                currentStep === 'results' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
              }`}>
                3
              </span>
              TEE Processing
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center ${currentStep === 'results' ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                currentStep === 'results' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
              }`}>
                4
              </span>
              Results
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Wallet Connection */}
          <WalletConnect 
            onWalletConnect={handleWalletConnect}
            walletAddress={walletAddress}
          />
          
          {/* Step 2: File Upload */}
          {walletAddress && ['upload', 'processing'].includes(currentStep) && (
            <FileUpload 
              onFileUpload={handleFileUpload}
              uploadedFiles={uploadedFiles}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Step 3 & 4: Processing and Results */}
          {currentStep === 'processing' && (
            <ResultDisplay 
              result={null}
              isLoading={isSubmitting || isPolling}
              error={error}
            />
          )}

          {currentStep === 'results' && (
            <>
              <ResultDisplay 
                result={kycResult}
                isLoading={false}
                error={error}
              />
              {kycResult && (
                <div className="text-center">
                  <button
                    onClick={handleStartOver}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Verify Another Document
                  </button>
                </div>
              )}
            </>
          )}

          {/* Error Display */}
          {error && currentStep !== 'processing' && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
