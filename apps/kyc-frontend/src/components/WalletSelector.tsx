import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { walletService } from '@/services/walletService';

interface WalletOption {
  name: string;
  id: string;
  icon: string;
  detectProvider: () => any;
}

interface WalletSelectorProps {
  onWalletConnect: (address: string, walletType: string) => void;
}

const walletOptions: WalletOption[] = [
  {
    name: 'MetaMask',
    id: 'metamask',
    icon: '🦊',
    detectProvider: () => window.ethereum && window.ethereum.isMetaMask ? window.ethereum : null
  },
  // Note: For POC, we're focusing on MetaMask/Ethereum wallets for TEE integration
  // Other wallets can be added later if needed
];

export const WalletSelector: React.FC<WalletSelectorProps> = ({ onWalletConnect }) => {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const connectWallet = async (wallet: WalletOption) => {
    setIsConnecting(wallet.id);

    try {
      const provider = wallet.detectProvider();
      
      if (!provider) {
        alert(`${wallet.name} is not installed. Please install ${wallet.name} to continue.`);
        setIsConnecting(null);
        return;
      }

      let address: string;

      if (wallet.id === 'metamask') {
        // Use our wallet service with ethers.js BrowserProvider
        address = await walletService.connectMetaMask();
      } else {
        // Fallback for other wallets (not yet implemented with ethers.js)
        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        });
        address = accounts[0];
      }

      if (address) {
        onWalletConnect(address, wallet.name);
      }
    } catch (err) {
      console.error(`Error connecting to ${wallet.name}:`, err);
      alert(`Failed to connect to ${wallet.name}. Please try again.`);
    } finally {
      setIsConnecting(null);
    }
  };

  const getAvailableWallets = () => {
    return walletOptions.filter(wallet => {
      return wallet.detectProvider() !== null;
    });
  };

  const availableWallets = getAvailableWallets();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {availableWallets.map((wallet) => (
            <Button
              key={wallet.id}
              onClick={() => connectWallet(wallet)}
              disabled={isConnecting !== null}
              variant="outline"
              className="flex items-center justify-start gap-3 h-12"
            >
              {isConnecting === wallet.id ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <>
                  <span className="text-xl">{wallet.icon}</span>
                  <span>{wallet.name}</span>
                </>
              )}
            </Button>
          ))}
          
          {availableWallets.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p>No compatible wallets detected.</p>
              <p className="text-sm mt-2">Please install MetaMask to continue.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

declare global {
  interface Window {
    ethereum?: any;
    phantom?: any;
    solana?: any;
  }
}
