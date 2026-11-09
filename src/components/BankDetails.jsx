import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { RESTAURANT } from "../config";

export default function BankDetails() {
  const [copied, setCopied] = useState(false);
  const { bankName, accountNumber, accountName } = RESTAURANT.bank;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* copying is optional, so we ignore failures */
    }
  };

  return (
    <div className="bank">
      <div>
        <span>Bank</span>
        <strong>{bankName}</strong>
      </div>
      <div>
        <span>Account name</span>
        <strong>{accountName}</strong>
      </div>
      <div className="bank__num">
        <div>
          <span>Account number</span>
          <strong>{accountNumber}</strong>
        </div>
        <button type="button" onClick={copy}>
          {copied ? (
            <>
              <Check size={16} /> Copied
            </>
          ) : (
            <>
              <Copy size={16} /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}