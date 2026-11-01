import React, { useState } from 'react';
import { X, Building, Send, ArrowRight, ShieldAlert, AlertTriangle, AlertOctagon, PhoneCall, Building2, Lock, ArrowLeft } from 'lucide-react';
import { UserAccount, Transaction, TransferType } from '../types/banking';
import { QUICK_BENEFICIARIES, POPULAR_BANKS } from '../data/initialData';
import { playKeypadClick, playErrorBeep } from '../utils/audio';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  defaultType?: TransferType;
  onTransferComplete: (newTxn: Transaction, newBalance: number) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  user,
  defaultType = 'bank',
}) => {
  const [transferType, setTransferType] = useState<TransferType>(defaultType);
  const [step, setStep] = useState<'form' | 'confirm' | 'mpin' | 'frozen'>('form');

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccount, setConfirmAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [remark, setRemark] = useState('');
  const [mode, setMode] = useState<'IMPS' | 'RTGS' | 'NEFT' | 'UPI'>('IMPS');

  // MPIN State
  const [enteredMpin, setEnteredMpin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSelectBeneficiary = (b: typeof QUICK_BENEFICIARIES[0]) => {
    setRecipientName(b.name);
    setAccountNumber(b.accountNumber);
    setConfirmAccount(b.accountNumber);
    setIfsc(b.ifsc);
    setBankName(b.bankName);
    setUpiId(b.upiId);
  };

  const handleSelectBank = (b: typeof POPULAR_BANKS[0]) => {
    setBankName(b.name);
    if (!ifsc) {
      setIfsc(b.ifscPrefix + '001');
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const isFormValid = () => {
    if (numAmount <= 0) return false;
    if (!recipientName.trim()) return false;

    if (transferType === 'bank') {
      if (!accountNumber || accountNumber.length < 8) return false;
      if (accountNumber !== confirmAccount) return false;
      if (!ifsc || ifsc.length < 6) return false;
    } else if (transferType === 'upi') {
      if (!upiId || !upiId.includes('@')) return false;
    }
    return true;
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setStep('confirm');
  };

  const handleProceedToMpin = () => {
    setEnteredMpin('');
    setStep('mpin');
  };

  const handleMpinDigit = (digit: string) => {
    if (enteredMpin.length < 4) {
      playKeypadClick();
      const newPin = enteredMpin + digit;
      setEnteredMpin(newPin);

      if (newPin.length === 4) {
        verifyMpinAndTriggerFreeze();
      }
    }
  };

  const handleMpinDelete = () => {
    playKeypadClick();
    setEnteredMpin((prev) => prev.slice(0, -1));
  };

  // When user attempts to finalize the payment, trigger the FREEZE & BLOCKED screen
  const verifyMpinAndTriggerFreeze = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      playErrorBeep();
      setStep('frozen');
    }, 900);
  };

  const triggerDirectFreeze = () => {
    playErrorBeep();
    setStep('frozen');
  };

  const handleCloseModal = () => {
    setStep('form');
    setEnteredMpin('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="bg-[#8C1D24] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F37021] to-amber-400 text-white font-serif italic text-lg font-black flex items-center justify-center shadow-sm">
              i
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                iMobile Fund Transfer
              </h3>
              <p className="text-[11px] text-orange-200">
                From: {user.name} • ICICI - 9412 (Bal: ₹{user.balance.toLocaleString('en-IN')})
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= STEP: FROZEN & BLOCKED ALERT ================= */}
        {step === 'frozen' && (
          <div className="p-6 sm:p-7 text-center space-y-5 animate-in zoom-in-95 duration-200 bg-red-50/40">
            {/* Pulsing Warning Badge */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-xl border-4 border-white z-10">
                <AlertOctagon className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-red-100 border border-red-300 text-red-800 text-[11px] font-black rounded-full uppercase tracking-wider shadow-xs mb-2">
                CRITICAL SECURITY NOTIFICATION • OUTWARD DEBIT RESTRICTED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-red-700 tracking-tight uppercase">
                Your Account Is Blocked & Frozen
              </h2>
              <p className="text-sm font-bold text-slate-800 mt-1">
                आपका खाता ब्लॉक एवं डेबIT फ्रीज कर दिया गया है
              </p>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Payment transfer cannot be processed. All outgoing debits from this account have been placed under strict bank debit freeze.
              </p>
            </div>

            {/* Official ICICI Bank Freeze Notice Box */}
            <div className="bg-white border-2 border-red-200 rounded-2xl p-4 sm:p-5 text-left text-xs space-y-2.5 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-red-100">
                <span className="text-slate-500 font-medium">Account Number:</span>
                <span className="font-mono font-bold text-slate-900">{user.maskedAccountNumber} ({user.name})</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-red-100">
                <span className="text-slate-500 font-medium">Account Status:</span>
                <span className="font-bold text-red-600 flex items-center gap-1 font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  TOTAL DEBIT FREEZE (ACTIVE)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-red-100">
                <span className="text-slate-500 font-medium">Attempted Transfer:</span>
                <span className="font-mono font-bold text-slate-900 line-through text-red-500">
                  ₹{numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-red-100">
                <span className="text-slate-500 font-medium">Notice Reference:</span>
                <span className="font-mono font-bold text-slate-800">ICICI-FRZ-SEC-68L-OCT26</span>
              </div>

              <div className="pt-1">
                <p className="text-[11px] text-red-700 font-semibold leading-relaxed">
                  Reason for Freeze: As per compliance and bank anti-fraud directives following high-value consecutive inflows totaling ₹68,00,000, outward transfers (IMPS, RTGS, NEFT, UPI) are temporarily disabled pending branch in-person verification.
                </p>
              </div>
            </div>

            {/* Assistance details */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-xs text-amber-900 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Next Steps for Unfreezing Account:</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Visit your home branch at <strong>ICICI Bank Connaught Place, New Delhi</strong> with valid PAN & Aadhaar to submit biometric re-verification, or speak with your Privilege Relationship Manager.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full py-3.5 rounded-2xl bg-[#8C1D24] hover:bg-[#72151b] text-white font-bold text-sm shadow-lg transition-all"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 1: TRANSFER FORM ================= */}
        {step === 'form' && (
          <form onSubmit={handleProceedToConfirm} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Warning banner of freeze */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between text-xs text-red-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-semibold">Security Alert: Debit restriction review active on this account</span>
              </div>
              <button
                type="button"
                onClick={triggerDirectFreeze}
                className="text-[11px] text-red-700 font-bold underline shrink-0 ml-1"
              >
                View Status
              </button>
            </div>

            {/* Transfer Type Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setTransferType('bank')}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  transferType === 'bank'
                    ? 'bg-white text-[#8C1D24] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>To Other Bank Account</span>
              </button>
              <button
                type="button"
                onClick={() => setTransferType('upi')}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  transferType === 'upi'
                    ? 'bg-white text-[#8C1D24] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>To UPI ID / VPA</span>
              </button>
            </div>

            {/* Quick Beneficiaries Strip */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Favorite Beneficiaries:</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_BENEFICIARIES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBeneficiary(b)}
                    className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition-all"
                  >
                    <div className={`w-7 h-7 rounded-full ${b.avatarBg} text-white text-[10px] font-bold flex items-center justify-center`}>
                      {b.initials}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{b.name}</p>
                      <p className="text-[10px] text-slate-400">{b.bankName.split(' ')[0]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields for Bank Transfer */}
            {transferType === 'bank' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Beneficiary Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SURESH KUMAR BHAWAR LAL"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F37021] text-sm font-medium uppercase"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 38192019482"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F37021] text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Re-enter Account Number"
                      value={confirmAccount}
                      onChange={(e) => setConfirmAccount(e.target.value.replace(/\D/g, ''))}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:ring-2 ${
                        confirmAccount && confirmAccount !== accountNumber
                          ? 'border-red-400 focus:ring-red-400 bg-red-50'
                          : 'border-slate-300 focus:ring-[#F37021]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Bank IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">11 characters (e.g. HDFC0000240)</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SBIN0001234 or HDFC0000240"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F37021] text-sm font-mono uppercase"
                  />
                </div>

                {/* Popular Bank Chips */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                    Select Common Bank:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_BANKS.slice(0, 6).map((b) => (
                      <button
                        key={b.code}
                        type="button"
                        onClick={() => handleSelectBank(b)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          bankName === b.name
                            ? 'bg-[#8C1D24] text-white border-[#8C1D24]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Fields for UPI Transfer */}
            {transferType === 'upi' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Beneficiary Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SURESH KUMAR"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F37021] text-sm uppercase font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    UPI ID / VPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. recipient@okhdfcbank or 9876543210@icici"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value.toLowerCase().trim())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F37021] text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports Google Pay, PhonePe, Paytm, BHIM, iMobile, and all Bank UPIs
                  </p>
                </div>
              </div>
            )}

            {/* Amount Section */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount to Transfer (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#F37021] text-2xl font-black text-slate-900 font-mono outline-none"
                />
              </div>

              {/* Quick Amount Suggestion Chips */}
              <div className="flex gap-2 mt-2">
                {[25000, 50000, 100000, 500000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="flex-1 text-xs py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors font-mono"
                  >
                    +₹{val >= 100000 ? `${val / 100000}L` : `${val / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* Remark / Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Remark / Purpose of Payment (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Investment, Business, Rent, Invoice"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F37021] text-sm"
              />
            </div>

            {/* Mode selection & charges */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Mode:</span>
                <div className="flex gap-1">
                  {(['IMPS', 'RTGS', 'UPI', 'NEFT'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        mode === m ? 'bg-[#8C1D24] text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Privilege Transfer:</span>{' '}
                <strong className="text-emerald-700 font-bold">₹0.00 (Zero Fee)</strong>
              </div>
            </div>

            {/* Proceed button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                  isFormValid()
                    ? 'bg-[#8C1D24] hover:bg-[#72151b] text-white active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 2: CONFIRMATION REVIEW ================= */}
        {step === 'confirm' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="text-center py-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Transfer Amount
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-1">
                ₹{numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
              <span className="inline-block mt-1 text-[11px] bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full">
                Security Verification Required
              </span>
            </div>

            {/* Transfer breakdown card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                <span className="text-slate-500">Debited From:</span>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    ICICI Bank - 9412
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                <span className="text-slate-500">Credited To:</span>
                <div className="text-right">
                  <p className="font-bold text-slate-900 uppercase">{recipientName}</p>
                  {transferType === 'bank' ? (
                    <>
                      <p className="text-slate-600 font-mono text-[11px]">
                        A/C: {accountNumber}
                      </p>
                      <p className="text-slate-400 font-mono text-[10px]">
                        IFSC: {ifsc} {bankName ? `(${bankName})` : ''}
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-600 font-mono text-[11px]">{upiId}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Transfer Mode:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {mode}
                </span>
              </div>

              {remark && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Remark:</span>
                  <span className="font-medium text-slate-700 italic">"{remark}"</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleProceedToMpin}
                className="w-2/3 py-3 rounded-xl bg-[#8C1D24] hover:bg-[#72151b] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-orange-300" />
                <span>Verify MPIN & Pay</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: MPIN VERIFICATION ================= */}
        {step === 'mpin' && (
          <div className="p-5 sm:p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#8C1D24] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900">Enter iMobile MPIN</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorizing outward transfer of <strong className="text-slate-800 font-mono">₹{numAmount.toLocaleString('en-IN')}</strong> to {recipientName}
              </p>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center items-center gap-4 my-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all ${
                    enteredMpin.length > idx
                      ? 'bg-[#8C1D24] scale-110 shadow'
                      : 'border-2 border-slate-300 bg-slate-100'
                  }`}
                />
              ))}
            </div>

            {isProcessing ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-600 text-sm">
                <div className="w-6 h-6 border-2 border-[#8C1D24] border-t-transparent rounded-full animate-spin" />
                <span className="font-medium text-slate-700">Connecting to Core Banking Engine...</span>
              </div>
            ) : (
              <>
                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleMpinDigit(digit)}
                      className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 font-bold text-lg text-slate-800 shadow-sm transition-all"
                    >
                      {digit}
                    </button>
                  ))}
                  <div className="h-12 flex items-center justify-center text-slate-300">
                    •
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMpinDigit('0')}
                    className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 font-bold text-lg text-slate-800 shadow-sm"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleMpinDelete}
                    className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 font-bold text-sm text-slate-600 shadow-sm"
                  >
                    ⌫
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('confirm')}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel Transaction
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
