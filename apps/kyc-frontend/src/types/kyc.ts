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

export interface PassportDataset {
  datasetType: 'passport-images';
  version: string;
  images: PassportImageData[];
  metadata: DatasetMetadata;
}

export interface PassportImageData {
  data: string; // base64 encoded image
  name: string;
  metadata: {
    filename: string;
    size: number;
    type: string;
    lastModified: number;
  };
}

export interface DatasetMetadata {
  totalFiles: number;
  uploadTimestamp: number;
  purpose: 'kyc-verification';
  processingType: 'ocr-passport-extraction';
} 