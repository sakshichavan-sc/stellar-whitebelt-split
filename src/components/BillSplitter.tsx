import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Send } from "lucide-react";
import type { TransactionResult } from "@/hooks/useStellarWallet";

interface BillSplitterProps {
  connected: boolean;
  sending: boolean;
  txResults: TransactionResult[];
  onSendPayments: (recipients: string[], amount: string) => void;
}

export function BillSplitter({ connected, sending, txResults, onSendPayments }: BillSplitterProps) {
  const [totalAmount, setTotalAmount] = useState("");
  const [recipients, setRecipients] = useState<string[]>([""]);

  const perPerson = totalAmount && recipients.length > 0
    ? (parseFloat(totalAmount) / recipients.length).toFixed(7)
    : "0";

  const addRecipient = () => setRecipients([...recipients, ""]);
  const removeRecipient = (i: number) => setRecipients(recipients.filter((_, idx) => idx !== i));
  const updateRecipient = (i: number, value: string) => {
    const updated = [...recipients];
    updated[i] = value;
    setRecipients(updated);
  };

  const handlePay = () => {
    const validRecipients = recipients.filter((r) => r.trim().length > 0);
    if (validRecipients.length === 0 || !totalAmount || parseFloat(totalAmount) <= 0) return;
    onSendPayments(validRecipients, perPerson);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Split a Bill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Total Amount (XLM)</Label>
            <Input
              type="number"
              placeholder="e.g. 100"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div>
            <Label className="text-muted-foreground">Recipient Addresses</Label>
            <div className="space-y-2 mt-2">
              {recipients.map((addr, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder={`Stellar address ${i + 1} (G...)`}
                    value={addr}
                    onChange={(e) => updateRecipient(i, e.target.value)}
                    className="bg-secondary border-border text-foreground font-mono text-xs"
                  />
                  {recipients.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeRecipient(i)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addRecipient} className="mt-2 border-border text-muted-foreground">
              <Plus className="h-4 w-4 mr-1" /> Add Recipient
            </Button>
          </div>

          {totalAmount && parseFloat(totalAmount) > 0 && (
            <div className="rounded-lg bg-secondary p-4 text-center">
              <p className="text-sm text-muted-foreground">Each person pays</p>
              <p className="text-3xl font-bold text-primary">{perPerson} <span className="text-sm">XLM</span></p>
              <p className="text-xs text-muted-foreground mt-1">
                Split between {recipients.filter(r => r.trim()).length || recipients.length} {recipients.length === 1 ? "person" : "people"}
              </p>
            </div>
          )}

          <Button
            onClick={handlePay}
            disabled={!connected || sending || !totalAmount || parseFloat(totalAmount) <= 0}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {sending ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Pay All
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction Results */}
      {txResults.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-sm">Transaction Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {txResults.map((tx, i) => (
              <div
                key={i}
                className={`rounded p-3 text-sm ${
                  tx.success ? "bg-accent/10 border border-accent/30" : "bg-destructive/10 border border-destructive/30"
                }`}
              >
                {tx.success ? (
                  <div>
                    <p className="text-accent font-medium">Payment sent!</p>
                    {tx.recipient && <p className="text-xs text-muted-foreground mt-1">To: {tx.recipient.slice(0, 8)}...{tx.recipient.slice(-8)}</p>}
                    {tx.hash && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Hash:{" "}
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          {tx.hash.slice(0, 12)}...
                        </a>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-destructive font-medium"> Transaction failed</p>
                    {tx.recipient && <p className="text-xs text-muted-foreground mt-1">To: {tx.recipient.slice(0, 8)}...{tx.recipient.slice(-8)}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{tx.error}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
