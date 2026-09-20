import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, ChevronRight, AlertTriangle, Route, ShieldAlert, Lock } from 'lucide-react';
import { ROLE_DEFINITIONS } from './Navbar';

interface BentoGridProps {
  onApproveClick: () => void;
  onInspectTradeoffs: () => void;
  isApproved: boolean;
  currentRole: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  onApproveClick,
  onInspectTradeoffs,
  isApproved,
  currentRole,
}) => {
  const roleInfo = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS.ROLE_DISTRICT_AUTH;
  const canApprove = roleInfo.canApprove;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* 1. WHAT IS HAPPENING? */}
      <Card className="col-span-12 border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="critical" className="gap-2 py-0.5">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
              1. WHAT IS HAPPENING? (LIVE SITREP)
            </Badge>
            <span className="font-mono text-[10px] text-[var(--color-dark-muted)] tracking-wider uppercase">
              PROVENANCE: REAL // NH-27 KM-142 JATINGA-HARANGAJAO GORGE
            </span>
          </div>
          <CardTitle className="text-base font-black mt-2 text-[var(--color-dark-ink)] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
            <span>Massive 200m Hill Subsidence Severing NH-27 Arterial Lifeline into Barak Valley</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-[var(--color-dark-muted)] leading-relaxed">
          Monsoonal torrential downpours triggered an active slope slip between Jatinga and Harangajao in Dima Hasao, Assam. Both carriageways of NH-27 are completely impassable. NHIDCL clearance estimate is 72 to 96 hours. <strong className="text-[var(--color-dark-ink)]">Harangajao (Pop: 3,680)</strong> is physically isolated from primary highway transit.
        </CardContent>
      </Card>

      {/* 2. WHAT NEEDS ATTENTION? */}
      <Card className="col-span-12 lg:col-span-6 border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="warning" className="gap-1.5">
              <ShieldAlert className="w-3 h-3" />
              2. WHAT NEEDS ATTENTION?
            </Badge>
            <span className="font-mono text-[10px] text-[var(--color-dark-muted)]">PRIORITY QUEUE #1</span>
          </div>
          <div className="flex items-baseline justify-between mt-2 border-b border-[var(--color-dark-rule)] pb-2">
            <span className="text-sm font-bold text-[var(--color-dark-ink)]">Harangajao & Jatinga Cutoff</span>
            <span className="font-mono text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 px-2.5 py-0.5 rounded-full border border-[#EF4444]/30">
              URGENCY: 86.4 / 100
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[var(--color-dark-paper)] border border-[var(--color-dark-rule)] rounded-lg p-2.5 flex flex-col gap-0.5">
              <span className="font-mono text-[10px] text-[var(--color-dark-muted)] uppercase">POPULATION</span>
              <span className="font-mono text-sm font-bold text-[var(--color-dark-ink)]">3,680</span>
            </div>
            <div className="bg-[var(--color-dark-paper)] border border-[var(--color-dark-rule)] rounded-lg p-2.5 flex flex-col gap-0.5">
              <span className="font-mono text-[10px] text-[var(--color-dark-muted)] uppercase">WATER BUFFER</span>
              <span className="font-mono text-sm font-bold text-[#EF4444]">4.2 Hours</span>
            </div>
            <div className="bg-[var(--color-dark-paper)] border border-[var(--color-dark-rule)] rounded-lg p-2.5 flex flex-col gap-0.5">
              <span className="font-mono text-[10px] text-[var(--color-dark-muted)] uppercase">ISOLATION</span>
              <span className="font-mono text-sm font-bold text-[#D4AF37]">Day 3</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. WHAT DOES THE SYSTEM RECOMMEND & ACTION APPROVAL */}
      <Card className="col-span-12 lg:col-span-6 border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="default" className="gap-1.5 border border-[var(--color-dark-rule)] bg-[var(--color-dark-raised)] text-[#B8DEC8]">
              <Route className="w-3 h-3" />
              3. WHAT DOES THE SYSTEM RECOMMEND?
            </Badge>
            <span className="font-mono text-[10px] text-[var(--color-dark-muted)]">MISSION MSN-NER-2026-001</span>
          </div>
          <div className="flex items-center justify-between mt-2 border-b border-[var(--color-dark-rule)] pb-2">
            <span className="text-xs font-bold text-[var(--color-dark-ink)]">
              Divert Convoy via BRO Old Mahur-Jatinga Bypass
            </span>
            <span className="font-mono text-xs font-bold text-[#D4AF37]">+22.9 MINS</span>
          </div>
        </CardHeader>
        <CardContent className="pt-2 flex flex-col gap-3">
          <p className="text-xs text-[var(--color-dark-muted)] leading-relaxed">
            Reassign 4x4 Heavy Tactical vehicle from Haflong Depot along the BRO compacted bypass corridor. Route circumvents all active slide runout zones and delivers medical supplies 2.1 hours before potable water buffer exhaustion.
          </p>

          <div className="flex items-center gap-2 pt-1 border-t border-[var(--color-dark-rule)]">
            <Button
              onClick={onApproveClick}
              disabled={isApproved || !canApprove}
              variant={isApproved ? "secondary" : canApprove ? "default" : "outline"}
              className="flex-1 rounded-full text-xs font-mono font-bold"
              title={canApprove ? "Authorize dynamic dispatch order" : `Sign-off prohibited for ${roleInfo.name}`}
            >
              {isApproved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#2E7D32]" />
                  REPLAN AUTHORIZED & DISPATCHED
                </>
              ) : canApprove ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  APPROVE DISPATCH ORDER
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-[var(--color-dark-muted)]" />
                  APPROVAL REQUIRES DISTRICT AUTH
                </>
              )}
            </Button>
            <Button variant="outline" size="default" onClick={onInspectTradeoffs} className="rounded-full text-xs font-mono border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)] hover:bg-[var(--color-dark-raised)]">
              TRADE-OFFS
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. WHY? ALGORITHMIC REASONING & EXPECTED OUTCOME */}
      <Card className="col-span-12 border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="border border-[var(--color-dark-rule)] text-[var(--color-dark-muted)]">
              4. WHY? (ALGORITHMIC REASONING & EXPECTED OUTCOME)
            </Badge>
            <span className="font-mono text-[10px] text-[var(--color-dark-muted)]">SHA-256 AUDITABLE CO-PILOT</span>
          </div>
        </CardHeader>
        <CardContent className="pt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="p-3 rounded-lg border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)]">
              <span className="font-mono text-[10px] text-[#B8DEC8] block uppercase font-bold">Constraint Check</span>
              <p className="text-[var(--color-dark-muted)] mt-1">
                Primary arterial NH-27 impassable at Jatinga due to 200m debris cut. Clearance estimated at 72h minimum. Direct routing physically prohibited.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)]">
              <span className="font-mono text-[10px] text-[#D4AF37] block uppercase font-bold">Alternative Corridor</span>
              <p className="text-[var(--color-dark-muted)] mt-1">
                Northern railway line compromised by tunnel mud flow. BRO Old Mahur bypass verified passable for 4WD high-clearance tactical vehicles.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)]">
              <span className="font-mono text-[10px] text-[#2E7D32] block uppercase font-bold">Expected Outcome</span>
              <p className="text-[var(--color-dark-muted)] mt-1">
                Arrival in ~99.5 mins (estimated 14:15 IST), delivering 800 packs potable water and 350 trauma/anti-venom kits safely ahead of zero-stock threshold.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
