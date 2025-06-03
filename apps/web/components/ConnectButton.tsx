"use client";

import { Button } from "@workspace/ui/components/button";
import { WalletIcon, LogOutIcon } from "lucide-react";
import { motion } from "motion/react";
import { useWallet } from "@/hooks/useWallet";

export default function ConnectButton() {
	const { isConnected, address, formattedAddress, formattedBalance, disconnect } = useWallet();

	if (isConnected && address) {
		return (
			<div className="flex items-center gap-3">
				{/* Balance Display */}
				<div className="hidden md:flex flex-col items-end text-sm">
					<span className="text-gray-600">Balance</span>
					<span className="font-medium">{formattedBalance}</span>
				</div>

				{/* Address Display */}
				<div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
					<WalletIcon className="w-4 h-4 text-green-600" />
					<span className="text-sm font-medium">{formattedAddress}</span>
				</div>

				{/* Disconnect Button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => disconnect()}
					className="rounded-full"
				>
					<LogOutIcon className="w-4 h-4" />
				</Button>
			</div>
		);
	}

	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<appkit-button />
		</motion.div>
	);
} 