export interface Transaction {
  id: string;
  date: string; // e.g. "21 Oct 2026, 2:12 PM"
  timestamp: number;
  type: 'debit' | 'credit';
  title: string; // e.g. "Paid to DURGA GOPAL DHAKARE" or "Received from PAWAN PRAJAPATI"
  recipientOrSender: string;
  recipientUpiId?: string;
  amount: number;
  upiTxnId: string;
  note: string;
  account: string; // e.g. "India Post Payments Bank - 8231"
  utrNo?: string;
  mode?: 'UPI' | 'IMPS' | 'NEFT' | 'IPPB';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  category?: string;
}

export interface UserAccount {
  name: string;
  mobile: string;
  accountNumber: string;
  maskedAccountNumber: string;
  ifsc: string;
  cif: string;
  accountType: string;
  branch: string;
  upiId: string;
  secondaryUpiId: string;
  balance: number;
  currency: string;
}

export type TransferType = 'bank' | 'upi' | 'ippb';

export interface TransferPayload {
  transferType: TransferType;
  recipientName: string;
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  upiId?: string;
  amount: number;
  remark: string;
  mode: 'IMPS' | 'NEFT' | 'UPI';
}
