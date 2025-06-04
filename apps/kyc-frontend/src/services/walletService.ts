import { BrowserProvider, JsonRpcSigner } from 'ethers';

export interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnected: boolean;
}

class WalletService {
  private state: WalletState = {
    address: null,
    provider: null,
    signer: null,
    isConnected: false,
  };

  private listeners: ((state: WalletState) => void)[] = [];

  /**
   * Get the current wallet state
   */
  getState(): WalletState {
    return { ...this.state };
  }

  /**
   * Get the ethers.js provider for TEE services
   */
  getProvider(): BrowserProvider | null {
    return this.state.provider;
  }

  /**
   * Get the ethers.js signer for transactions
   */
  getSigner(): JsonRpcSigner | null {
    return this.state.signer;
  }

  /**
   * Subscribe to wallet state changes
   */
  subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Connect to MetaMask using ethers.js BrowserProvider
   */
  async connectMetaMask(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create ethers.js provider
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Update state
      this.state = {
        address,
        provider,
        signer,
        isConnected: true,
      };

      // Notify listeners
      this.notifyListeners();

      return address;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  }

  /**
   * Check if wallet is already connected
   */
  async checkConnection(): Promise<string | null> {
    if (!window.ethereum) {
      return null;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        // Create ethers.js provider for existing connection
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Update state
        this.state = {
          address,
          provider,
          signer,
          isConnected: true,
        };

        // Notify listeners
        this.notifyListeners();

        return address;
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }

    return null;
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.state = {
      address: null,
      provider: null,
      signer: null,
      isConnected: false,
    };

    // Notify listeners
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

// Export singleton instance
export const walletService = new WalletService();

// Export types for external use
export { BrowserProvider, JsonRpcSigner } from 'ethers'; 