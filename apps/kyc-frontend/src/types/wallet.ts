import { BrowserProvider, JsonRpcSigner } from 'ethers';

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  walletType: string;
  provider?: BrowserProvider;
  signer?: JsonRpcSigner;
}

export interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnected: boolean;
} 