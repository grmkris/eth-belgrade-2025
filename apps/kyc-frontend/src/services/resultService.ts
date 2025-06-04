import { KYCResult } from '../types';
import { walletService } from './walletService';

export interface PollingResult {
  result: KYCResult | null;
  isComplete: boolean;
  error?: string;
}

class ResultService {
  /**
   * Poll for KYC verification results from TEE processing
   * For POC, this returns mock data after a delay
   */
  async pollForResults(taskId: string): Promise<PollingResult> {
    try {
      console.log('Result Service: Polling for results of task:', taskId);
      
      // Simulate polling delay (in real implementation, this would poll iExec)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get the current wallet address
      const walletState = walletService.getState();
      if (!walletState.address) {
        return {
          result: null,
          isComplete: false,
          error: 'Wallet not connected',
        };
      }

      // For POC demo, return hardcoded passport data
      // In a real implementation, this would:
      // 1. Use iExec SDK to check task status
      // 2. Retrieve results when task is completed
      // 3. Parse the OCR results from the TEE processing
      // 4. Return the extracted passport data
      
      const mockResult: KYCResult = {
        wallet: walletState.address,
        passport_number: 'L898902C',
        country: 'DEU',
        verified: true,
        taskId,
        timestamp: Date.now(),
      };

      console.log('Result Service: KYC verification completed:', mockResult);

      return {
        result: mockResult,
        isComplete: true,
      };
      
    } catch (error) {
      console.error('Error polling for results:', error);
      return {
        result: null,
        isComplete: false,
        error: `Polling failed: ${error.message}`,
      };
    }
  }

  /**
   * Check the status of a TEE task
   * For POC, this is simplified
   */
  async checkTaskStatus(taskId: string): Promise<'pending' | 'processing' | 'completed' | 'failed'> {
    try {
      // Simulate status check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For POC, assume all tasks complete successfully after a delay
      const age = Date.now() - parseInt(taskId.split('_')[2] || '0');
      
      if (age < 1000) {
        return 'pending';
      } else if (age < 3000) {
        return 'processing';
      } else {
        return 'completed';
      }
      
    } catch (error) {
      console.error('Error checking task status:', error);
      return 'failed';
    }
  }
}

// Export singleton instance
export const resultService = new ResultService(); 