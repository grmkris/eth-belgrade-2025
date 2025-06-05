"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { WalletProvider } from "@/lib/WalletProvider";

export function Providers({ 
  children, 
  cookies 
}: { 
  children: React.ReactNode;
  cookies: string | null;
}) {
  return (
    <WalletProvider cookies={cookies}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        // enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </WalletProvider>
  );
} 
