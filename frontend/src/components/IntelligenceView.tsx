import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  FileText, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ChevronDown, 
  Send, 
  User, 
  Map as MapIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Layers, 
  Download, 
  Activity, 
  Check 
} from 'lucide-react';
import { disasterApi } from '../services/api';

interface AnalyticsDataPoint {
  label: string;
  series1: number;
  series2: number;
  series3: number;
  series4: number;
}

interface AnalyticsConfig {
  title: string;
  yMax: number;
  unit: string;
  seriesNames: [string, string, string, string];
  seriesColors: [string, string, string, string];
  data: {
    'Last 24 Hours': AnalyticsDataPoint[];
    'Last 7 Days': AnalyticsDataPoint[];
    'Last 30 Days': AnalyticsDataPoint[];
  };
}

const ANALYTICS_DATA: Record<'incidents' | 'needs' | 'missions' | 'population' | 'resources', AnalyticsConfig> = {
  incidents: {
    title: 'Incident Frequency & Risk Trends',
    yMax: 100,
    unit: 'events',
    seriesNames: ['Flood', 'Landslide', 'Heavy Rainfall', 'Other'],
    seriesColors: ['#3B82F6', '#F59E0B', '#10B981', '#A855F7'],
    data: {
      'Last 24 Hours': [
        { label: '00:00', series1: 22, series2: 14, series3: 30, series4: 8 },
        { label: '04:00', series1: 25, series2: 16, series3: 35, series4: 9 },
        { label: '08:00', series1: 38, series2: 24, series3: 52, series4: 12 },
        { label: '12:00', series1: 64, series2: 36, series3: 68, series4: 18 },
        { label: '16:00', series1: 58, series2: 32, series3: 60, series4: 15 },
        { label: '20:00', series1: 44, series2: 22, series3: 48, series4: 11 },
        { label: 'Now', series1: 36, series2: 18, series3: 40, series4: 10 },
      ],
      'Last 7 Days': [
        { label: '10 Sep', series1: 32, series2: 18, series3: 22, series4: 12 },
        { label: '11 Sep', series1: 26, series2: 15, series3: 19, series4: 11 },
        { label: '12 Sep', series1: 42, series2: 20, series3: 24, series4: 14 },
        { label: '13 Sep', series1: 52, series2: 26, series3: 32, series4: 15 },
        { label: '14 Sep', series1: 88, series2: 36, series3: 64, series4: 20 },
        { label: '15 Sep', series1: 72, series2: 32, series3: 54, series4: 18 },
        { label: '16 Sep', series1: 50, series2: 28, series3: 38, series4: 16 },
      ],
      'Last 30 Days': [
        { label: 'Week 1', series1: 45, series2: 24, series3: 38, series4: 15 },
        { label: 'Week 2', series1: 60, series2: 30, series3: 48, series4: 18 },
        { label: 'Week 3', series1: 95, series2: 44, series3: 76, series4: 25 },
        { label: 'Week 4', series1: 70, series2: 35, series3: 52, series4: 20 },
      ],
    }
  },
  needs: {
    title: 'Relief & Critical Supply Demand',
    yMax: 500,
    unit: 'Tons/kL',
    seriesNames: ['Food Packs (Tons)', 'Drinking Water (kL)', 'Medicine Kits', 'Shelter Tents'],
    seriesColors: ['#3B82F6', '#10B981', '#F59E0B', '#A855F7'],
    data: {
      'Last 24 Hours': [
        { label: '00:00', series1: 120, series2: 95, series3: 45, series4: 20 },
        { label: '04:00', series1: 140, series2: 110, series3: 50, series4: 25 },
        { label: '08:00', series1: 260, series2: 190, series3: 95, series4: 55 },
        { label: '12:00', series1: 390, series2: 280, series3: 160, series4: 85 },
        { label: '16:00', series1: 340, series2: 250, series3: 130, series4: 70 },
        { label: '20:00', series1: 270, series2: 190, series3: 90, series4: 50 },
        { label: 'Now', series1: 210, series2: 160, series3: 75, series4: 40 },
      ],
      'Last 7 Days': [
        { label: '10 Sep', series1: 180, series2: 140, series3: 65, series4: 30 },
        { label: '11 Sep', series1: 195, series2: 155, series3: 70, series4: 35 },
        { label: '12 Sep', series1: 240, series2: 180, series3: 90, series4: 45 },
        { label: '13 Sep', series1: 310, series2: 230, series3: 120, series4: 60 },
        { label: '14 Sep', series1: 470, series2: 320, series3: 210, series4: 110 },
        { label: '15 Sep', series1: 420, series2: 290, series3: 180, series4: 95 },
        { label: '16 Sep', series1: 360, series2: 250, series3: 140, series4: 80 },
      ],
      'Last 30 Days': [
        { label: 'Week 1', series1: 220, series2: 170, series3: 85, series4: 40 },
        { label: 'Week 2', series1: 290, series2: 210, series3: 115, series4: 60 },
        { label: 'Week 3', series1: 480, series2: 340, series3: 220, series4: 115 },
        { label: 'Week 4', series1: 390, series2: 270, series3: 160, series4: 85 },
      ],
    }
  },
  missions: {
    title: 'Operational Missions & Convoys',
    yMax: 80,
    unit: 'missions',
    seriesNames: ['Evacuation Convoys', 'Airlift Sorties', 'Medical Triage', 'Route Clearance'],
    seriesColors: ['#3B82F6', '#F59E0B', '#10B981', '#A855F7'],
    data: {
      'Last 24 Hours': [
        { label: '00:00', series1: 10, series2: 2, series3: 8, series4: 4 },
        { label: '04:00', series1: 12, series2: 3, series3: 10, series4: 5 },
        { label: '08:00', series1: 28, series2: 8, series3: 22, series4: 14 },
        { label: '12:00', series1: 48, series2: 14, series3: 36, series4: 20 },
        { label: '16:00', series1: 42, series2: 12, series3: 30, series4: 18 },
        { label: '20:00', series1: 26, series2: 6, series3: 20, series4: 12 },
        { label: 'Now', series1: 22, series2: 4, series3: 16, series4: 8 },
      ],
      'Last 7 Days': [
        { label: '10 Sep', series1: 18, series2: 4, series3: 14, series4: 8 },
        { label: '11 Sep', series1: 22, series2: 5, series3: 16, series4: 10 },
        { label: '12 Sep', series1: 30, series2: 7, series3: 22, series4: 12 },
        { label: '13 Sep', series1: 40, series2: 10, series3: 28, series4: 15 },
        { label: '14 Sep', series1: 68, series2: 18, series3: 45, series4: 24 },
        { label: '15 Sep', series1: 56, series2: 14, series3: 38, series4: 20 },
        { label: '16 Sep', series1: 46, series2: 11, series3: 32, series4: 16 },
      ],
      'Last 30 Days': [
        { label: 'Week 1', series1: 25, series2: 6, series3: 18, series4: 10 },
        { label: 'Week 2', series1: 38, series2: 9, series3: 26, series4: 14 },
        { label: 'Week 3', series1: 72, series2: 20, series3: 48, series4: 26 },
        { label: 'Week 4', series1: 50, series2: 12, series3: 35, series4: 18 },
      ],
    }
  },
  population: {
    title: 'Displacement & Vulnerability Trends',
    yMax: 60,
    unit: 'k persons',
    seriesNames: ['Displaced (k)', 'High Risk (k)', 'In Shelters (k)', 'Isolated (k)'],
    seriesColors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'],
    data: {
      'Last 24 Hours': [
        { label: '00:00', series1: 24, series2: 32, series3: 12, series4: 6 },
        { label: '04:00', series1: 26, series2: 34, series3: 14, series4: 7 },
        { label: '08:00', series1: 34, series2: 40, series3: 18, series4: 9 },
        { label: '12:00', series1: 48, series2: 52, series3: 26, series4: 14 },
        { label: '16:00', series1: 44, series2: 48, series3: 24, series4: 12 },
        { label: '20:00', series1: 38, series2: 42, series3: 21, series4: 10 },
        { label: 'Now', series1: 35, series2: 39, series3: 19, series4: 8 },
      ],
      'Last 7 Days': [
        { label: '10 Sep', series1: 20, series2: 28, series3: 10, series4: 5 },
        { label: '11 Sep', series1: 22, series2: 30, series3: 12, series4: 6 },
        { label: '12 Sep', series1: 28, series2: 36, series3: 15, series4: 8 },
        { label: '13 Sep', series1: 36, series2: 44, series3: 20, series4: 10 },
        { label: '14 Sep', series1: 54, series2: 58, series3: 30, series4: 16 },
        { label: '15 Sep', series1: 48, series2: 52, series3: 27, series4: 13 },
        { label: '16 Sep', series1: 42, series2: 46, series3: 23, series4: 11 },
      ],
      'Last 30 Days': [
        { label: 'Week 1', series1: 24, series2: 32, series3: 13, series4: 7 },
        { label: 'Week 2', series1: 35, series2: 42, series3: 19, series4: 9 },
        { label: 'Week 3', series1: 58, series2: 60, series3: 32, series4: 17 },
        { label: 'Week 4', series1: 45, series2: 49, series3: 25, series4: 12 },
      ],
    }
  },
  resources: {
    title: 'Fleet & Personnel Readiness',
    yMax: 120,
    unit: 'units',
    seriesNames: ['4x4 Fleet Active', 'Boats Deployed', 'Field Responders', 'Fuel Stocks (kL)'],
    seriesColors: ['#3B82F6', '#10B981', '#F59E0B', '#A855F7'],
    data: {
      'Last 24 Hours': [
        { label: '00:00', series1: 32, series2: 12, series3: 65, series4: 80 },
        { label: '04:00', series1: 34, series2: 14, series3: 70, series4: 78 },
        { label: '08:00', series1: 48, series2: 22, series3: 95, series4: 72 },
        { label: '12:00', series1: 58, series2: 28, series3: 115, series4: 64 },
        { label: '16:00', series1: 52, series2: 24, series3: 105, series4: 60 },
        { label: '20:00', series1: 42, series2: 18, series3: 88, series4: 58 },
        { label: 'Now', series1: 38, series2: 16, series3: 80, series4: 56 },
      ],
      'Last 7 Days': [
        { label: '10 Sep', series1: 30, series2: 10, series3: 60, series4: 90 },
        { label: '11 Sep', series1: 34, series2: 12, series3: 68, series4: 86 },
        { label: '12 Sep', series1: 40, series2: 16, series3: 80, series4: 82 },
        { label: '13 Sep', series1: 48, series2: 20, series3: 94, series4: 75 },
        { label: '14 Sep', series1: 62, series2: 30, series3: 120, series4: 62 },
        { label: '15 Sep', series1: 55, series2: 26, series3: 110, series4: 58 },
        { label: '16 Sep', series1: 46, series2: 20, series3: 92, series4: 55 },
      ],
      'Last 30 Days': [
        { label: 'Week 1', series1: 35, series2: 12, series3: 70, series4: 88 },
        { label: 'Week 2', series1: 45, series2: 18, series3: 85, series4: 80 },
        { label: 'Week 3', series1: 65, series2: 32, series3: 122, series4: 60 },
        { label: 'Week 4', series1: 50, series2: 22, series3: 98, series4: 56 },
      ],
    }
  }
};

export const IntelligenceView: React.FC<{ onNavigateToTab?: (tab: string) => void; isDark?: boolean }> = ({
  onNavigateToTab,
}) => {
  const [analyticsCategory, setAnalyticsCategory] = useState<'incidents' | 'needs' | 'missions' | 'population' | 'resources'>('incidents');
  const [timeRange, setTimeRange] = useState<'Last 24 Hours' | 'Last 7 Days' | 'Last 30 Days'>('Last 7 Days');
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Interactive Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; actionButtons?: boolean; timestamp?: string }>>([
    {
      sender: 'user',
      text: 'Which districts are at highest risk of landslide over the next 48 hours?',
      timestamp: '10:24 AM'
    },
    {
      sender: 'ai',
      text: `Based on current rainfall forecasts and terrain analysis, the following districts are at highest risk of landslide in the next 48 hours:

1. Dimapur (Nagaland) – High (85% vulnerability index)
2. Churachandpur (Manipur) – High (82% vulnerability index)
3. Mamit (Mizoram) – Medium (64% vulnerability index)
4. Dima Hasao (Assam) – Medium (60% vulnerability index)

Key factors: continuous heavy rainfall (120–180 mm), steep slope gradients (>35°), and recent saturated soil hydrology. Recommended immediate pre-deployment of 4x4 high-clearance assets to Haflong and Dimapur staging depots.`,
      actionButtons: true,
      timestamp: '10:25 AM'
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiTyping) return;

    const userText = chatInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'user', text: userText, timestamp: timeNow }]);
    setChatInput('');
    setIsAiTyping(true);

    try {
      const res = await disasterApi.queryCopilot(userText);
      const aiAnswer = res.data?.answer;
      if (aiAnswer) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: aiAnswer,
            actionButtons: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsAiTyping(false);
        return;
      }
      throw new Error('No answer returned');
    } catch (err) {
      console.warn('[Copilot Fallback]:', err);
      // Local intelligent telemetry synthesis fallback
      setTimeout(() => {
        let aiReply = `NER Disaster Intelligence synthesis for: "${userText}"...\n\nOperational metrics indicate standard headroom with active flood monitoring in Dima Hasao and Sonitpur. Recommended action: Pre-position reserve supplies at Guwahati Hub and keep secondary bypass corridors open.`;
        
        const lower = userText.toLowerCase();
        if (lower.includes('shelter') || lower.includes('capacity') || lower.includes('bed')) {
          aiReply = `Current regional shelter headroom:\n• Shillong Central Hub: 5,000 capacity (58% occupied)\n• Haflong Relief Center: 3,500 capacity (74% occupied)\n• Aizawl Multi-Purpose: 2,800 capacity (62% occupied)\n• Tezpur Stadium: 4,200 capacity (45% occupied)\n\nTotal remaining emergency beds available: 4,850 across all frontline staging zones.`;
        } else if (lower.includes('road') || lower.includes('route') || lower.includes('highway') || lower.includes('nh')) {
          aiReply = `Regional Arterial Transport Corridors Status:\n• NH-27 (Dima Hasao Sector): Disrupted by debris at km 84. BRO Bypass Corridor R2 active (Transit time +1.8h).\n• NH-10 (Siliguri to Gangtok): Single-lane regulated traffic due to minor slope subsidence.\n• NH-208 (Agartala to Khowai): Clear and fully passable with heavy convoy escort.`;
        } else if (lower.includes('stock') || lower.includes('food') || lower.includes('medicine') || lower.includes('supply')) {
          aiReply = `Regional Inventory Telemetry:\n• Total Stock: 1,240 Tons across 6 central warehouses.\n• Food Rations: 471.2 Tons (38%)\n• Drinking Water: 322.4 Tons (26%)\n• Trauma Medicine: 223.2 Tons (18%)\n• Critical Alert: Medicine kits in Tura Depot at 28% capacity — Restock requisition SR-019 dispatched.`;
        } else if (lower.includes('evacuat') || lower.includes('relocation') || lower.includes('mission')) {
          aiReply = `Active Evacuation Operations:\n• Convoy Alpha (REL-01): Harangajao Valley to Haflong — 75% progress (1,850 evacuees, ETA 45m).\n• Convoy Bravo (REL-02): Maibong to High Ground — 65% progress (1,200 evacuees, ETA 1.2h).\n• 42 tactical 4x4 vehicles & 4 amphibious power boats deployed in frontline sectors.`;
        }
        
        setMessages((prev) => [
          ...prev, 
          { 
            sender: 'ai', 
            text: aiReply, 
            actionButtons: true, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ]);
        setIsAiTyping(false);
      }, 500);
    }
  };

  const currentAnalytics = ANALYTICS_DATA[analyticsCategory];
  const activePoints = currentAnalytics.data[timeRange];
  const yMax = currentAnalytics.yMax;

  // Calculate SVG curve paths dynamically
  const svgWidth = 420;
  const svgHeight = 160;
  const paddingLeft = 40;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const getX = (idx: number) => paddingLeft + (idx / (activePoints.length - 1)) * chartW;
  const getY = (val: number) => paddingTop + chartH - (val / yMax) * chartH;

  const generateSmoothPath = (seriesKey: 'series1' | 'series2' | 'series3' | 'series4') => {
    if (activePoints.length === 0) return '';
    const points = activePoints.map((p, idx) => ({ x: getX(idx), y: getY(p[seriesKey]) }));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i !== points.length - 2 ? points[i + 2] : p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const generateAreaPath = (seriesKey: 'series1') => {
    const linePath = generateSmoothPath(seriesKey);
    const lastX = getX(activePoints.length - 1);
    const firstX = getX(0);
    const bottomY = paddingTop + chartH;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--background)] text-[var(--foreground)] font-sans select-none px-6 py-4 gap-4">
      
      {/* 1. Header Area without subtab strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[var(--muted-foreground)] uppercase block mb-0.5">
            INTELLIGENCE
          </span>
          <h1 className="font-serif-display text-2xl lg:text-[32px] font-normal text-[var(--foreground)] tracking-wide leading-tight">
            Understand. Ask. Act.
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 max-w-xl font-normal">
            AI-powered insights, analytics and reports for better decisions and faster response.
          </p>
        </div>
      </div>

      {/* 2. 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        
        {/* Card 1: Total Incidents Analysed */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Brain className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium block leading-tight truncate">Total Incidents Analysed</span>
              <span className="text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight block font-sans mt-0.5">248</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-emerald-600">↑ 12%</span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-normal whitespace-nowrap">vs last 7 days</span>
          </div>
        </div>

        {/* Card 2: Insights Generated */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-[1.8]">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" fill="currentColor" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium block leading-tight truncate">Insights Generated</span>
              <span className="text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight block font-sans mt-0.5">1,420</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-emerald-600">↑ 18%</span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-normal whitespace-nowrap">vs last 7 days</span>
          </div>
        </div>

        {/* Card 3: Reports Created */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] shrink-0">
              <FileText className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium block leading-tight truncate">Reports Created</span>
              <span className="text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight block font-sans mt-0.5">36</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="text-[11px] font-semibold text-emerald-600">↑ 6%</span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-normal whitespace-nowrap">vs last 7 days</span>
          </div>
        </div>

        {/* Card 4: Avg. Response Time */}
        <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Clock className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium block leading-tight truncate">Avg. Response Time</span>
              <span className="text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight block font-sans mt-0.5 whitespace-nowrap">2.3 min</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end shrink-0 pl-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[9.5px] font-semibold text-emerald-600 border border-emerald-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
            <div className="flex items-center gap-0.5 mt-0.5 shrink-0">
              <span className="text-[10.5px] font-semibold text-emerald-600">↓ 42%</span>
              <span className="text-[9.5px] text-[var(--muted-foreground)] font-normal whitespace-nowrap ml-1">vs last 7 days</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Main Operational Content Grid: Left 8 Cols (Analytics + 2 Expanded Cards), Right 4 Cols (AI Copilot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0">
        
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Top Row: Operational Analytics (60%) + Regional Risk Overview (40%) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Operational Analytics Card */}
            <div className="md:col-span-7 bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--primary)]" />
                  <h3 className="text-xs font-bold text-[var(--foreground)]">Operational Analytics</h3>
                </div>

                {/* Interactive Timeframe Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[var(--background)] hover:bg-[var(--muted)] border border-[var(--border)] rounded-md text-[11px] font-medium text-[var(--foreground)] cursor-pointer shadow-2xs"
                  >
                    <span>{timeRange}</span>
                    <ChevronDown className="w-3 h-3 text-[var(--muted-foreground)]" />
                  </button>

                  {timeDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-32 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-30 py-1 text-xs">
                      {(['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setTimeRange(opt);
                            setTimeDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left text-xs cursor-pointer hover:bg-[var(--background)] flex items-center justify-between ${
                            timeRange === opt ? 'font-bold text-[var(--primary)] bg-[var(--secondary)]/50' : 'text-[var(--foreground)]'
                          }`}
                        >
                          <span>{opt}</span>
                          {timeRange === opt && <Check className="w-3 h-3 text-[var(--primary)]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Sub-tabs for analytics category */}
              <div className="flex items-center gap-3 sm:gap-4 border-b border-[var(--border)] text-[11px] pb-1.5 mb-2 overflow-x-auto">
                {[
                  { id: 'incidents', label: 'Incidents' },
                  { id: 'needs', label: 'Needs' },
                  { id: 'missions', label: 'Missions' },
                  { id: 'population', label: 'Population' },
                  { id: 'resources', label: 'Resources' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setAnalyticsCategory(c.id as any)}
                    className={`cursor-pointer transition-colors pb-0.5 relative whitespace-nowrap ${
                      analyticsCategory === c.id
                        ? 'text-[var(--primary)] font-bold'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium'
                    }`}
                  >
                    <span>{c.label}</span>
                    {analyticsCategory === c.id && (
                      <div className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Multi-line Dynamic SVG Chart */}
              <div className="relative h-44 w-full">
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = paddingTop + ratio * chartH;
                    return (
                      <g key={i}>
                        <line 
                          x1={paddingLeft} 
                          y1={y} 
                          x2={svgWidth - paddingRight} 
                          y2={y} 
                          stroke="var(--border)"
                          strokeWidth="1" 
                        />
                        <text 
                          x={paddingLeft - 8} 
                          y={y + 3} 
                          textAnchor="end" 
                          className="text-[9px] fill-slate-400 font-mono"
                        >
                          {Math.round(yMax * (1 - ratio))}
                        </text>
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="dynamicAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={currentAnalytics.seriesColors[0]} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={currentAnalytics.seriesColors[0]} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Primary Area Fill */}
                  <path
                    d={generateAreaPath('series1')}
                    fill="url(#dynamicAreaGrad)"
                  />

                  {/* Series 1 Line */}
                  <path
                    d={generateSmoothPath('series1')}
                    fill="none"
                    stroke={currentAnalytics.seriesColors[0]}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Series 2 Line */}
                  <path
                    d={generateSmoothPath('series2')}
                    fill="none"
                    stroke={currentAnalytics.seriesColors[1]}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Series 3 Line */}
                  <path
                    d={generateSmoothPath('series3')}
                    fill="none"
                    stroke={currentAnalytics.seriesColors[2]}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  {/* Series 4 Line */}
                  <path
                    d={generateSmoothPath('series4')}
                    fill="none"
                    stroke={currentAnalytics.seriesColors[3]}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    strokeLinecap="round"
                  />

                  {/* Data Points with interactive Hover */}
                  {activePoints.map((pt, idx) => {
                    const x = getX(idx);
                    const y1 = getY(pt.series1);
                    const isHovered = hoveredPointIdx === idx;
                    return (
                      <g key={idx} onMouseEnter={() => setHoveredPointIdx(idx)} onMouseLeave={() => setHoveredPointIdx(null)}>
                        {/* Hover vertical guide line */}
                        {isHovered && (
                          <line
                            x1={x}
                            y1={paddingTop}
                            x2={x}
                            y2={paddingTop + chartH}
                            stroke="#94A3B8"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                        )}

                        <circle 
                          cx={x} 
                          cy={y1} 
                          r={isHovered ? 4.5 : 3} 
                          fill={currentAnalytics.seriesColors[0]} 
                          stroke="white" 
                          strokeWidth={isHovered ? 2 : 1.5}
                          className="cursor-pointer transition-all"
                        />

                        {/* X-axis Label */}
                        <text 
                          x={x} 
                          y={paddingTop + chartH + 15} 
                          textAnchor="middle" 
                          className={`text-[9px] ${isHovered ? 'fill-blue-600 font-bold' : 'fill-slate-400'}`}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Interactive Tooltip Card */}
                {hoveredPointIdx !== null && activePoints[hoveredPointIdx] && (
                  <div 
                    className="absolute bg-[var(--color-dark-surface)] text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none z-20 border border-slate-700"
                    style={{
                      left: `${Math.min(Math.max(getX(hoveredPointIdx) - 40, 10), 300)}px`,
                      top: '10px'
                    }}
                  >
                    <div className="font-bold border-b border-slate-700 pb-1 mb-1 text-slate-200">
                      {activePoints[hoveredPointIdx].label} ({currentAnalytics.unit})
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between gap-3 text-[var(--primary)]">
                        <span>{currentAnalytics.seriesNames[0]}:</span>
                        <span className="font-mono font-bold">{activePoints[hoveredPointIdx].series1}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-amber-300">
                        <span>{currentAnalytics.seriesNames[1]}:</span>
                        <span className="font-mono font-bold">{activePoints[hoveredPointIdx].series2}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-emerald-300">
                        <span>{currentAnalytics.seriesNames[2]}:</span>
                        <span className="font-mono font-bold">{activePoints[hoveredPointIdx].series3}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-purple-300">
                        <span>{currentAnalytics.seriesNames[3]}:</span>
                        <span className="font-mono font-bold">{activePoints[hoveredPointIdx].series4}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Chart Legend */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-[10px] text-[var(--muted-foreground)] border-t border-[var(--border)] pt-2 mt-1 flex-wrap">
                {currentAnalytics.seriesNames.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: currentAnalytics.seriesColors[idx] }}
                    />
                    <span className="truncate max-w-[100px]">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Risk Overview Card */}
            <div className="md:col-span-5 bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[var(--foreground)]">Regional Risk Overview</h3>
                <button 
                  onClick={() => onNavigateToTab?.('map')}
                  className="text-[11px] font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer"
                >
                  <span>View Map</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Two-Column Area: Map on Left, Legend on Right */}
              <div className="flex items-center gap-4 my-auto">
                
                {/* Left: Detailed North East Regional Risk Map */}
                <div 
                  onClick={() => onNavigateToTab?.('map')}
                  className="relative w-[58%] h-44 rounded-lg overflow-hidden border border-[var(--border)] bg-[#0F1823] shrink-0 shadow-inner cursor-pointer group"
                >
                  {/* Satellite Backdrop */}
                  <img
                    src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/7/54/100"
                    alt="Northeast Satellite Terrain"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 filter saturate-150 contrast-125 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* SVG Geographic Northeast Choropleth Layer */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 160">
                    <defs>
                      <linearGradient id="neArunachalRed" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="neAssamYellow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#EAB308" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="neMeghalayaGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.85" />
                      </linearGradient>
                    </defs>

                    {/* Arunachal Pradesh (High Risk / Red) */}
                    <path
                      d="M 65 55 L 85 45 L 115 35 L 145 25 L 170 30 L 160 50 L 135 55 L 110 65 L 80 65 Z"
                      fill="url(#neArunachalRed)"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      strokeOpacity="0.8"
                    />

                    {/* Nagaland & Manipur */}
                    <path
                      d="M 135 55 L 160 50 L 165 75 L 155 105 L 140 110 L 135 85 L 130 65 Z"
                      fill="#EA580C"
                      fillOpacity="0.8"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      strokeOpacity="0.8"
                    />

                    {/* Assam Brahmaputra Valley */}
                    <path
                      d="M 35 70 L 65 55 L 80 65 L 110 65 L 135 55 L 130 65 L 135 85 L 105 90 L 75 90 L 45 85 Z"
                      fill="url(#neAssamYellow)"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      strokeOpacity="0.8"
                    />

                    {/* Meghalaya */}
                    <path
                      d="M 45 85 L 75 90 L 105 90 L 100 110 L 45 110 Z"
                      fill="url(#neMeghalayaGreen)"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      strokeOpacity="0.8"
                    />

                    {/* Mizoram & Tripura */}
                    <path
                      d="M 105 90 L 135 85 L 140 110 L 130 135 L 115 145 L 105 125 L 100 110 Z"
                      fill="#F59E0B"
                      fillOpacity="0.75"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      strokeOpacity="0.8"
                    />
                    <path
                      d="M 85 110 L 105 110 L 105 135 L 85 130 Z"
                      fill="#10B981"
                      fillOpacity="0.8"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      strokeOpacity="0.8"
                    />

                    {/* Regional Outline Perimeter Glow */}
                    <path
                      d="M 35 70 
                         L 65 55 L 85 45 L 115 35 L 145 25 L 170 30 
                         L 160 50 L 165 75 L 155 105 L 140 110 L 130 135 L 115 145 
                         L 105 135 L 85 130 L 85 110 L 45 110 L 35 70 Z"
                      fill="none"
                      stroke="#FFAA44"
                      strokeWidth="1.2"
                      strokeOpacity="0.9"
                    />
                  </svg>
                </div>

                {/* Right: Legend Stack */}
                <div className="flex-1 space-y-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0 animate-pulse" />
                    <div>
                      <span className="font-semibold text-[var(--foreground)] block leading-tight text-xs">High Risk</span>
                      <span className="text-[var(--muted-foreground)] text-[11px] block mt-0.5">3 districts</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                    <div>
                      <span className="font-semibold text-[var(--foreground)] block leading-tight text-xs">Medium Risk</span>
                      <span className="text-[var(--muted-foreground)] text-[11px] block mt-0.5">7 districts</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                    <div>
                      <span className="font-semibold text-[var(--foreground)] block leading-tight text-xs">Low Risk</span>
                      <span className="text-[var(--muted-foreground)] text-[11px] block mt-0.5">12 districts</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Row: 2 Expanded Cards (Latest Insights & Recent Reports) taking full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Latest Insights Card (Expanded 50% width) */}
            <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <h3 className="text-xs font-bold text-[var(--foreground)]">Latest Insights & Early Warnings</h3>
                </div>
                <button 
                  onClick={() => onNavigateToTab?.('replanning')}
                  className="text-[11px] font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Item 1 */}
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[var(--background)] transition border border-transparent hover:border-[var(--border)]">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-[var(--foreground)] text-xs truncate">Increased landslide risk in Nagaland & Manipur</span>
                      <span className="text-[10px] text-[var(--muted-foreground)] shrink-0 ml-1 font-mono">2h ago</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Based on 48h rainfall forecast (180mm) and terrain slope shear analysis.</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700">Critical Priority</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">Dimapur & Churachandpur</span>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[var(--background)] transition border border-transparent hover:border-[var(--border)]">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-[var(--foreground)] text-xs truncate">Road access likely to be disrupted on NH-27</span>
                      <span className="text-[10px] text-[var(--muted-foreground)] shrink-0 ml-1 font-mono">4h ago</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Dima Hasao mountain pass at high risk of debris flow. BRO bypass active.</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-700">Route Warning</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">Assam Corridor R2</span>
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[var(--background)] transition border border-transparent hover:border-[var(--border)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-[var(--foreground)] text-xs truncate">Critical medicine shortage projected</span>
                      <span className="text-[10px] text-[var(--muted-foreground)] shrink-0 ml-1 font-mono">6h ago</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Tura, West Garo Hills – 28% stock remaining; restocking convoy underway.</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[var(--secondary)] text-[var(--primary)]">Supply Chain</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">Meghalaya Central</span>
                    </div>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[var(--background)] transition border border-transparent hover:border-[var(--border)]">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-[var(--foreground)] text-xs truncate">Evacuation resettlement milestone reached</span>
                      <span className="text-[10px] text-[var(--muted-foreground)] shrink-0 ml-1 font-mono">8h ago</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">6,800+ citizens relocated to secure high-ground shelters with zero casualties.</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700">Safe Resettlement</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">All 8 NER States</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Recent Reports Card (Expanded 50% width) */}
            <div className="bg-[var(--card)] border border-[var(--border)]/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--primary)]" />
                  <h3 className="text-xs font-bold text-[var(--foreground)]">Recent Situational Reports</h3>
                </div>
                <button 
                  onClick={() => onNavigateToTab?.('replanning')}
                  className="text-[11px] font-semibold text-[var(--primary)] hover:text-[var(--primary)] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  {
                    title: 'Landslide Risk Assessment & Spatial Matrix',
                    region: 'Nagaland & Manipur',
                    time: '16 Sep 2025, 12:30',
                    tag: 'Risk Analysis',
                    tagClass: 'bg-[var(--muted)] text-[var(--foreground)]',
                    size: '2.4 MB'
                  },
                  {
                    title: 'Regional Supply Chain & Warehouse Stock Audit',
                    region: 'Assam & Meghalaya',
                    time: '16 Sep 2025, 10:15',
                    tag: 'Logistics',
                    tagClass: 'bg-[var(--secondary)] text-[var(--primary)]',
                    size: '1.8 MB'
                  },
                  {
                    title: 'Population Impact & Vulnerability Matrix',
                    region: 'Brahmaputra Basin',
                    time: '15 Sep 2025, 18:45',
                    tag: 'Population',
                    tagClass: 'bg-indigo-100 text-indigo-700',
                    size: '3.1 MB'
                  },
                  {
                    title: '48-Hour Doppler Weather & Hydrology Forecast',
                    region: 'NER Northeast Sector',
                    time: '15 Sep 2025, 16:20',
                    tag: 'Meteorology',
                    tagClass: 'bg-[var(--secondary)] text-[var(--primary)]',
                    size: '4.5 MB'
                  },
                  {
                    title: 'Mission Performance & Fleet Telemetry Audit',
                    region: 'All 8 Regions',
                    time: '15 Sep 2025, 14:10',
                    tag: 'Operations',
                    tagClass: 'bg-emerald-100 text-emerald-700',
                    size: '1.2 MB'
                  },
                ].map((rep, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[var(--background)] transition border border-transparent hover:border-[var(--border)] cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--muted)] group-hover:bg-[var(--secondary)] text-[var(--muted-foreground)] group-hover:text-[var(--primary)] flex items-center justify-center shrink-0 transition">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-medium text-[var(--foreground)] text-xs truncate group-hover:text-[var(--primary)] transition">
                          {rep.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--muted-foreground)] mt-0.5">
                          <span>{rep.region}</span>
                          <span>•</span>
                          <span>{rep.time}</span>
                          <span>•</span>
                          <span className="font-mono">{rep.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${rep.tagClass}`}>
                        {rep.tag}
                      </span>
                      <Download className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: AI Copilot Chat Card (4 Cols) */}
        <div className="lg:col-span-4 bg-[var(--card)] border border-[var(--border)]/90 rounded-xl shadow-2xs flex flex-col h-full min-h-[560px]">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">AI Copilot</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-600 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Ask questions, query live telemetry, or explore disaster response recommendations.
            </p>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[var(--color-dark-surface)] text-white rounded-br-none shadow-xs'
                      : 'bg-[var(--background)] border border-[var(--border)]/80 text-[var(--foreground)] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* AI Response Action Buttons */}
                  {msg.actionButtons && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[var(--border)] flex-wrap">
                      <button 
                        onClick={() => onNavigateToTab?.('map')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)] text-[10px] font-semibold text-[var(--foreground)] shadow-2xs cursor-pointer"
                      >
                        <MapIcon className="w-3 h-3 text-[var(--primary)]" />
                        <span>View Map</span>
                      </button>
                      <button 
                        onClick={() => onNavigateToTab?.('replanning')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)] text-[10px] font-semibold text-[var(--foreground)] shadow-2xs cursor-pointer"
                      >
                        <span>View Full Analysis</span>
                        <ArrowRight className="w-3 h-3 text-[var(--muted-foreground)]" />
                      </button>
                    </div>
                  )}

                  {msg.timestamp && (
                    <span className="block text-[9px] text-[var(--muted-foreground)] mt-1 text-right">
                      {msg.timestamp}
                    </span>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isAiTyping && (
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl rounded-tl-none px-3.5 py-2 flex items-center gap-1.5">
                  <span className="text-[11px]">AI Copilot is thinking</span>
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-3 py-1.5 border-t border-[var(--border)] bg-[var(--background)]/80 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            {[
              'NH-27 road condition & bypass routes',
              'Shelter capacity in Aizawl & Tura',
              'Active evacuation convoys update',
            ].map((sugg, i) => (
              <button
                key={i}
                onClick={() => {
                  setChatInput(sugg);
                }}
                className="px-2 py-1 bg-[var(--card)] hover:bg-[var(--muted)] border border-[var(--border)] rounded-md text-[var(--muted-foreground)] whitespace-nowrap cursor-pointer transition"
              >
                {sugg}
              </button>
            ))}
          </div>

          {/* Chat Input Footer */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--background)]/50 rounded-b-xl">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything or request operational analysis..."
                className="w-full h-9 pl-3.5 pr-10 bg-[var(--card)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] shadow-2xs"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isAiTyping}
                className="absolute right-1.5 w-7 h-7 rounded-md bg-[var(--color-dark-surface)] hover:bg-[var(--color-dark-raised)] disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="text-center mt-2 text-[9px] text-[var(--muted-foreground)] font-mono px-1">
              <span>Powered by NER AI Copilot</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
