export interface KYCResult {
  wallet: string;
  passport_number: string;
  country: string;
  verified: boolean;
  taskId?: string;
  timestamp?: number;
}

export interface VerificationStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  progress?: number;
}

export interface KYCSubmission {
  files: File[];
  walletAddress: string;
  timestamp: number;
} 