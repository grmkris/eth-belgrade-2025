import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { KYCResult } from '../types';

interface ResultDisplayProps {
  result: KYCResult | null;
  isLoading: boolean;
  error?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 animate-spin" />
            Processing Verification
          </CardTitle>
          <CardDescription>
            Your documents are being processed in the Trusted Execution Environment...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Verification Failed
          </CardTitle>
          <CardDescription>
            There was an error processing your documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          Verification Complete
        </CardTitle>
        <CardDescription>
          Your identity has been verified using TEE technology
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Wallet Address</h4>
            <p className="font-mono text-sm bg-gray-50 p-2 rounded">
              {result.wallet.slice(0, 6)}...{result.wallet.slice(-4)}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Verification Status</h4>
            <Badge variant={result.verified ? "default" : "destructive"}>
              {result.verified ? "Verified" : "Not Verified"}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Passport Number</h4>
            <p className="font-mono text-sm bg-gray-50 p-2 rounded">
              {result.passport_number}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Country</h4>
            <p className="text-sm bg-gray-50 p-2 rounded">
              {result.country}
            </p>
          </div>
        </div>
        
        {result.taskId && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">TEE Task ID</h4>
            <p className="font-mono text-xs text-gray-500 bg-gray-50 p-2 rounded">
              {result.taskId}
            </p>
          </div>
        )}
        
        {result.timestamp && (
          <div className="text-xs text-gray-500">
            Processed at: {new Date(result.timestamp).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 