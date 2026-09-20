import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, AlertTriangle, Route, ShieldCheck, Lock } from 'lucide-react';
import { ROLE_DEFINITIONS } from './Navbar';

interface ReplanningViewProps {
  onApproveClick: () => void;
  isApproved: boolean;
  approvalTime: string | null;
  approvalRole: string;
}

export const ReplanningView: React.FC<ReplanningViewProps> = ({
  onApproveClick,
  isApproved,
  approvalTime,
  approvalRole,
}) => {
  const roleInfo = ROLE_DEFINITIONS[approvalRole] || ROLE_DEFINITIONS.ROLE_DISTRICT_AUTH;
  const canApprove = roleInfo.canApprove;

  return (
    <div className="flex flex-col gap-5 font-sans">
      {/* Replan Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Severed Route */}
        <Card className="border-[#EF4444]/40 bg-[var(--color-dark-surface)]">
          <CardHeader className="pb-3 border-b border-[var(--color-dark-rule)]">
            <div className="flex items-center justify-between">
              <Badge variant="critical" className="gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                SEVERED CORRIDOR
              </Badge>
              <span className="font-mono text-[10px] text-[var(--color-dark-muted)]">MISSION MSN-NER-2026-001</span>
            </div>
            <CardTitle className="text-sm font-bold text-[var(--color-dark-ink)] mt-2">
              Original Route: NH-27 (Lumding-Haflong-Harangajao Axis)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs text-[var(--color-dark-muted)] leading-relaxed">
            <div><strong className="text-[var(--color-dark-ink)]">Origin Facility:</strong> Haflong Forward Staging Depot (Dima Hasao)</div>
            <div><strong className="text-[var(--color-dark-ink)]">Destination:</strong> Harangajao Valley (3,680 Inhabitants)</div>
            <div><strong className="text-[var(--color-dark-ink)]">Assigned Asset:</strong> Brahmaputra Tactical 01 (Heavy 4x4 4WD)</div>
            <div>
              <strong className="text-[var(--color-dark-ink)]">Obstruction:</strong>{' '}
              <span className="text-[#EF4444] font-bold">200m Active Slope Subsidence at Jatinga Gorge</span>
            </div>
            <div><strong className="text-[var(--color-dark-ink)]">NHIDCL Clearance Estimate:</strong> 72 to 96 Hours minimum</div>
          </CardContent>
        </Card>

        {/* Proposed Alternate Corridor */}
        <Card className="border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)]">
          <CardHeader className="pb-3 border-b border-[var(--color-dark-rule)]">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="gap-1.5 border border-[var(--color-dark-rule)] bg-[var(--color-dark-raised)] text-[#B8DEC8]">
                <Route className="w-3 h-3" />
                CO-PILOT PROPOSED ALTERNATE
              </Badge>
              <span className="font-mono text-xs font-bold text-[#D4AF37]">+22.9 MINS</span>
            </div>
            <CardTitle className="text-sm font-bold text-[var(--color-dark-ink)] mt-2">
              Divert: BRO Old Mahur Mountain Bypass
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-3 text-xs text-[var(--color-dark-muted)] leading-relaxed">
            <div className="grid grid-cols-2 gap-2.5 bg-[var(--color-dark-paper)] p-3 rounded-xl border border-[var(--color-dark-rule)]">
              <div>
                <span className="text-[10px] text-[var(--color-dark-muted)] block uppercase font-mono">Est. Transit Time:</span>
                <strong className="text-[var(--color-dark-ink)] font-mono text-xs font-bold">99.5 Minutes</strong>
              </div>
              <div>
                <span className="text-[10px] text-[var(--color-dark-muted)] block uppercase font-mono">Safety Margin:</span>
                <strong className="text-[#2E7D32] font-mono text-xs font-bold">+2.1h Before Depletion</strong>
              </div>
            </div>

            <p className="text-[var(--color-dark-muted)] text-[11px] leading-relaxed">
              Divert through BRO Old Mahur-Jatinga compacted bypass corridor (18.0 km unpaved/graded). Avoids all active debris channels and is verified 100% passable for 4WD high-clearance tactical vehicles.
            </p>

            <div className="pt-1">
              <Button
                onClick={onApproveClick}
                disabled={isApproved || !canApprove}
                variant={isApproved ? "secondary" : canApprove ? "default" : "outline"}
                className="w-full rounded-full font-mono text-xs font-bold"
                title={canApprove ? "Authorize alternate corridor dispatch" : `Sign-off reserved for District Authority. Current: ${roleInfo.name}`}
              >
                {isApproved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#2E7D32]" />
                    REPLAN MISSION AUTHORIZED
                  </>
                ) : canApprove ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    APPROVE ALTERNATE CORRIDOR DISPATCH
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-[var(--color-dark-muted)]" />
                    APPROVAL RESERVED FOR DISTRICT AUTHORITY
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Engine Justification & Trade-off Matrix */}
      <Card className="border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)]">
        <CardHeader className="pb-3 border-b border-[var(--color-dark-rule)]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-[var(--color-dark-ink)]">
              DECISION ENGINE MULTI-CRITERIA TRADE-OFF AUDIT
            </CardTitle>
            <Badge variant="secondary" className="font-mono text-[10px] border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)]">
              ALGORITHM: RISK-ADJUSTED A* (C_R)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-3 space-y-3 text-xs leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)]">
              <span className="font-mono text-[10px] text-[#EF4444] block uppercase font-bold">
                Option A: Wait for NH-27 Clearing
              </span>
              <p className="mt-1 text-[var(--color-dark-muted)]">
                Rejected. Minimum clearance window is 72 hours, whereas Harangajao drinking water reserve zero-point will be breached in 4.2 hours.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)]">
              <span className="font-mono text-[10px] text-[#B8DEC8] block uppercase font-bold">
                Option B: BRO Old Mahur Bypass Corridor (Recommended)
              </span>
              <p className="mt-1 text-[var(--foreground)]">
                Selected. Additional 22.9 minutes transit delta is acceptable within life-support delivery deadline. Lowest landslide susceptibility overlap ($C_R = 1.25$).
              </p>
            </div>
          </div>

          {/* Sovereign Approval Record */}
          {isApproved && (
            <div className="p-3 rounded border border-[var(--success)]/40 bg-[var(--success)]/10 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
                <div>
                  <span className="font-semibold text-[var(--foreground)]">
                    Official Executive Sign-off Recorded:
                  </span>
                  <span className="text-[var(--muted-foreground)] ml-1.5">
                    Authorized by {roleInfo.name} at {approvalTime || '14:22 IST'}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[var(--success)] font-semibold uppercase">
                SHA-256 LEDGER COMMITTED
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
