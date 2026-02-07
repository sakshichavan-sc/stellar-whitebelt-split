import { useState, useCallback } from "react";
import {
  isConnected,
  setAllowed,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
  recipient?: string;
}

export function useStellarWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [txResults, setTxResults] = useState<TransactionResult[]>([]);
  const [sending, setSending] = useState(false);

  const fetchBalance = useCallback(async (address: string) => {
    try {
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const account = await server.loadAccount(address);
      const xlmBalance = account.balances.find(
        (b: any) => b.asset_type === "native"
      );
      setBalance(xlmBalance ? xlmBalance.balance : "0");
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setBalance("0 (account not funded)");
      } else {
        setBalance("Error fetching balance");
      }
    }
  }, []);

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      const connected = await isConnected();
      if (!connected.isConnected) {
        throw new Error("Freighter extension not found. Please install Freighter wallet.");
      }
      await setAllowed();
      const addressResult = await getAddress();
      if (addressResult.error) {
        throw new Error(addressResult.error);
      }
      setPublicKey(addressResult.address);
      await fetchBalance(addressResult.address);
    } catch (err: any) {
      alert(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }, [fetchBalance]);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setBalance(null);
    setTxResults([]);
  }, []);

  const sendPayments = useCallback(
    async (recipients: string[], amount: string) => {
      if (!publicKey) return;
      setSending(true);
      setTxResults([]);
      const results: TransactionResult[] = [];

      try {
        const server = new StellarSdk.Horizon.Server(HORIZON_URL);
        const sourceAccount = await server.loadAccount(publicKey);

        for (const recipient of recipients) {
          try {
            const trimmed = recipient.trim();
            if (!trimmed) continue;

            const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
              fee: StellarSdk.BASE_FEE,
              networkPassphrase: NETWORK_PASSPHRASE,
            })
              .addOperation(
                StellarSdk.Operation.payment({
                  destination: trimmed,
                  asset: StellarSdk.Asset.native(),
                  amount: amount,
                })
              )
              .setTimeout(30)
              .build();

            const xdr = transaction.toXDR();
            const signResult = await signTransaction(xdr, {
              networkPassphrase: NETWORK_PASSPHRASE,
            });

            if (signResult.error) {
              results.push({ success: false, error: signResult.error, recipient: trimmed });
              continue;
            }

            const signedTx = StellarSdk.TransactionBuilder.fromXDR(
              signResult.signedTxXdr,
              NETWORK_PASSPHRASE
            );
            const response = await server.submitTransaction(signedTx);
            results.push({ success: true, hash: (response as any).hash, recipient: trimmed });

            // Reload account for next transaction (sequence number update)
            const updatedAccount = await server.loadAccount(publicKey);
            Object.assign(sourceAccount, updatedAccount);
          } catch (err: any) {
            results.push({
              success: false,
              error: err.message || "Transaction failed",
              recipient: recipient.trim(),
            });
          }
        }
      } catch (err: any) {
        results.push({ success: false, error: err.message || "Failed to load account" });
      }

      setTxResults(results);
      setSending(false);
      // Refresh balance after payments
      await fetchBalance(publicKey);
    },
    [publicKey, fetchBalance]
  );

  return {
    publicKey,
    balance,
    loading,
    sending,
    txResults,
    connect,
    disconnect,
    sendPayments,
    refreshBalance: () => publicKey && fetchBalance(publicKey),
  };
}
