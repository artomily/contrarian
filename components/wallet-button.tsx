"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { arbitrum } from "wagmi/chains";

const CHAIN_ID_TO_LABEL: Record<number, string> = {
  [arbitrum.id]: "Arbitrum One",
  [421614]: "Arbitrum Sepolia",
};

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [connecting, setConnecting] = useState(false);

  if (isConnected && address) {
    const chainLabel = chainId ? CHAIN_ID_TO_LABEL[chainId] || `Chain ${chainId}` : "Unknown";
    return (
      <div className="flex items-center gap-2">
        {chainId !== arbitrum.id && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs"
            onClick={() => switchChain({ chainId: arbitrum.id })}
          >
            Switch to Arbitrum
          </Button>
        )}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">{chainLabel}</span>
          </div>
          <div className="mx-1.5 h-4 w-px bg-border" />
          <span className="font-mono text-xs text-foreground">{truncateAddress(address)}</span>
          <button
            onClick={() => disconnect()}
            className="ml-1 rounded p-0.5 text-muted-foreground hover:text-destructive transition-colors"
            title="Disconnect"
          >
            <LogOut className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  const injectedConnector = connectors.find((c) => c.type === "injected");
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={connecting || !injectedConnector}
      onClick={async () => {
        if (!injectedConnector) return;
        setConnecting(true);
        try {
          connect({ connector: injectedConnector });
        } catch (e) {
          console.error(e);
        }
        setConnecting(false);
      }}
      className="h-9 gap-2 border-border bg-card hover:bg-accent"
    >
      <Wallet className="h-4 w-4" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
