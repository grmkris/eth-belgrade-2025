import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useMemo } from "react";

export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });
  const { disconnect } = useDisconnect();

  const formattedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const formattedBalance = useMemo(() => {
    if (!balance) return "0.0000 ETH";
    return `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`;
  }, [balance]);

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    balance,
    isBalanceLoading,
    formattedAddress,
    formattedBalance,
    disconnect,
  };
} 