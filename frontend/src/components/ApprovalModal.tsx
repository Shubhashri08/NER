import React from 'react';
import { Button } from './ui/button';
import { ShieldCheck, X, AlertOctagon } from 'lucide-react';
import { ROLE_DEFINITIONS } from './Navbar';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  role: string;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  role,
}) => {
  if (!isOpen) return null;

  const roleInfo = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.ROLE_DISTRICT_AUTH;
  const canApprove = roleInfo.canApprove;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-300 font-sans">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)] p-6 shadow-2xl text-[var(--color-dark-ink)] animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--color-dark-muted)] hover:text-[var(--color-dark-ink)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 border-b border-[var(--color-dark-rule)] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)] text-[var(--color-dark-ink)]">
            {canApprove ? <ShieldCheck className="w-5 h-5 text-[#2E7D32]" /> : <AlertOctagon className="w-5 h-5 text-[#EF4444]" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-dark-ink)] uppercase font-sans">
              {canApprove ? "Official Executive Re-route Authorization" : "Executive Authorization Required"}
            </h3>
            <p className="font-mono text-[10px] text-[var(--color-dark-muted)]">
              Sovereign Directives &bull; Cryptographic Audit Ledger
            </p>
          </div>
        </div>

        <div className="py-4 space-y-3 text-xs text-[var(--color-dark-muted)] leading-relaxed">
          <p>
            You are reviewing the dynamic rerouting of <strong className="text-[var(--color-dark-ink)]">Mission MSN-NER-2026-001 (Brahmaputra Tactical 01)</strong> via the BRO Old Mahur-Jatinga Mountain Bypass.
          </p>

          <div className="rounded-xl bg-[var(--color-dark-paper)] p-3.5 border border-[var(--color-dark-rule)] space-y-2 font-mono text-[11px] text-[var(--color-dark-ink)]">
            <div><span className="text-[var(--color-dark-muted)]">Target Destination:</span> Harangajao Valley (Pop: 3,680)</div>
            <div>
              <span className="text-[var(--color-dark-muted)]">Active Persona:</span>{' '}
              <span className="font-bold text-[#B8DEC8]">{roleInfo.name}</span>
            </div>
            <div>
              <span className="text-[var(--color-dark-muted)]">Authority Status:</span>{' '}
              {canApprove ? (
                <span className="text-[#2E7D32] font-bold">SOVEREIGN DISPATCH PERMITTED</span>
              ) : (
                <span className="text-[#EF4444] font-bold">AUTHORITY INSUFFICIENT</span>
              )}
            </div>
            <div><span className="text-[var(--color-dark-muted)]">Delivery Margin:</span> <span className="text-[#2E7D32] font-bold">+2.1h before water zero-point</span></div>
          </div>

          <p className="text-[10px] text-[var(--color-dark-muted)] font-mono italic">
            This authorization is cryptographically hashed with SHA-256 and committed to the immutable government audit ledger.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-dark-rule)]">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-full font-mono text-xs">
            CANCEL
          </Button>
          {canApprove ? (
            <Button size="sm" onClick={onConfirm} className="rounded-full font-mono text-xs font-bold bg-[#B8DEC8] text-[var(--color-dark-paper)]">
              SIGN & TRANSMIT ORDER &rarr;
            </Button>
          ) : (
            <Button size="sm" disabled variant="outline" className="opacity-50 rounded-full font-mono text-xs">
              SWITCH TO DISTRICT AUTH
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
