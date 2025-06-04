import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Check } from 'lucide-react';
import { WalletSelector } from './WalletSelector';
import { walletService } from '@/services/walletService';

interface WalletConnectProps {
  onWalletConnect: (address: string) => void;
  walletAddress: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletConnect, walletAddress }) => {
  const [connectedWalletType, setConnectedWalletType] = useState<string>('');

  const handleWalletConnect = (address: string, walletType: string) => {
    setConnectedWalletType(walletType);
    onWalletConnect(address);
  };

  const disconnectWallet = () => {
    walletService.disconnect();
    setConnectedWalletType('');
    onWalletConnect('');
  };

  useEffect(() => {
    // Subscribe to wallet service state changes
    const unsubscribe = walletService.subscribe((state) => {
      if (state.isConnected && state.address) {
        setConnectedWalletType('MetaMask'); // For now, we only support MetaMask
        onWalletConnect(state.address);
      } else if (!state.isConnected) {
        setConnectedWalletType('');
        onWalletConnect('');
      }
    });

    // Check for existing connections on load using wallet service
    const checkExistingConnections = async () => {
      try {
        const address = await walletService.checkConnection();
        if (address) {
          setConnectedWalletType('MetaMask');
          onWalletConnect(address);
        }
      } catch (error) {
        console.error('Error checking existing wallet connection:', error);
      }
    };

    checkExistingConnections();

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [onWalletConnect]);

  return (
    <>
      {!walletAddress ? (
        <WalletSelector onWalletConnect={handleWalletConnect} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connected
            </CardTitle>
            <CardDescription>
              Your {connectedWalletType} wallet is connected and ready for TEE operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">{connectedWalletType} Connected</p>
                  <p className="text-green-600 text-sm font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <p>✅ ethers.js BrowserProvider initialized</p>
                <p>✅ Ready for iExec TEE integration</p>
              </div>
              
              <Button 
                onClick={disconnectWallet}
                variant="outline" 
                className="w-full"
              >
                Disconnect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

declare global {
  interface Window {
    ethereum?: any;
    phantom?: any;
    solana?: any;
  }
}
