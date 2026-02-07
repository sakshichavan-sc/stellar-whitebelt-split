import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, LogOut, RefreshCw } from "lucide-react";

interface WalletInfoProps {
  publicKey: string | null;
  balance: string | null;
  loading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
}

export function WalletInfo({
  publicKey,
  balance,
  loading,
  onConnect,
  onDisconnect,
  onRefresh,
}: WalletInfoProps) {
  if (!publicKey) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6 text-center">
          <Wallet className="mx-auto mb-4 h-12 w-12 text-primary" />
          <p className="mb-4 text-muted-foreground">
            Connect your Freighter wallet to get started
          </p>
          <Button onClick={onConnect} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? "Connecting..." : "Connect Wallet"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const shortKey = `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}`;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-accent">Connected</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onDisconnect} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4 mr-1" /> Disconnect
          </Button>
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-xs text-muted-foreground">Address</span>
            <p className="font-mono text-sm text-foreground">{shortKey}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Balance</span>
              <p className="text-2xl font-bold text-foreground">{balance ?? "—"} <span className="text-sm text-muted-foreground">XLM</span></p>
            </div>
            <Button variant="ghost" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
