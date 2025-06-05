import { KYCResult } from '../types';
import { walletService } from './walletService';
import { teeService } from './teeService';

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
      
      // Get the current wallet address
      const walletState = walletService.getState();
      if (!walletState.address) {
        return {
          result: null,
          isComplete: false,
          error: 'Wallet not connected',
        };
      }

      // Check if this is a real iExec task ID (starts with 0x) or a mock task
      if (taskId.startsWith('0x') && taskId.length === 66) {
        console.log('🔍 Checking real iExec task status...');
        
        try {
          // Try to get results from the real TEE processing
          const teeResults = await teeService.getProcessingResults(taskId);
          
          console.log('✅ Retrieved real TEE results:', teeResults);
          
          // Parse the OCR results from TEE
          const result: KYCResult = {
            wallet: walletState.address,
            passport_number: teeResults.passport_number || 'Unknown',
            country: teeResults.country || 'Unknown',
            verified: teeResults.verified || false,
            taskId,
            timestamp: teeResults.timestamp || Date.now(),
          };

          return {
            result,
            isComplete: true,
          };
          
        } catch (teeError) {
          console.warn('⚠️ Real TEE results not ready yet, task may still be processing:', teeError);
          
          // Task is still processing, return not complete
          return {
            result: null,
            isComplete: false,
          };
        }
      } else {
        // Fallback for mock tasks or manual testing
        console.log('📝 Using mock results for demo/testing task:', taskId);
        
        // Simulate polling delay for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockResult: KYCResult = {
          wallet: walletState.address,
          passport_number: 'L898902C3',
          country: 'DEU',
          verified: true,
          taskId,
          timestamp: Date.now(),
        };

        console.log('Result Service: Mock KYC verification completed:', mockResult);

        return {
          result: mockResult,
          isComplete: true,
        };
      }
      
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
   */
  async checkTaskStatus(taskId: string): Promise<'pending' | 'processing' | 'completed' | 'failed'> {
    try {
      // Check if this is a real iExec task ID
      if (taskId.startsWith('0x') && taskId.length === 66) {
        console.log('🔍 Checking real iExec task status for:', taskId);
        
        try {
          // Try to get results - if successful, task is completed
          await teeService.getProcessingResults(taskId);
          return 'completed';
        } catch (error) {
          // If results not available, task is still processing
          console.log('Task still processing or pending...');
          return 'processing';
        }
      } else {
        // Mock task status for demo/testing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const age = Date.now() - parseInt(taskId.split('_')[1] || '0');
        
        if (age < 1000) {
          return 'pending';
        } else if (age < 3000) {
          return 'processing';
        } else {
          return 'completed';
        }
      }
      
    } catch (error) {
      console.error('Error checking task status:', error);
      return 'failed';
    }
  }
}

// Export singleton instance
export const resultService = new ResultService(); 