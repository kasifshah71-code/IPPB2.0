export interface Transaction {
  id: string;
  date: string; // e.g. "21 Oct 2026, 2:12 PM"
  timestamp: number;
  type: 'debit' | 'credit';
  title: string;
  recipientOrSender: string;
  recipientUpiId?: string;
  amount: number;
  upiTxnId: string;
  note: string;
  account: string;
  utrNo?: string;
  mode?: 'UPI' | 'IMPS' | 'NEFT' | 'RTGS' | 'iMobile';
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

export type TabType = 'home' | 'cards' | 'loans' | 'deposits' | 'bills' | 'services';

export interface CreditCardData {
  id: string;
  cardName: string;
  cardType: string;
  cardNumberMasked: string;
  cardNumberFull: string;
  holderName: string;
  expiry: string;
  cvv: string;
  creditLimit: number;
  availableLimit: number;
  unbilledSpends: number;
  rewardPoints: number;
  rewardsValue: number;
  dueDate: string;
  minAmountDue: number;
  isDomesticEnabled: boolean;
  isInternationalEnabled: boolean;
  isContactlessEnabled: boolean;
  isCardFrozen: boolean;
  cardColor: string;
}

export interface LoanData {
  id: string;
  loanType: string;
  accountNumber: string;
  borrowerName: string;
  sanctionedAmount: number;
  outstandingBalance: number;
  interestRate: number;
  monthlyEmi: number;
  tenureMonths: number;
  remainingTenureMonths: number;
  nextEmiDate: string;
  status: 'ACTIVE' | 'PRE_APPROVED';
}

export interface FixedDepositData {
  id: string;
  accountNumber: string;
  holderName: string;
  principalAmount: number;
  interestRate: number;
  maturityAmount: number;
  startDate: string;
  maturityDate: string;
  type: 'CUMULATIVE' | 'MONTHLY_PAYOUT' | 'TAX_SAVER';
  status: 'ACTIVE';
}

export interface UtilityBiller {
  id: string;
  category: 'electricity' | 'mobile' | 'fastag' | 'dth' | 'gas' | 'broadband';
  billerName: string;
  sampleConsumerNumber: string;
  dueAmount: number;
  dueDate: string;
  billPeriod: string;
  consumerName: string;
}

