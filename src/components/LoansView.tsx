import React, { useState } from 'react';
import { LoanData } from '../types/banking';
import { INITIAL_LOANS } from '../data/bankingExtensions';
import { Landmark, Calculator, FileCheck, CheckCircle2, ChevronRight, Download, Percent, Calendar, ShieldCheck, Sparkles, Building2, Printer } from 'lucide-react';

interface LoansViewProps {
  onAttemptDebitAction: () => void;
  userName: string;
}

export const LoansView: React.FC<LoansViewProps> = ({ onAttemptDebitAction, userName }) => {
  const [loans] = useState<LoanData[]>(INITIAL_LOANS);

  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState<number>(2500000); // 25 Lakhs
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(10.49);
  const [showSanctionLetter, setShowSanctionLetter] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  // Calculate EMI
  const calculateEmi = (p: number, r: number, tYears: number) => {
    const monthlyRate = r / (12 * 100);
    const months = tYears * 12;
    const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const emi = calculateEmi(loanAmount, interestRate, tenureYears);
  const totalMonths = tenureYears * 12;
  const totalPayable = emi * totalMonths;
  const totalInterest = totalPayable - loanAmount;

  const handleApplyInstant = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setShowSanctionLetter(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-[#8C1D24]" />
            <span>Loans & Borrowing Portal</span>
          </h2>
          <p className="text-xs text-slate-500">
            Pre-Approved Wealth Credit Line & Active Loan Accounts for {userName}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Credit Score: 812 (Excellent)</span>
          </span>
        </div>
      </div>

      {/* Pre-Approved Instant Loan Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#8C1D24] via-[#6e161c] to-stone-900 text-white shadow-xl border border-amber-400/30">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              Special Wealth Privilege Offer
            </span>
            <span className="text-xs text-stone-300">Pre-Approved for {userName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
            <div>
              <p className="text-xs text-stone-300 uppercase tracking-wide">
                Instant Sanction Amount
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mt-0.5">
                ₹25,00,000
              </h3>
              <p className="text-xs text-amber-200 mt-1 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Special 10.49% p.a. • Zero Documentation • Disbursal in 3 Seconds</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleApplyInstant}
                disabled={isApplying}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                {isApplying ? (
                  <span>Generating Sanction...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>View Sanction Letter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Active Loans */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span>Active Borrowing Accounts</span>
          <span className="text-xs font-normal text-slate-500">(1 Account)</span>
        </h3>

        {loans.filter(l => l.status === 'ACTIVE').map(loan => (
          <div
            key={loan.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{loan.loanType}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded">
                    {loan.accountNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Primary Borrower: <strong className="text-slate-800">{loan.borrowerName}</strong>
                </p>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-xs text-slate-400 block">Sanctioned Amount</span>
                <span className="text-sm font-black text-slate-800">
                  ₹{loan.sanctionedAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Outstanding Principal</span>
                <span className="font-black text-slate-900 text-base">
                  ₹{loan.outstandingBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Monthly EMI</span>
                <span className="font-black text-[#8C1D24] text-base">
                  ₹{loan.monthlyEmi.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Interest Rate</span>
                <span className="font-bold text-slate-800 text-base">{loan.interestRate}% p.a.</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Next Due Date</span>
                <span className="font-bold text-emerald-700 text-base">{loan.nextEmiDate}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">
                Auto-Debit: A/C 000401589412 • Remaining Tenure: {loan.remainingTenureMonths} months
              </span>
              <button
                onClick={() => alert(`IT Tax Certificate for FY 2026-27 (Principal under 80C: ₹1,50,000, Interest under 24b: ₹2,00,000) downloaded for Loan A/C ${loan.accountNumber}.`)}
                className="text-[#8C1D24] hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download IT Tax Certificate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive EMI Calculator */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#8C1D24]" />
            <span>Smart EMI & Repayment Calculator</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-Time Estimator</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sliders */}
          <div className="lg:col-span-7 space-y-5 text-xs">
            {/* Amount Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-slate-700">Loan Amount</span>
                <span className="font-mono font-black text-sm text-[#8C1D24]">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={5000000}
                step={50000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-[#8C1D24] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>₹1 Lakh</span>
                <span>₹25 Lakhs</span>
                <span>₹50 Lakhs</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-slate-700">Tenure (Years)</span>
                <span className="font-mono font-black text-sm text-slate-900">
                  {tenureYears} Years ({tenureYears * 12} Months)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#8C1D24] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>1 Year</span>
                <span>4 Years</span>
                <span>7 Years</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-slate-700">Interest Rate (% p.a.)</span>
                <span className="font-mono font-black text-sm text-slate-900">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={8.5}
                max={16.0}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#8C1D24] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>8.5% (Prime)</span>
                <span>10.5% (Pre-Approved)</span>
                <span>16.0%</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs text-slate-500 font-medium">Calculated Monthly EMI</span>
              <p className="text-2xl sm:text-3xl font-black text-[#8C1D24] mt-0.5">
                ₹{emi.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-500"> / month</span>
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Principal Amount:</span>
                <span className="font-bold text-slate-900">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Interest Payable:</span>
                <span className="font-bold text-amber-700">₹{totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-bold border-t border-dashed border-slate-200 pt-2">
                <span>Total Repayment Amount:</span>
                <span className="text-[#8C1D24] font-black">₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSanctionLetter(true)}
              className="w-full py-2.5 rounded-xl bg-[#8C1D24] hover:bg-[#6e161c] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Generate Sanction for this Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Sanction Letter Modal */}
      {showSanctionLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-300 space-y-6 my-auto text-slate-900">
            {/* Bank Header */}
            <div className="flex justify-between items-start border-b-2 border-[#8C1D24] pb-4">
              <div>
                <h3 className="text-xl font-black text-[#8C1D24] font-serif tracking-wider">
                  ICICI BANK LIMITED
                </h3>
                <p className="text-[11px] text-slate-500">
                  Retail Assets & Wealth Lending Division • Connaught Place, New Delhi
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Ref No: ICICI/DEL/PL/2026/099412 • Date: 22 Oct 2026
                </p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  Sanction Approved
                </span>
              </div>
            </div>

            {/* Letter Content */}
            <div className="space-y-4 text-xs leading-relaxed">
              <p>
                To,<br />
                <strong>Mr. {userName}</strong><br />
                The Privilege Wealth Account Holder (A/C: 000401589412)<br />
                New Delhi, India
              </p>

              <p className="text-slate-700">
                Dear Mr. {userName},<br />
                We are pleased to inform you that ICICI Bank has sanctioned your <strong>Pre-Approved Personal Loan</strong> under our Super-Affluent Wealth Program based on your primary account relationship and verified inflows.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">SANCTIONED PRINCIPAL</span>
                  <span className="font-bold text-slate-900 text-sm">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">RATE OF INTEREST</span>
                  <span className="font-bold text-slate-900 text-sm">{interestRate}% p.a.</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">MONTHLY EMI</span>
                  <span className="font-bold text-[#8C1D24] text-sm">₹{emi.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TENURE</span>
                  <span className="font-bold text-slate-900 text-sm">{tenureYears} Years ({tenureYears * 12} Months)</span>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                <strong>Notice:</strong> Funds will be credited directly to your ICICI Bank Account ending in <strong>9412</strong>. Once the ongoing inflow compliance review is cleared, loan funds will become immediately spendable.
              </div>
            </div>

            {/* Signatures & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="text-[11px] text-slate-400">
                Digitally Authorized by Credit Sanction Committee, ICICI Bank Ltd.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setShowSanctionLetter(false)}
                  className="px-5 py-2 rounded-xl bg-[#8C1D24] hover:bg-[#6e161c] text-white font-bold text-xs"
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
