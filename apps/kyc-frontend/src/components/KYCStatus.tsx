
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Database,
  Copy,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KYCStatusProps {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  taskId: string;
  walletAddress: string;
  fileName?: string;
}

interface KYCResult {
  wallet: string;
  passport_number: string;
  country: string;
  mock_chain_status: string;
  verification_timestamp: string;
}

export const KYCStatus: React.FC<KYCStatusProps> = ({ 
  status, 
  taskId, 
  walletAddress, 
  fileName 
}) => {
  const [result, setResult] = useState<KYCResult | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    } else if (status === 'completed') {
      setProgress(100);
      // Simulate result data
      setResult({
        wallet: walletAddress,
        passport_number: "L898902C",
        country: "DEU",
        mock_chain_status: "stored",
        verification_timestamp: new Date().toISOString()
      });
    }
  }, [status, walletAddress]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />;
      case 'processing':
        return <Clock className="h-6 w-6 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-400" />;
      default:
        return <Shield className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Encrypting and uploading...';
      case 'processing':
        return 'Processing in TEE...';
      case 'completed':
        return 'Verification Complete';
      case 'error':
        return 'Verification Failed';
      default:
        return 'Ready for Upload';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'uploading':
        return 'Your passport image is being encrypted and uploaded securely';
      case 'processing':
        return 'OCR extraction and verification in progress within Trusted Execution Environment';
      case 'completed':
        return 'Identity verification completed successfully and stored on blockchain';
      case 'error':
        return 'An error occurred during verification. Please try again.';
      default:
        return 'Connect your wallet and upload your passport to begin verification';
    }
  };

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {getStatusIcon()}
          Verification Status
        </CardTitle>
        <CardDescription className="text-gray-300">
          {getStatusDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Progress */}
        {(status === 'uploading' || status === 'processing') && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="text-white">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Task Information */}
        {taskId && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Task Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Task ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-xs">
                    {taskId.slice(0, 12)}...
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(taskId)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {fileName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">File:</span>
                  <span className="text-white truncate max-w-32">{fileName}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-400">Network:</span>
                <span className="text-white">iExec Bellecour</span>
              </div>
            </div>
          </div>
        )}

        {/* Verification Result */}
        {status === 'completed' && result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Verification Successful</span>
            </div>
            
            <div className="space-y-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="text-white font-medium">Extracted Information</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Passport Number:</span>
                  <span className="text-white font-mono">{result.passport_number}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Country:</span>
                  <span className="text-white">{result.country}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Wallet:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-xs">
                      {result.wallet.slice(0, 6)}...{result.wallet.slice(-4)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(result.wallet)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Blockchain Status:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 capitalize">{result.mock_chain_status}</span>
                    <Database className="h-3 w-3 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={() => window.open('https://explorer.iex.ec', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on iExec Explorer
            </Button>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Verification Failed</span>
            </div>
            <p className="text-red-300 text-sm">
              Unable to process your passport. Please ensure the image is clear and try again.
            </p>
          </div>
        )}

        {/* Processing Steps */}
        {status === 'processing' && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Processing Steps</h4>
            <div className="space-y-2">
              {[
                { step: 'Image encryption verified', completed: true },
                { step: 'TEE environment initialized', completed: true },
                { step: 'OCR processing passport data', completed: progress > 30 },
                { step: 'Extracting identity information', completed: progress > 60 },
                { step: 'Writing to blockchain', completed: progress > 90 },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <div className="h-4 w-4 border-2 border-gray-600 rounded-full" />
                  )}
                  <span className={item.completed ? 'text-white' : 'text-gray-400'}>
                    {item.step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
