import logo from "@/assets/logo.png";
import { WalletInfo } from "@/components/WalletInfo";
import { BillSplitter } from "@/components/BillSplitter";
import { useStellarWallet } from "@/hooks/useStellarWallet";

const Index = () => {
  const wallet = useStellarWallet();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <img src={logo} alt="StellarSplit" className="mx-auto h-20 mb-2" />
          <p className="text-sm text-muted-foreground">
            Split bills & pay friends on Stellar Testnet
          </p>
        </div>

        {/* Wallet */}
        <div className="mb-6">
          <WalletInfo
            publicKey={wallet.publicKey}
            balance={wallet.balance}
            loading={wallet.loading}
            onConnect={wallet.connect}
            onDisconnect={wallet.disconnect}
            onRefresh={wallet.refreshBalance}
          />
        </div>

        {/* Bill Splitter */}
        <BillSplitter
          connected={!!wallet.publicKey}
          sending={wallet.sending}
          txResults={wallet.txResults}
          onSendPayments={wallet.sendPayments}
        />

      </div>
    </div>
  );
};

export default Index;
