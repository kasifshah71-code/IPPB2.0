import React, { useState } from 'react';
import { UserAccount } from '../types/banking';
import { ShieldAlert, BookOpen, FileText, UserCheck, Lock, CheckCircle2, Building2, Calendar, PhoneCall, AlertTriangle, ArrowRight, Printer } from 'lucide-react';

interface ServicesViewProps {
  user: UserAccount;
  onAttemptDebitAction: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ user, onAttemptDebitAction }) => {
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [appointmentBooked, setAppointmentBooked] = useState<boolean>(false);
  const [selectedChequeLeaves, setSelectedChequeLeaves] = useState<number>(25);
  const [chequeOrdered, setChequeOrdered] = useState<boolean>(false);
  const [viewingCertificate, setViewingCertificate] = useState<string | null>(null);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentBooked(true);
    setSuccessNotice('In-person verification appointment scheduled at ICICI Connaught Place branch for 03 Nov 2026 at 11:30 AM.');
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const handleOrderCheque = () => {
    setChequeOrdered(true);
    setSuccessNotice(`Personalized Cheque Book (${selectedChequeLeaves} leaves) dispatched via BlueDart to registered New Delhi address.`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {successNotice && (
        <div className="bg-emerald-600 text-white p-3 rounded-2xl flex items-center gap-2 shadow-lg text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#8C1D24]" />
            <span>Customer Service & Compliance Center</span>
          </h2>
          <p className="text-xs text-slate-500">
            Official Case File, Branch Services, Tax Certificates & Nominee for {user.name}
          </p>
        </div>
        <div className="text-xs font-mono font-bold bg-red-100 text-red-900 px-3 py-1 rounded-full border border-red-200">
          Case: ICICI-FRZ-SEC-68L
        </div>
      </div>

      {/* Official Account Freeze & Regulatory Dossier Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-red-500/30 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 animate-pulse">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-extrabold text-red-900 text-base">
                Account Status: Regulatory Debit Freeze
              </h3>
              <span className="text-xs font-mono font-bold bg-red-600 text-white px-2.5 py-0.5 rounded-md">
                SECTION 131 PMLA AUDIT
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Privilege Wealth Account <strong>{user.accountNumber}</strong> belonging to <strong>{user.name}</strong> has been placed under temporary outward debit restriction following rapid cumulative credits of <strong>₹68,00,000.00</strong> between 17 October 2026 and 22 October 2026.
            </p>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Case Officer</span>
            <span className="font-bold text-slate-900">Mr. R. K. Singhal (Chief Compliance Officer)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Branch</span>
            <span className="font-bold text-slate-900">Connaught Place, New Delhi (IFSC: ICIC0000004)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Inflow Volume Audited</span>
            <span className="font-mono font-bold text-red-900">₹68,00,000 (10 Credit Transactions)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Remedy Action</span>
            <span className="font-bold text-slate-900">In-Person KYC Re-verification & Source Declaration</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            For priority assistance, contact your Wealth Relationship Manager: <strong>1800 1080</strong>
          </p>
          <button
            onClick={() => {
              if (appointmentBooked) {
                alert('Appointment already scheduled for 03 Nov 2026 at Connaught Place branch.');
              } else {
                handleBookAppointment({ preventDefault: () => {} } as React.FormEvent);
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{appointmentBooked ? 'Appointment Confirmed (03 Nov)' : 'Book Priority Branch Visit'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Bank Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cheque Book Service */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8C1D24]" />
            <span>Cheque Book Services</span>
          </h4>
          <p className="text-xs text-slate-500">
            Personalized CTS-2010 High-Security Cheque Book printed with name <strong>{user.name}</strong>.
          </p>

          <div className="flex gap-3">
            {[25, 50].map((leaves) => (
              <button
                key={leaves}
                onClick={() => setSelectedChequeLeaves(leaves)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedChequeLeaves === leaves
                    ? 'border-[#8C1D24] bg-red-50 text-[#8C1D24]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {leaves} Leaves Book
              </button>
            ))}
          </div>

          <button
            onClick={handleOrderCheque}
            disabled={chequeOrdered}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            {chequeOrdered ? 'Cheque Book Dispatched' : `Request ${selectedChequeLeaves} Leaves Cheque Book`}
          </button>
        </div>

        {/* Nominee Details */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Registered Nominee (DA-1)</span>
          </h4>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Nominee Name:</span>
              <span className="font-bold text-slate-900">SHABANA SHAH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Relationship:</span>
              <span className="font-bold text-slate-900">Spouse</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Share Allocation:</span>
              <span className="font-bold text-emerald-700">100.00%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nomination Status:</span>
              <span className="font-bold text-slate-900">Active & Registered</span>
            </div>
          </div>
          <button
            onClick={() => alert('Nominee modification request submitted to Connaught Place branch for verification.')}
            className="text-xs text-[#8C1D24] font-bold hover:underline"
          >
            Update Nominee Details →
          </button>
        </div>
      </div>

      {/* Tax & Financial Certificates */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#8C1D24]" />
          <span>Official Certificates & Form 16A</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => setViewingCertificate('TDS')}
            className="p-3 rounded-2xl border border-slate-200 hover:border-[#8C1D24] hover:bg-red-50/30 text-left transition-all"
          >
            <span className="font-bold text-slate-900 block">Form 16A (TDS Certificate)</span>
            <span className="text-[11px] text-slate-500">Quarter 2 (Jul - Sep 2026)</span>
            <span className="text-[11px] font-bold text-[#8C1D24] mt-1 block">View & Print →</span>
          </button>

          <button
            onClick={() => setViewingCertificate('BALANCE')}
            className="p-3 rounded-2xl border border-slate-200 hover:border-[#8C1D24] hover:bg-red-50/30 text-left transition-all"
          >
            <span className="font-bold text-slate-900 block">Balance Confirmation Letter</span>
            <span className="text-[11px] text-slate-500">As on 22 Oct 2026 (₹68,00,000)</span>
            <span className="text-[11px] font-bold text-[#8C1D24] mt-1 block">View & Print →</span>
          </button>

          <button
            onClick={() => setViewingCertificate('INTEREST')}
            className="p-3 rounded-2xl border border-slate-200 hover:border-[#8C1D24] hover:bg-red-50/30 text-left transition-all"
          >
            <span className="font-bold text-slate-900 block">Interest Certificate FY26</span>
            <span className="text-[11px] text-slate-500">Savings & Term Deposits</span>
            <span className="text-[11px] font-bold text-[#8C1D24] mt-1 block">View & Print →</span>
          </button>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-serif font-black text-lg text-[#8C1D24]">ICICI BANK LIMITED</h3>
                <p className="text-[10px] text-slate-500">Connaught Place Branch, New Delhi (ICIC0000004)</p>
              </div>
              <button
                onClick={() => setViewingCertificate(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-[11px] bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="font-sans font-bold text-slate-900 text-sm">
                {viewingCertificate === 'BALANCE' && 'CERTIFICATE OF ACCOUNT BALANCE'}
                {viewingCertificate === 'TDS' && 'FORM 16A - CERTIFICATE OF TAX DEDUCTED AT SOURCE'}
                {viewingCertificate === 'INTEREST' && 'ANNUAL INTEREST ACCRUAL CERTIFICATE (FY 2026-27)'}
              </p>
              <p>Account Holder: <strong>{user.name}</strong></p>
              <p>Account Number: <strong>{user.accountNumber}</strong></p>
              <p>Effective Balance: <strong className="text-emerald-700">₹68,00,000.00</strong></p>
              <p>Period Covered: <strong>17 Oct 2026 – 22 Oct 2026</strong></p>
              <p className="text-slate-500 font-sans text-[10px] pt-2 border-t border-slate-200">
                This is a computer-generated bank certificate verified against CBS database records and does not require a physical signature.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setViewingCertificate(null)}
                className="px-4 py-2 rounded-xl bg-[#8C1D24] text-white font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
