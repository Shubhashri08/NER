import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Maximize2, Compass, RotateCw } from 'lucide-react';

interface GlobeViewProps {
  onSelectNode?: (nodeName: string) => void;
  height?: number;
  showControls?: boolean;
}

export const GlobeView: React.FC<GlobeViewProps> = ({
  height = 460,
  showControls = true,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Authoritative NER Geographic Coordinates
  const coords = {
    haflong: { lat: 25.1832, lng: 93.0254, name: 'Haflong Staging Base (Dima Hasao)' },
    harangajao: { lat: 25.0210, lng: 93.0334, name: 'Harangajao (Cutoff Epicenter)' },
    silchar: { lat: 24.8333, lng: 92.7926, name: 'Silchar Central Transshipment Base' },
    guwahati: { lat: 26.1200, lng: 91.8100, name: 'Guwahati Macro State Reserve' },
    shillong: { lat: 25.5689, lng: 91.8833, name: 'Shillong Civil Defense Hub' },
    mangan: { lat: 27.5050, lng: 88.5286, name: 'Mangan Forward Alpine Hub (North Sikkim)' },
    itanagar: { lat: 27.0844, lng: 93.6166, name: 'Itanagar Capital Central Base' }
  };

  const arcsData = [
    { startLat: coords.guwahati.lat, startLng: coords.guwahati.lng, endLat: coords.haflong.lat, endLng: coords.haflong.lng, name: 'State Reserve -> Dima Hasao' },
    { startLat: coords.haflong.lat, startLng: coords.haflong.lng, endLat: coords.harangajao.lat, endLng: coords.harangajao.lng, name: 'Haflong Depot -> Harangajao Bypass' },
    { startLat: coords.silchar.lat, startLng: coords.silchar.lng, endLat: coords.harangajao.lat, endLng: coords.harangajao.lng, name: 'Barak Reserve -> Harangajao Southern Approach' },
    { startLat: coords.guwahati.lat, startLng: coords.guwahati.lng, endLat: coords.mangan.lat, endLng: coords.mangan.lng, name: 'Interstate Airhead -> North Sikkim' }
  ];

  const ringsData = [
    { lat: coords.harangajao.lat, lng: coords.harangajao.lng, maxR: 3.5, propagationSpeed: 1.8, repeatPeriod: 1400 },
    { lat: coords.mangan.lat, lng: coords.mangan.lng, maxR: 2.8, propagationSpeed: 1.5, repeatPeriod: 1600 }
  ];

  const pointsData = [
    { lat: coords.guwahati.lat, lng: coords.guwahati.lng, size: 0.7, color: '#E8DEC8', name: coords.guwahati.name },
    { lat: coords.silchar.lat, lng: coords.silchar.lng, size: 0.8, color: '#E8DEC8', name: coords.silchar.name },
    { lat: coords.haflong.lat, lng: coords.haflong.lng, size: 0.75, color: '#D97706', name: coords.haflong.name },
    { lat: coords.shillong.lat, lng: coords.shillong.lng, size: 0.6, color: '#E8DEC8', name: coords.shillong.name },
    { lat: coords.itanagar.lat, lng: coords.itanagar.lng, size: 0.6, color: '#E8DEC8', name: coords.itanagar.name },
    { lat: coords.mangan.lat, lng: coords.mangan.lng, size: 0.7, color: '#D90429', name: coords.mangan.name },
    { lat: coords.harangajao.lat, lng: coords.harangajao.lng, size: 1.0, color: '#9E2A2B', name: coords.harangajao.name }
  ];

  useEffect(() => {
    if (globeRef.current) {
      // Focus initially on North Eastern Region
      globeRef.current.pointOfView({ lat: 26.0, lng: 92.5, altitude: 1.8 }, 1200);
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;
        controls.enableZoom = true;
      }
    }
  }, []);

  const handleFocusNER = () => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 25.5, lng: 92.8, altitude: 1.3 }, 1000);
    }
  };

  const handleFocusIndia = () => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 24.0, lng: 84.0, altitude: 2.2 }, 1000);
    }
  };

  const handleToggleSpin = () => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = !controls.autoRotate;
      }
    }
  };

  return (
    <div 
      style={{ height: `${height}px` }}
      className="relative w-full rounded border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm transition-colors"
    >
      <div ref={containerRef} className="w-full h-full">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#E8DEC8"
          atmosphereAltitude={0.15}
          arcsData={arcsData}
          arcColor={() => ['#E8DEC8', '#B5AA97']}
          arcDashLength={0.35}
          arcDashGap={0.12}
          arcDashAnimateTime={2000}
          arcStroke={1.2}
          arcAltitude={0.22}
          ringsData={ringsData}
          ringColor={() => (t: number) => `rgba(158, 42, 43, ${1 - t})`}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          pointsData={pointsData}
          pointAltitude={0.06}
          pointRadius="size"
          pointColor="color"
          width={containerRef.current?.clientWidth || 900}
          height={height}
        />
      </div>

      {/* Top HUD Badges */}
      {showControls && (
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--card)]/90 backdrop-blur-sm border border-[var(--border)] text-xs text-[var(--foreground)]">
            <span className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase">DISASTER FOCUS:</span>
            <strong className="font-mono text-xs font-semibold text-[var(--foreground)]">DIMA HASAO & SIKKIM BASIN</strong>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="critical">
              NH-27 ARTERIAL SEVERED
            </Badge>
            <Badge variant="default">
              4 STRATEGIC NER CORRIDORS
            </Badge>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      {showControls && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleFocusNER} className="bg-[var(--card)] text-xs gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            FOCUS NER CORRIDOR
          </Button>
          <Button size="sm" variant="outline" onClick={handleFocusIndia} className="bg-[var(--card)] text-xs gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            PAN INDIA
          </Button>
          <Button size="sm" variant="outline" onClick={handleToggleSpin} className="bg-[var(--card)] text-xs gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            TOGGLE ROTATION
          </Button>
        </div>
      )}
    </div>
  );
};
