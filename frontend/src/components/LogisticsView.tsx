import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MOCK_DATA } from '@/data/mockData';

export const LogisticsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Affected Locations Demand Table */}
      <Card className="border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)]">
        <CardHeader className="border-b border-[var(--color-dark-rule)] pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[var(--color-dark-ink)]">
                1. AFFECTED HABITATIONS & DEMAND QUEUE
              </CardTitle>
              <p className="text-xs text-[var(--color-dark-muted)] mt-0.5">
                Census demographic factors, isolation timeline, and critical resource depletion thresholds
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px] border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)]">
              PROVENANCE: REAL // CENSUS 2011
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-[var(--color-dark-paper)] font-mono text-[11px] text-[var(--color-dark-muted)] border-b border-[var(--color-dark-rule)]">
              <tr>
                <th className="p-3.5 pl-5">HABITATION / NODE</th>
                <th className="p-3.5">STATE & DISTRICT</th>
                <th className="p-3.5">POPULATION</th>
                <th className="p-3.5">ISOLATION</th>
                <th className="p-3.5">WATER BUFFER</th>
                <th className="p-3.5">ACCESS CORRIDOR</th>
                <th className="p-3.5 pr-5 text-right">URGENCY SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-rule)]">
              {MOCK_DATA.villages.map((v) => (
                <tr key={v.id} className="hover:bg-[var(--color-dark-raised)]/50 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="font-bold text-[var(--color-dark-ink)]">{v.name}</div>
                    <div className="text-[10px] text-[var(--color-dark-muted)]">{v.id} &bull; Code: {v.census_code}</div>
                  </td>
                  <td className="p-3.5 text-[var(--color-dark-muted)]">
                    {v.district}, {v.state}
                  </td>
                  <td className="p-3.5 font-bold text-[var(--color-dark-ink)]">
                    {v.population.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-[#D4AF37]">
                    Day {v.isolation_day}
                  </td>
                  <td className="p-3.5 font-bold">
                    <span className={v.water_hours_remaining < 6 ? 'text-[#EF4444]' : 'text-[#2E7D32]'}>
                      {v.water_hours_remaining}h remaining
                    </span>
                  </td>
                  <td className="p-3.5 text-[var(--color-dark-muted)] max-w-xs truncate" title={v.access_route}>
                    {v.access_route}
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <Badge variant={v.urgency_score >= 80 ? 'critical' : v.urgency_score >= 65 ? 'warning' : 'default'}>
                      {v.urgency_score} / 100
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Staging Warehouses Inventory Matrix */}
      <Card className="border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)]">
        <CardHeader className="border-b border-[var(--color-dark-rule)] pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[var(--color-dark-ink)]">
                2. STRATEGIC STAGING DEPOTS & PREPOSITIONED RESERVES
              </CardTitle>
              <p className="text-xs text-[var(--color-dark-muted)] mt-0.5">
                Operational stockpile availability across North Eastern regional staging hubs
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px] border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)]">
              PROVENANCE: SIMULATED // OPERATIONAL BASELINE
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-[var(--color-dark-paper)] font-mono text-[11px] text-[var(--color-dark-muted)] border-b border-[var(--color-dark-rule)]">
              <tr>
                <th className="p-3.5 pl-5">STAGING DEPOT</th>
                <th className="p-3.5">FACILITY TYPE</th>
                <th className="p-3.5">POTABLE WATER (L)</th>
                <th className="p-3.5">CALORIC MEALS</th>
                <th className="p-3.5">TRAUMA / ANTI-VENOM</th>
                <th className="p-3.5">SHELTER TENTS</th>
                <th className="p-3.5 pr-5 text-right">CAPACITY USED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-rule)]">
              {MOCK_DATA.warehouses.map((w) => (
                <tr key={w.id} className="hover:bg-[var(--color-dark-raised)]/50 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="font-bold text-[var(--color-dark-ink)]">{w.name}</div>
                    <div className="text-[10px] text-[var(--color-dark-muted)]">{w.id} &bull; {w.state}</div>
                  </td>
                  <td className="p-3.5 text-[var(--color-dark-muted)]">{w.type}</td>
                  <td className="p-3.5 text-[var(--color-dark-ink)]">
                    {w.stock.drinking_water_liters.toLocaleString()} L
                  </td>
                  <td className="p-3.5 text-[var(--color-dark-ink)]">
                    {w.stock.high_calorie_meals.toLocaleString()} pk
                  </td>
                  <td className="p-3.5 text-[var(--color-dark-ink)]">
                    {w.stock.trauma_medical_kits} kits
                  </td>
                  <td className="p-3.5 text-[var(--color-dark-ink)]">
                    {w.stock.emergency_shelter_kits} units
                  </td>
                  <td className="p-3.5 pr-5 text-right font-bold">
                    <span className={w.capacity_used_pct > 85 ? 'text-[#D4AF37]' : 'text-[#2E7D32]'}>
                      {w.capacity_used_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Transport Fleet Telemetry */}
      <Card className="border-[var(--color-dark-rule)] bg-[var(--color-dark-surface)]">
        <CardHeader className="border-b border-[var(--color-dark-rule)] pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[var(--color-dark-ink)]">
                3. EMERGENCY TRANSPORT FLEET & LIVE TELEMETRY
              </CardTitle>
              <p className="text-xs text-[var(--color-dark-muted)] mt-0.5">
                Ground asset readiness, payload capacity, and real-time transit telemetry
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px] border border-[var(--color-dark-rule)] bg-[var(--color-dark-paper)]">
              PROVENANCE: SIMULATED // GPS STREAM
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-[var(--color-dark-paper)] font-mono text-[11px] text-[var(--color-dark-muted)] border-b border-[var(--color-dark-rule)]">
              <tr>
                <th className="p-3.5 pl-5">VEHICLE CALLSIGN</th>
                <th className="p-3.5">REGISTRATION & TYPE</th>
                <th className="p-3.5">PAYLOAD RATING</th>
                <th className="p-3.5">ACTIVE MANIFEST</th>
                <th className="p-3.5">OPERATING DRIVER</th>
                <th className="p-3.5">SPEED</th>
                <th className="p-3.5 pr-5 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-rule)]">
              {MOCK_DATA.vehicles.map((vh) => (
                <tr key={vh.id} className="hover:bg-[var(--color-dark-raised)]/50 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="font-bold text-[var(--color-dark-ink)]">{vh.callsign}</div>
                    <div className="text-[10px] text-[var(--color-dark-muted)]">{vh.id}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-[11px] text-[var(--color-dark-ink)]">{vh.registration}</div>
                    <div className="text-[10px] text-[var(--color-dark-muted)]">{vh.type}</div>
                  </td>
                  <td className="p-3.5 text-[var(--color-dark-ink)]">
                    {vh.payload_capacity_kg.toLocaleString()} kg
                  </td>
                  <td className="p-3.5 text-[var(--color-dark-muted)]">
                    {vh.cargo_current}
                  </td>
                  <td className="p-3.5 text-[var(--color-dark-ink)] font-bold">
                    {vh.driver}
                  </td>
                  <td className="p-3.5 text-[#3B82F6]">
                    {vh.telemetry_speed}
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <Badge variant={vh.status === 'IN_TRANSIT' ? 'warning' : 'success'}>
                      {vh.status.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
